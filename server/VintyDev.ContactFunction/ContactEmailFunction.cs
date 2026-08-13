using System.Text.Json;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace VintyDev.ContactFunction
{

    public class ContactEmailFunction
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ContactEmailFunction> _logger;
        
        // Construct the ContactEmailFunction with injected IConfiguration and ILogger
        public ContactEmailFunction(IConfiguration configuration, ILogger<ContactEmailFunction> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }
        
        // Create the function that will be triggered by messages in the Azure Queue
        [Function("ContactEmailFunction")]
        public async Task RunAsync([QueueTrigger("contact-messages", Connection = "StorageConnection")] string queueMessage)
        {
            // Deserialize the queue message into a ContactMessageQueueItem
            var item = JsonSerializer.Deserialize<ContactMessageQueueItem>(queueMessage)
                ?? throw new InvalidOperationException("Failed to deserialize queue message.");

            var host = RequireConfig("Smtp:Host");
            var port = int.Parse(RequireConfig("Smtp:Port") ?? "587");
            var fromAddress = RequireConfig("Smtp:FromAddress");
            var fromName = RequireConfig("Smtp:FromName");
            var username = RequireConfig("Smtp:Username");
            var password = RequireConfig("Smtp:Password");
            var notifyEmail = RequireConfig("Contact:NotifyEmail");

            // Create a new MimeMessage to represent the email to be sent
            // MimeMessage is part of the MimeKit library, which provides a way to create and manipulate email messages
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromAddress));
            message.To.Add(MailboxAddress.Parse(notifyEmail));
            message.Subject = $"New Contact Message from {item.Name}";
            message.Body = new TextPart("html")
            {
                Text = $"<p><strong>Name:</strong> {item.Name}</p>" +
                       $"<p><strong>Email:</strong> {item.Email}</p>" +
                       $"<p><strong>Message:</strong></p><p>{item.Message}</p>"
            };
            message.ReplyTo.Add(MailboxAddress.Parse(item.Email));

            using var smtpClient = new SmtpClient();

            try
            {
                await smtpClient.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtpClient.AuthenticateAsync(username, password);
                await smtpClient.SendAsync(message);
            }
            finally
            {
                await smtpClient.DisconnectAsync(true);
            }

            _logger.LogInformation("Contact message from {Name} <{Email}> sent successfully.", item.Name, item.Email);
        }

        // Helper method to retrieve configuration values and throw an exception if they are not set
        private string RequireConfig(string key)
        {
            // Gather the value from the configuration using the provided key
            var value = _configuration[key];

            // Check if the value is null or whitespace, and throw an exception if it is
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"Configuration key '{key}' is not set.");
            }

            return value;
        }
      
    }
}