using Microsoft.AspNetCore.Identity.UI.Services;

public class NoOpEmailSender : IEmailSender
{
    public Task SendEmailAsync(string email, string subject, string message)
    {
        Console.WriteLine($"[email stub] To: {email} | Subject: {subject}");
        return Task.CompletedTask;
    }
}