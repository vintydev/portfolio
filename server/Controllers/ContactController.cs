using Microsoft.AspNetCore.Mvc;
using VintyDev.Api.Dto;
using VintyDev.Api.Services;

namespace VintyDev.Api.Controllers
{
    // API controller to handle sending emails 
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IContactQueueSender _queueSender;
        private readonly ILogger<ContactController> _logger;

        // Inject DB, email sender, logger, and config
        public ContactController(AppDbContext db, IContactQueueSender queueSender, ILogger<ContactController> logger)
        {
            _db = db;
            _queueSender = queueSender;
            _logger = logger;

        }


        // POST api/contact
        // Validates input, saves message, attempts to send notification email
        // If email sending fails we log the error but keep the stored message
        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] ContactRequest request, CancellationToken cancellationToken = default)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entry = new ContactMessage { Name = request.Name, Email = request.Email, Message = request.Message };

            try
            {
                _db.ContactMessages.Add(entry);
                await _db.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save contact message from {Email}", request.Email);
                return StatusCode(500, "Failed to save contact message.");
            }

            // Send the notification email asynchronously, but don't fail the request if it fails
            try
            {
                // Pass a ContactMessageQueueItem to the queue sender for processing
                await _queueSender.EnqueueMessageAsync(new ContactMessageQueueItem
                {
                    Id = entry.Id, // Available here because the entry has been saved to the database and has an Id assigned
                    Name = request.Name,
                    Email = request.Email,
                    Message = request.Message
                }, cancellationToken);
            }
            catch (Exception ex)
            {

                // Log the error, update the message status to Failed, and save the error message
                _logger.LogError(ex, "Failed to send contact notification email for {Email}", request.Email);
                entry.Status = ContactMessageStatus.Failed;
                entry.ErrorMessage = ex.Message;
                await _db.SaveChangesAsync(cancellationToken);
                return StatusCode(202, "Message received but failed to send notification email.");
            }

            return Ok();
        }
    }
}