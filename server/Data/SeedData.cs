using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    // Idempotent: each entity is seeded independently, skipped if it already has rows
    public static async Task InitializeAsync(AppDbContext context)
    {
        await SeedProjectsAsync(context);
        await SeedExperienceAsync(context);
        await SeedSiteStatusAsync(context);
    }

    private static async Task SeedProjectsAsync(AppDbContext context)
    {
        if (await context.Projects.AnyAsync())
            return;

        var jog = new Project
        {
            Title = "Jog",
            Description = "AI-assisted mobile app helping adults with ADHD plan tasks and track symptoms, using GPT-4o for conversational task creation and Firebase for authentication and real-time data. Built as my Honours dissertation project and evaluated in a month-long study with 30 participants.",
            RepoUrl = "https://github.com/vintydev/jog",
        };

        var drivePal = new Project
        {
            Title = "DrivePal",
            Description = "Web platform connecting driving instructors and learners, with Google Maps-based instructor discovery, SignalR real-time chat, calendar booking, and Stripe payments. Built as a group project for my Integrated Project 3 module.",
            RepoUrl = "https://github.com/vintydev/DrivePal",
        };

        await AddSkillsAsync(context, jog,
        [
            ("React Native", "Frontend"), ("TypeScript", "Frontend"), ("Expo", "Frontend"),
            ("Firebase", "Backend"), ("OpenAI API", "AI")
        ]);

        await AddSkillsAsync(context, drivePal,
        [
            ("C#", "Backend"), ("ASP.NET Core", "Backend"), ("Entity Framework Core", "Backend"), ("SQL Server", "Backend"), ("SignalR", "Backend"),
            ("JavaScript", "Frontend"), ("Bootstrap", "Frontend"),
            ("Stripe", "Tools")
        ]);

        context.Projects.AddRange(jog, drivePal);

        await context.SaveChangesAsync();
    }

    private static async Task AddSkillsAsync(AppDbContext context, Project project, IEnumerable<(string Name, string Category)> skills)
    {
        foreach (var (name, category) in skills)
        {
            var skill = await GetOrCreateSkillAsync(context, name, category);
            project.ProjectSkills.Add(new ProjectSkill { Skill = skill });
        }
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
            LogoUrl = "/logos/the_game_creators_logo.png",
            StartDate = new DateOnly(2025, 9, 1),
            EndDate = new DateOnly(2026, 7, 5),
            Summary = "Architected, developed and delivered new features and enhancements across Theory 4 in 1 Test Kit and ADIHubb, building scalable React Native solutions for iOS and Android used by over one million learners and driving instructors.",
        };

        AddHighlights(role,
        [
            "Collaborated with designers, testers, and stakeholders throughout the development lifecycle to deliver production-ready features aligned with business requirements.",
            "Contributed to the maintenance and modernisation of a large legacy codebase, improving code reuse, maintainability, and long-term scalability.",
            "Designed and implemented a custom messaging REST API between instructors and learners, replacing a third-party provider to reduce operational costs while improving flexibility and control over future feature development.",
            "Implemented Firebase analytics and event tracking to measure feature adoption, user behaviour, and business performance."
        ]);

        var bsc = new Experience
        {
            Type = ExperienceType.Education,
            Organisation = "Glasgow Caledonian University",
            Title = "BSc in Software Development for Business (First Class Honours)",
            Location = "Glasgow, Scotland",
            LogoUrl = "/logos/glasgow_caledonian_university_logo.png",
            StartDate = new DateOnly(2023, 9, 1),
            EndDate = new DateOnly(2025, 5, 1),
            Summary = string.Empty
        };

        var hnd = new Experience
        {
            Type = ExperienceType.Education,
            Organisation = "City of Glasgow College",
            Title = "HND in Computing Science (A)",
            Location = "Glasgow, Scotland",
            LogoUrl = "/logos/city_of_glasgow_college_logo.png",
            StartDate = new DateOnly(2021, 8, 1),
            EndDate = new DateOnly(2023, 5, 1),
            Summary = string.Empty
        };

        await AddSkillsAsync(context, role,
        [
            ("React Native", "Frontend"), ("TypeScript", "Frontend"), ("Kotlin", "Frontend"), ("Swift", "Frontend"), ("Flutter", "Frontend"),
            ("Node.js", "Backend"), ("Firebase", "Backend"), ("JSON", "Backend"), ("RevenueCat", "Backend"), ("REST API Development", "Backend"),
            ("Figma", "Design"),
            ("GitHub Actions", "Tools"), ("GitHub Copilot", "Tools")
        ]);

        // BSc: Programming Paradigms (Scala), Web Development 2 (Node/Express), DevOps module
        // (Docker/Kubernetes/Jenkins/Ansible/SonarQube/JUnit/Git), Cloud Platform Development
        // (AWS), Secure Software Development (Burp Suite/OWASP ZAP)
        await AddSkillsAsync(context, bsc,
        [
            ("Python", "Backend"), ("Node.js", "Backend"), ("Express", "Backend"), ("Java", "Backend"), ("Scala", "Backend"),
            ("AWS", "Cloud & DevOps"), ("Docker", "Cloud & DevOps"), ("Kubernetes", "Cloud & DevOps"), ("Jenkins", "Cloud & DevOps"),
            ("Ansible", "Cloud & DevOps"), ("SonarQube", "Cloud & DevOps"), ("Git", "Cloud & DevOps"), ("JUnit", "Cloud & DevOps"),
            ("Burp Suite", "Security"), ("OWASP ZAP", "Security")
        ]);

        // HND: Java-based Swing/JDBC and C#/.NET/Visual Basic desktop projects, Databases module
        // (SQL), OOAD module (UML: Class, Use Case, Sequence, Activity diagrams)
        await AddSkillsAsync(context, hnd,
        [
            ("Java", "Backend"), ("C#", "Backend"), (".NET Core", "Backend"), ("Visual Basic", "Backend"), ("SQL", "Backend"),
            ("UML (Class, Use Case, Sequence, Activity)", "Design")
        ]);

        context.Experiences.AddRange(role, bsc, hnd);

        await context.SaveChangesAsync();
    }

    private static async Task AddSkillsAsync(AppDbContext context, Experience experience, IEnumerable<(string Name, string Category)> skills)
    {
        foreach (var (name, category) in skills)
        {
            var skill = await GetOrCreateSkillAsync(context, name, category);
            experience.ExperienceSkills.Add(new ExperienceSkill { Skill = skill });
        }
    }

    private static void AddHighlights(Experience experience, IEnumerable<string> highlights)
    {
        var sortOrder = 0;

        foreach (var text in highlights)
        {
            experience.Highlights.Add(new ExperienceHighlight { Text = text, SortOrder = sortOrder++ });
        }
    }

    // Skill.Name is uniquely indexed and shared across Projects and Experience, so reuse an
    // existing row instead of inserting a duplicate. Checking .Local first catches skills already
    // added earlier in the same unsaved batch (e.g. "Node.js" appearing in two Experience entries
    // before the single terminal SaveChangesAsync) that a DB query alone wouldn't see yet.
    private static async Task<Skill> GetOrCreateSkillAsync(AppDbContext context, string name, string category)
    {
        var tracked = context.Skills.Local.FirstOrDefault(s => s.Name == name);

        if (tracked is not null)
            return tracked;

        var existing = await context.Skills.FirstOrDefaultAsync(s => s.Name == name);

        if (existing is not null)
            return existing;

        var skill = new Skill { Name = name, Category = category };
        context.Skills.Add(skill);

        return skill;
    }

    private static async Task SeedSiteStatusAsync(AppDbContext context)
    {
        if (await context.SiteStatuses.AnyAsync())
            return;

        context.SiteStatuses.Add(new SiteStatus { IsLookingForWork = true });

        await context.SaveChangesAsync();
    }
}
