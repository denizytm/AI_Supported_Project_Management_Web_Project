using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProject>()
                .HasKey(up => new { up.UserId, up.ProjectId });

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Manager)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.User)
                .WithMany()
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.User)
                .WithMany()
                .HasForeignKey(cs => cs.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.ChatSession)
                .WithMany()
                .HasForeignKey(cm => cm.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<backend.Models.Task> Tasks { get; set; }
        public DbSet<Technology> Technologies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserProject> UserProjects { get; set; } = null!;
        public DbSet<TaskLabel> TaskLabels { get; set; }
        public DbSet<TaskType> TaskTypes { get; set; }
        public DbSet<backend.Models.ProjectType> ProjectTypes { get; set; }
    }
}
