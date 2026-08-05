// Portfolio project

using System.ComponentModel.DataAnnotations;

public class Project
{
    public int Id { get; set; }
    
    [MaxLength(20)]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? RepoUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Many-to-many: Links to skills via ProjectSkill
    public List<ProjectSkill> ProjectSkills { get; set; } = new();
}