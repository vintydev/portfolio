// Portfolio project

using System.ComponentModel.DataAnnotations;

public class Project
{
    public int Id { get; set; }
    
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? RepoUrl { get; set; }

    [MaxLength(500)]
    public string? LiveUrl { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Many-to-many: Links to skills via ProjectSkill
    public List<ProjectSkill> ProjectSkills { get; set; } = new();
}