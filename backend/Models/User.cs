using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public enum Role
{
    Admin,
    ProjectManager,
    Developer
}

public enum ProficiencyLevel {
    Beginner,
    Intermediate,
    Expert
}

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; } 
        public Role Role { get; set; }
        public List<Project> Projects { get; set; } = null!;
        public List<Technology> Technologies { get; set; } = null!;
    }
}