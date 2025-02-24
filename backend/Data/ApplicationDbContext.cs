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

        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<backend.Models.Task> Tasks { get; set; }
        public DbSet<Technology> Technologies { get; set; } 
        public DbSet<User> Users { get; set; }
    }
}
