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

public enum ProjectPriority {
    Low,
    Medium,
    High 
}

namespace backend.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public ProjectType ProjectType { get; set; }
        public string ProjectTypeName {
            get => ProjectType.ToString();
            set => ProjectType = Enum.Parse<ProjectType>(value);
        }
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public int Progress { get; set; } 
        public ProjectPriority Priority { get; set; }
        [NotMapped]
        public string PriorityName { 
            get => Priority.ToString();
            set => Priority = Enum.Parse<ProjectPriority>(value);
        }
        public ProjectStatus Status { get; set; }
        [NotMapped]
        public string StatusName {
            get => Status.ToString();
            set => Status = Enum.Parse<ProjectStatus>(value);
        }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Budget { get; set; }
        public List<Task> Tasks { get; set; } = new List<Task>();
        public List<UserProject> UserProjects { get; set; } = new List<UserProject>();
        public int UserId { get; set; }
        public User Manager { get; set; } = null!;
    }
}