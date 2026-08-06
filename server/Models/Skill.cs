using Microsoft.EntityFrameworkCore;

// Technical skill (can be used in multiple projects)
[Index(nameof(Name), IsUnique = true)]
public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    
    // Many-to-many: Links to projects via ProjectSkill
    public List<ProjectSkill> ProjectSkills { get; set; } = new();
}