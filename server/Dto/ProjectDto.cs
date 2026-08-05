namespace VintyDev.Api.Dto;

// Minimal DTO shaping the JSON returned by the API
public class ProjectDto
{
	public int Id { get; init; }
	public string Title { get; init; } = string.Empty;
	public string Description { get; init; } = string.Empty;
	public string? RepoUrl { get; init; }
	public string? LiveUrl { get; init; }
	public string? ImageUrl { get; init; }
	public List<string> Skills { get; init; } = [];
}


