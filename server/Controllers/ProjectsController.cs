using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VintyDev.Api.Dto;

namespace VintyDev.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<ProjectsController> _logger;

        // DB context + logger injected via DI
        public ProjectsController(AppDbContext dbContext, ILogger<ProjectsController> logger) => (_dbContext, _logger) = (dbContext, logger);
        
        // GET api/projects?page=1&pageSize=20
        // Returns a paged list of projects (skill names only). Read-only: AsNoTracking for better performance
        [HttpGet]
        public async Task<ActionResult<List<ProjectDto>>> GetAll(int page = 1, int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 20;

            try
            {
                var skip = (page - 1) * pageSize;

                var projects = await _dbContext.Projects
                    .AsNoTracking()
                    .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    RepoUrl = p.RepoUrl,
                    LiveUrl = p.LiveUrl,
                    ImageUrl = p.ImageUrl,
                    Skills = p.ProjectSkills.Select(ps => ps.Skill.Name).ToList()
                })
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get projects (page={Page}, pageSize={PageSize})", page, pageSize);
                return StatusCode(500, "An error occurred while fetching projects.");
            }
        }

        // GET api/projects/{id}
        // Returns a single project by id (skill names only). Uses AsNoTracking since this is read-only.
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProjectDto>> GetById(int id)
        {
            try
            {
                var project = await _dbContext.Projects
                    .AsNoTracking()
                    .Where(p => p.Id == id)
                    .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    RepoUrl = p.RepoUrl,
                    LiveUrl = p.LiveUrl,
                    ImageUrl = p.ImageUrl,
                    Skills = p.ProjectSkills.Select(ps => ps.Skill.Name).ToList()
                })
                    .FirstOrDefaultAsync();

                return project is null ? NotFound() : Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get project id={Id}", id);
                return StatusCode(500, "An error occurred while fetching the project.");
            }
        }
    }
}