namespace VintyDev.Api.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string to, string subject, string htmlMessage, string? replyTo = null);
    }
}
