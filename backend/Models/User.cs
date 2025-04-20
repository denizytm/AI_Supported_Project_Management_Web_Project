using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

public enum Role
{
    Admin,
    ItManager,
    ProjectManager,
    Developer
}

public enum TaskRole
{
    Frontend,
    Designer,
    Backend,
    AI,
    Mobile
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

public enum Gender
{
    Male,
    Female,
    Undefined
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
        public DateTime? Birth { get; set; }
        public Gender? Gender { get; set; }
        [NotMapped]
        public string GenderName
        {
            get => Gender.ToString();
            set => Gender = Enum.Parse<Gender>(value);
        }
        public string? Phone { get; set; } = String.Empty;
        public int? ManagerId { get; set; } 
        public User? Manager { get; set; } = null!;

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

        public TaskRole TaskRole { get; set; }
        [NotMapped]
        public string TaskRoleName
        {
            get => TaskRole.ToString();
            set => TaskRole = Enum.Parse<TaskRole>(value);
        }

        public List<UserProject> UserProjects { get; set; } = new List<UserProject>();
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public List<Task> Tasks { get; set; } = new List<Task>();
    }
}