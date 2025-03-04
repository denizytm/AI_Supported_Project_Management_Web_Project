using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

public enum ProjectStatus
{
    Active,
    Completed,
    OnHold
}

public enum ProjectType
{
    Web,
    Mobile,
    AI,
    ERP,
    Application
}

namespace backend.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectTypeId { get; set; }
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public ProjectType ProjectType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public string Process { get; set; } = String.Empty;
        public ProjectStatus Status { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Budget { get; set; }
        public List<Task> Tasks { get; set; } = new List<Task>();
        public User Manager = null!;
        public List<User> AssignedUsers { get; set; } = new List<User>();
    }
}