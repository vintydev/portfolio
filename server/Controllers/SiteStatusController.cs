using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VintyDev.Api.Dto;

namespace VintyDev.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SiteStatusController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<SiteStatusController> _logger;

        // DB context + logger injected via DI
        public SiteStatusController(AppDbContext dbContext, ILogger<SiteStatusController> logger) => (_dbContext, _logger) = (dbContext, logger);

        // GET api/sitestatus
        // Returns site-wide status flags. Falls back to all-false if no row exists yet. Read-only: AsNoTracking for better performance
        [HttpGet]
        public async Task<ActionResult<SiteStatusDto>> Get()
        {
            try
            {
                var status = await _dbContext.SiteStatuses
                    .AsNoTracking()
                    .Select(s => new SiteStatusDto { IsLookingForWork = s.IsLookingForWork })
                    .FirstOrDefaultAsync();

                return Ok(status ?? new SiteStatusDto());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get site status");
                return StatusCode(500, "An error occurred while fetching site status.");
            }
        }
    }
}
