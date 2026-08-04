using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    // Idempotent: skips entirely if any project already exists
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (await context.Projects.AnyAsync())
            return;

        var skills = new[]
        {
            new Skill { Name = "C#", Category = "Backend" },
            new Skill { Name = "ASP.NET Core", Category = "Backend" },
            new Skill { Name = "PostgreSQL", Category = "Backend" },
            new Skill { Name = "React", Category = "Frontend" },
            new Skill { Name = "TypeScript", Category = "Frontend" },
        };

        var portfolio = new Project
        {
            Title = "vinty.dev Portfolio",
            Description = "Personal portfolio site built with .NET Core and React.",
            RepoUrl = "https://github.com/vinnyr1999/vinty-dev",
            LiveUrl = "https://vinty.dev",
        };
        portfolio.ProjectSkills.AddRange(skills.Select(s => new ProjectSkill { Skill = s }));

        var sample = new Project
        {
            Title = "Sample Project Two",
            Description = "A placeholder second project for testing pagination and listing.",
        };
        sample.ProjectSkills.AddRange(skills
            .Where(s => s.Name is "React" or "TypeScript")
            .Select(s => new ProjectSkill { Skill = s }));

        context.Projects.AddRange(portfolio, sample);

        await context.SaveChangesAsync();
    }
}
