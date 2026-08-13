
namespace VintyDev.Api.Services;

// This class represents a contact message that will be sent to the Azure Queue for processing
public class ContactMessageQueueItem
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}