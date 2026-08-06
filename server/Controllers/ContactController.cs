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
        private readonly IEmailSender _emailSender;
        private readonly ILogger<ContactController> _logger;
        private readonly string _notifyEmail;

        // Inject DB, email sender, logger, and config
        public ContactController(AppDbContext db, IEmailSender emailSender, ILogger<ContactController> logger, IConfiguration configuration)
        {
            _db = db;
            _emailSender = emailSender;
            _logger = logger;
            _notifyEmail = configuration["Contact:NotifyEmail"] ?? throw new InvalidOperationException("Contact:NotifyEmail is not configured.");
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

            // Send notification email IEmailSender.SendEmailAsync(email, subject, htmlMessage)
            try
            {
                var subject = $"New contact from {request.Name}";
                var body = $"<p><strong>Name:</strong> {request.Name}</p><p><strong>Email:</strong> {request.Email}</p><p>{System.Net.WebUtility.HtmlEncode(request.Message)}</p>";

                await _emailSender.SendEmailAsync(_notifyEmail, subject, body, replyTo: request.Email);
            }
            catch (Exception ex)
            {
                // Don't fail the whole request just because email couldn't be sent — the message is already stored
                _logger.LogError(ex, "Failed to send contact notification email for {Email}", request.Email);
                return StatusCode(202, "Message received but failed to send notification email.");
            }

            return Ok();
        }
    }
}