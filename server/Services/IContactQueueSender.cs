
namespace VintyDev.Api.Services
{

    // Defines a contract for dispatching contact messages for asynchronous processing.
    // Implementations can use different backends (for example, Azure Queue or Service Bus),
    // while callers depend only on this abstraction
    public interface IContactQueueSender
    {
        Task EnqueueMessageAsync(ContactMessageQueueItem item, CancellationToken cancellationToken = default);
    }
}