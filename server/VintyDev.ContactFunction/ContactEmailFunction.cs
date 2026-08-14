using System.Text.Json;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Net.Sockets;
using Microsoft.Data.SqlClient;


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

            // Declare a variable to hold the deserialized contact message queue item
            ContactMessageQueueItem? item = null;

            // Create a new SmtpClient instance to send the email
            using var smtpClient = new SmtpClient();

            try
            {

                // Assign the deserialized contact message queue item to the 'item' variable, 
                // or throw an exception if deserialization fails
                item = JsonSerializer.Deserialize<ContactMessageQueueItem>(queueMessage)
               ?? throw new InvalidOperationException("Failed to deserialize contact queue message.");

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


                // Attempt to connect to the SMTP server, authenticate, and send the email message
                await smtpClient.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtpClient.AuthenticateAsync(username, password);
                await smtpClient.SendAsync(message);

                _logger.LogInformation("Contact message from {Name} <{Email}> sent successfully.", item.Name, item.Email);

                // Then update the status of the contact message in the database to 'Sent'
                await UpdateStatusAsync(item.Id, ContactMessageStatus.Sent, errorMessage: null);

            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize contact queue message. Raw payload length: {Length}.", queueMessage?.Length ?? 0);
                throw;
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Missing or invalid configuration/payload while processing contact message from {Name}.", item?.Name ?? "(unknown)");
                
                if(item != null)
                {
                    await UpdateStatusAsync(item.Id, ContactMessageStatus.Failed, ex.Message);
                }
                
                throw;
            }
            catch (AuthenticationException ex)
            {
                _logger.LogError(ex, "SMTP authentication failed for contact message from {Name} <{Email}>.", item?.Name, item?.Email);
                
                if(item != null)
                {
                    await UpdateStatusAsync(item.Id, ContactMessageStatus.Failed, ex.Message);
                }
                
                throw;
            }
            catch (SocketException ex)
            {
                _logger.LogError(ex, "Could not reach SMTP host for contact message from {Name} <{Email}>.", item?.Name, item?.Email);

                if(item != null)
                {
                    await UpdateStatusAsync(item.Id, ContactMessageStatus.Failed, ex.Message);
                }

                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error sending contact message from {Name} <{Email}>.", item?.Name, item?.Email);

                // Log the error and update the status of the contact message in the database to 'Failed' if we have a valid item
                if(item != null)
                {
                    await UpdateStatusAsync(item.Id, ContactMessageStatus.Failed, ex.Message);
                }

                throw;
            }
            finally
            {
                await smtpClient.DisconnectAsync(true);
            }
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

        // Update the status of the contact message in the database after processing, 
        // using a direct SQL connection and command to update the record since this 
        // function does not have access to the Entity Framework DbContext
        private async Task UpdateStatusAsync(int messageId, ContactMessageStatus status, string? errorMessage)
        {
            var connectionString = RequireConfig("ConnectionStrings:DefaultConnection");

            await using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            await using var command = connection.CreateCommand();
            command.CommandText =
                "UPDATE ContactMessages SET Status = @Status, ErrorMessage = @ErrorMessage WHERE Id = @Id";
            command.Parameters.AddWithValue("@Status", status.ToString());
            command.Parameters.AddWithValue("@ErrorMessage", (object?)errorMessage ?? DBNull.Value);
            command.Parameters.AddWithValue("@Id", messageId);

            await command.ExecuteNonQueryAsync();
        }

    }
}