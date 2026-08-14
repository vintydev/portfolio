using System.Text;
using System.Text.Json;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using Microsoft.Extensions.Configuration;
using VintyDev.Api.Services;
using Xunit;

namespace VintyDev.Api.Tests;

// Requires Azurite running locally — see README.md in this folder.
// Regression guard for a real incident: the API's QueueClient and the
// Function's queue trigger silently disagreed on message encoding, so every
// contact message was dropped with no error in either project. This asserts
// what's actually on the wire, not just that our own code runs without throwing
public class AzureQueueContactSenderTests
{
    private const string AzuriteConnectionString = "UseDevelopmentStorage=true";
    private const string TestQueueName = "contact-messages-test";

    [Fact]
    public async Task EnqueuedMessage_IsBase64Encoded_AsAzureFunctionsQueueTriggerExpects()
    {
        // Arrange: build the sender exactly as the API does, pointed at Azurite
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Storage:ConnectionString"] = AzuriteConnectionString,
                ["Storage:ContactQueueName"] = TestQueueName
            })
            .Build();

        var sender = new AzureQueueContactSender(configuration);

        var item = new ContactMessageQueueItem
        {
            Id = 42,
            Name = "Test User",
            Email = "test@example.com",
            Message = "Hello"
        };

        // Act
        await sender.EnqueueMessageAsync(item);

        // Assert: read the message back RAW — no auto-decoding — the way the
        // Functions Worker queue trigger extension sees it on the wire.
        var rawClient = new QueueClient(
            AzuriteConnectionString,
            TestQueueName,
            new QueueClientOptions { MessageEncoding = QueueMessageEncoding.None });

        var response = await rawClient.ReceiveMessagesAsync(maxMessages: 1);
        var messages = response.Value;
        Assert.Single(messages);

        var rawBody = messages[0].MessageText;

        // This mirrors exactly what the Function's host.json (MessageEncoding:
        // Base64) does before handing the payload to ContactEmailFunction.RunAsync.
        // If AzureQueueContactSender ever stops Base64-encoding, this throws
        // FormatException right here instead of silently dropping messages in prod.
        var decodedBytes = Convert.FromBase64String(rawBody);
        var decodedJson = Encoding.UTF8.GetString(decodedBytes);

        var roundTripped = JsonSerializer.Deserialize<ContactMessageQueueItem>(decodedJson);

        Assert.NotNull(roundTripped);
        Assert.Equal(item.Id, roundTripped!.Id);
        Assert.Equal(item.Name, roundTripped.Name);
        Assert.Equal(item.Email, roundTripped.Email);
        Assert.Equal(item.Message, roundTripped.Message);

        await rawClient.DeleteAsync(); // cleanup, keeps reruns idempotent
    }
}
