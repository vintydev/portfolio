// Junction table: links Project to Skill (many-to-many)
public class ProjectSkill
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = new();
    
    public int SkillId { get; set; }
    public Skill Skill { get; set; } = new();
}