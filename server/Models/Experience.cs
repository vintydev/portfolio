using System.ComponentModel.DataAnnotations;

// Work role or education entry shown on the experience timeline
public enum ExperienceType
{
    Role,
    Education
}

public class Experience
{
    public int Id { get; set; }
    public ExperienceType Type { get; set; }

    [MaxLength(150)]
    public string Organisation { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Location { get; set; }

    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; } // null = present

    [MaxLength(2000)]
    public string Summary { get; set; } = string.Empty;

    public List<ExperienceHighlight> Highlights { get; set; } = new();

    // Many-to-many: Links to skills via ExperienceSkill
    public List<ExperienceSkill> ExperienceSkills { get; set; } = new();
}
