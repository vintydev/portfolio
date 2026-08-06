// Junction table: links Experience to Skill (many-to-many)
public class ExperienceSkill
{
    public int ExperienceId { get; set; }
    public Experience Experience { get; set; } = new();

    public int SkillId { get; set; }
    public Skill Skill { get; set; } = new();
}
