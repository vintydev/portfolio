namespace VintyDev.Api.Dto;

// Minimal DTO shaping the JSON returned by the API
public class ExperienceDto
{
	public int Id { get; init; }
	public string Type { get; init; } = string.Empty;
	public string Organisation { get; init; } = string.Empty;
	public string Title { get; init; } = string.Empty;
	public string? Location { get; init; }
	public DateOnly StartDate { get; init; }
	public DateOnly? EndDate { get; init; }
	public string Summary { get; init; } = string.Empty;
	public List<string> Highlights { get; init; } = [];
}
