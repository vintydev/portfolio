using System.Text.Json;
using Azure.Storage.Queues;

namespace VintyDev.Api.Services
{
    //Enqueues contact messages to an Azure Queue for asynchronous processing
    // Implements the IContactQueueSender interface to provide a concrete implementation 
    // for sending contact messages to an Azure Queue
    public class AzureQueueContactSender : IContactQueueSender
    {


        // Declaring QueueClient to interact with Azure Queue Storage
        // use underscore to indicate that this is a private field
        private readonly QueueClient _queueClient;

        // Declare a constructor that takes an IConfiguration parameter to read configuration settings
        // This constructor initialises the QueueClient with the connection 
        // string and queue name from configuration
        public AzureQueueContactSender(IConfiguration configuration)
        {
            var connectionString = configuration["Storage:ConnectionString"]
                ?? throw new InvalidOperationException("Storage: ConnectionString is not configured.");

            var queueName = configuration["Storage:ContactQueueName"];

            // Validate that the queue name is not null or empty, 
            // throwing an exception if it is
            if (string.IsNullOrWhiteSpace(queueName))
            {
                throw new InvalidOperationException("Storage: ContactQueueName is not configured.");
            }

            // Initialise the QueueClient with the connection string and queue name
            _queueClient = new QueueClient(connectionString, queueName);
            _queueClient.CreateIfNotExists();
        }

        
        // Enqueues a contact message to the Azure Queue for asynchronous processing
        // Serialises the ContactMessageQueueItem to JSON and sends it to the queue using _queueClient
        public async Task EnqueueMessageAsync(ContactMessageQueueItem item, CancellationToken cancellationToken = default)
        {
            // Serialise the ContactMessageQueueItem to JSON
            var messageJson = JsonSerializer.Serialize(item);

            // Send the serialised message to the Azure Queue
            await _queueClient.SendMessageAsync(messageJson, cancellationToken);
        }


    }
}