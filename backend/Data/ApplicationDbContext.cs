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

            modelBuilder.Entity<UserProject>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserProjects)
                .HasForeignKey(up => up.UserId);

            modelBuilder.Entity<UserProject>()
                .HasOne(up => up.Project)
                .WithMany(p => p.UserProjects)
                .HasForeignKey(up => up.ProjectId);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Manager)
                .WithMany()
                .HasForeignKey(p => p.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Customer)
                .WithMany()
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Manager)
                .WithMany()
                .HasForeignKey(u => u.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrivateMessage>()
                .HasOne(pm => pm.SenderUser)
                .WithMany()
                .HasForeignKey(pm => pm.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrivateMessage>()
                .HasOne(pm => pm.ReceiverUser)
                .WithMany()
                .HasForeignKey(pm => pm.ReceiverUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrivateMessage>()
                .HasOne(pm => pm.ChatSession)
                .WithMany(cs => cs.Messages)
                .HasForeignKey(pm => pm.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.User1)
                .WithMany()
                .HasForeignKey(cs => cs.User1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatSession>()
                .HasOne(cs => cs.User2)
                .WithMany()
                .HasForeignKey(cs => cs.User2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatSession>()
            .HasIndex(c => new { c.User1Id, c.User2Id })
            .IsUnique()
            .HasFilter("EndedAt IS NULL");


        }

        public DbSet<User> Users { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<PrivateMessage> PrivateMessages { get; set; }
        public DbSet<ChatbotMessage> ChatbotMessages { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<backend.Models.ProjectType> ProjectTypes { get; set; }
        public DbSet<ProjectRequest> ProjectRequests { get; set; }
        public DbSet<UserProject> UserProjects { get; set; } = null!;
        public DbSet<backend.Models.Task> Tasks { get; set; }
        public DbSet<TaskType> TaskTypes { get; set; }
        public DbSet<TaskLabel> TaskLabels { get; set; }
        public DbSet<Resource> Resources { get; set; }
    }
}
