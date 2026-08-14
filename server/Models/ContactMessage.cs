using System.ComponentModel.DataAnnotations;

// Contact form submission
public class ContactMessage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    [MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public ContactMessageStatus Status { get; set; } = ContactMessageStatus.Pending;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow; // Defaults to now

    [MaxLength(2000)]
    public string? ErrorMessage { get; set; } // Optional error message for failed submissions
}