using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public enum ProjectStatus {
    Active,
    Completed,
    OnHold
}

namespace backend.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectTypeId { get; set; }
        public List<Technology> Technologies { get; set; } = null!;
        public ProjectType ProjectType { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ProjectStatus Status { get; set; } 
        public List<Task> Tasks { get; set; } = null!;
        public List<User> AssignedUsers { get; set; } = null!;
    }
}