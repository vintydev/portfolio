using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VintyDev.Api.Dto;

namespace VintyDev.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExperienceController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<ExperienceController> _logger;

        // DB context + logger injected via DI
        public ExperienceController(AppDbContext dbContext, ILogger<ExperienceController> logger) => (_dbContext, _logger) = (dbContext, logger);

        // GET api/experience
        // Returns the full experience timeline (roles + education), most recent first. Read-only: AsNoTracking for better performance
        [HttpGet]
        public async Task<ActionResult<List<ExperienceDto>>> GetAll()
        {
            try
            {
                var experience = await _dbContext.Experiences
                    .AsNoTracking()
                    .OrderByDescending(e => e.StartDate)
                    .Select(e => new ExperienceDto
                {
                    Id = e.Id,
                    Type = e.Type == ExperienceType.Role ? "role" : "education",
                    Organisation = e.Organisation,
                    Title = e.Title,
                    Location = e.Location,
                    LogoUrl = e.LogoUrl,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Summary = e.Summary,
                    Highlights = e.Highlights.OrderBy(h => h.SortOrder).Select(h => h.Text).ToList(),
                    Skills = e.ExperienceSkills.Select(es => new ExperienceSkillDto
                    {
                        Name = es.Skill.Name,
                        Category = es.Skill.Category
                    }).ToList()
                })
                    .ToListAsync();

                return Ok(experience);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get experience");
                return StatusCode(500, "An error occurred while fetching experience.");
            }
        }
    }
}
