using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public enum Role
{
    Admin,
    ProjectManager,
    Developer
}

public enum ProficiencyLevel
{
    Beginner,
    Intermediate,
    Expert
}

public enum AvailabilityStatus
{
    Available,
    Busy,
    OnLeave
}

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
        [NotMapped]
        public string ProficiencyLevelName 
        {
            get => ProficiencyLevel.ToString();
            set => ProficiencyLevel = Enum.Parse<ProficiencyLevel>(value);
        }
        public Role Role { get; set; } 
        [NotMapped]
        public string RoleName
        {
            get => Role.ToString();
            set => Role = Enum.Parse<Role>(value);
        }
        public AvailabilityStatus Status { get; set; }
        [NotMapped]
        public string StatusName
        {
            get => Status.ToString();
            set => Status = Enum.Parse<AvailabilityStatus>(value);
        }
        public List<Project>? Projects { get; set; }
        public List<Technology>? Technologies { get; set; }
        public List<Task>? AssignedTask { get; set; } 
    }
}