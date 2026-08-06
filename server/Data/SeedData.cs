using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    // Idempotent: each entity is seeded independently, skipped if it already has rows
    public static async Task InitializeAsync(AppDbContext context)
    {
        await SeedProjectsAsync(context);
        await SeedExperienceAsync(context);
    }

    private static async Task SeedProjectsAsync(AppDbContext context)
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

    private static async Task SeedExperienceAsync(AppDbContext context)
    {
        if (await context.Experiences.AnyAsync())
            return;

        var role = new Experience
        {
            Type = ExperienceType.Role,
            Organisation = "TheGameCreators",
            Title = "Junior Programmer — Full Stack Mobile Development (React Native)",
            Location = "Remote",
            StartDate = new DateOnly(2025, 9, 1),
            EndDate = null,
            Summary = "Architected, developed and delivered new features and enhancements across Theory 4 in 1 Test Kit and ADIHubb, building scalable React Native solutions for iOS and Android used by over one million learners and driving instructors.",
            Highlights =
            [
                "Collaborated with designers, testers, and stakeholders throughout the development lifecycle to deliver production-ready features aligned with business requirements.",
                "Contributed to the maintenance and modernisation of a large legacy codebase, improving code reuse, maintainability, and long-term scalability.",
                "Designed and implemented a custom messaging REST API between instructors and learners, replacing a third-party provider to reduce operational costs while improving flexibility and control over future feature development.",
                "Implemented Firebase analytics and event tracking to measure feature adoption, user behaviour, and business performance."
            ]
        };

        var bsc = new Experience
        {
            Type = ExperienceType.Education,
            Organisation = "Glasgow Caledonian University",
            Title = "BSc in Software Development for Business (First Class Honours)",
            Location = "Glasgow, Scotland",
            StartDate = new DateOnly(2023, 9, 1),
            EndDate = new DateOnly(2025, 5, 1),
            Summary = string.Empty,
            Highlights = []
        };

        var hnd = new Experience
        {
            Type = ExperienceType.Education,
            Organisation = "City of Glasgow College",
            Title = "HND in Computing Science (A)",
            Location = "Glasgow, Scotland",
            StartDate = new DateOnly(2021, 8, 1),
            EndDate = new DateOnly(2023, 5, 1),
            Summary = string.Empty,
            Highlights = []
        };

        context.Experiences.AddRange(role, bsc, hnd);

        await context.SaveChangesAsync();
    }
}
