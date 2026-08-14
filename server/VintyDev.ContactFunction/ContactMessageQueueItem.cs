namespace VintyDev.ContactFunction
{

    // Use record to define an immutable data structure for the contact message queue item
    // This is a more concise way to define a class with properties that are set only
    // during initialisation and cannot be modified afterwards
    // This is useful for data transfer objects (DTOs) that are passed between different layers of the application
    public record ContactMessageQueueItem(int Id, string Name, string Email, string Message);
}