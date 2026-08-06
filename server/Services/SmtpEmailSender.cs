using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace VintyDev.Api.Services
{
    // SmtpEmailSender class implements the IEmailSender interface to send emails using SMTP
    // port, host, and credentials are retrieved from the configuration
    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Sends an email asynchronously using SMTP with the specified parameters
        public async Task SendEmailAsync(string to, string subject, string htmlMessage, string? replyTo = null)
        {
            var host = RequireConfig("Smtp:Host");
            var port = int.Parse(_configuration["Smtp:Port"] ?? "587");
            var fromAddress = RequireConfig("Smtp:FromAddress");
            var fromName = _configuration["Smtp:FromName"];
            var username = RequireConfig("Smtp:Username");
            var password = RequireConfig("Smtp:Password");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromAddress));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlMessage };

            if (!string.IsNullOrWhiteSpace(replyTo))
            {
                message.ReplyTo.Add(MailboxAddress.Parse(replyTo));
            }

            using var client = new SmtpClient();

            try
            {
                await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(username, password);
                await client.SendAsync(message);
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }

        private string RequireConfig(string key)
        {
            return _configuration[key] ?? throw new InvalidOperationException($"{key} is not configured.");
        }
    }
}
