using System.ComponentModel.DataAnnotations;

// A single bullet point under an experience entry; SortOrder preserves display order
public class ExperienceHighlight
{
    public int Id { get; set; }

    public int ExperienceId { get; set; }
    public Experience Experience { get; set; } = new();

    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    public int SortOrder { get; set; }
}
