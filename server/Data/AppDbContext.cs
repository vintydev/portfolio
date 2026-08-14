using Microsoft.EntityFrameworkCore;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<ProjectSkill> ProjectSkills => Set<ProjectSkill>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Experience> Experiences => Set<Experience>();
    public DbSet<SiteStatus> SiteStatuses => Set<SiteStatus>();
    public DbSet<ExperienceSkill> ExperienceSkills => Set<ExperienceSkill>();
    public DbSet<ExperienceHighlight> ExperienceHighlights => Set<ExperienceHighlight>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProjectSkill>().HasKey(ps => new { ps.ProjectId, ps.SkillId });

        modelBuilder.Entity<ProjectSkill>()
            .HasOne(ps => ps.Project)
            .WithMany(p => p.ProjectSkills)
            .HasForeignKey(ps => ps.ProjectId);

        modelBuilder.Entity<ProjectSkill>()
            .HasOne(ps => ps.Skill)
            .WithMany(s => s.ProjectSkills)
            .HasForeignKey(ps => ps.SkillId);

        modelBuilder.Entity<ExperienceSkill>().HasKey(es => new { es.ExperienceId, es.SkillId });

        modelBuilder.Entity<ExperienceSkill>()
            .HasOne(es => es.Experience)
            .WithMany(e => e.ExperienceSkills)
            .HasForeignKey(es => es.ExperienceId);

        modelBuilder.Entity<ExperienceSkill>()
            .HasOne(es => es.Skill)
            .WithMany(s => s.ExperienceSkills)
            .HasForeignKey(es => es.SkillId);

        modelBuilder.Entity<ExperienceHighlight>()
            .HasOne(h => h.Experience)
            .WithMany(e => e.Highlights)
            .HasForeignKey(h => h.ExperienceId);

        modelBuilder.Entity<ContactMessage>()
            .Property(cm => cm.Status)
            .HasConversion<string>(); // Store enum as string in the database
    }
}