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
    Developer,
    Client
}

public enum TaskRole
{
    Frontend,
    Designer,
    Backend,
    AI,
    Mobile,
    Fullstack
}

public enum ProficiencyLevel
{
    Junior,
    Mid,
    Senior
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
        public string? Password { get; set; } = String.Empty;
        public DateTime? Birth { get; set; }
        public string? Company { get; set; }
        public Gender? Gender { get; set; }
        [NotMapped]
        public string? GenderName
        {
            get => Gender.ToString();
            set => Gender = Enum.Parse<Gender>(value);
        }
        public string? Phone { get; set; } = String.Empty;
        public int? ManagerId { get; set; }
        public User? Manager { get; set; } = null!;

        public ProficiencyLevel? ProficiencyLevel { get; set; }
        [NotMapped]
        public string? ProficiencyLevelName
        {
            get => ProficiencyLevel.ToString();
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    ProficiencyLevel = null;
                else if (Enum.TryParse<ProficiencyLevel>(value, out var parsed))
                    ProficiencyLevel = parsed;
            }

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

        public TaskRole? TaskRole { get; set; }
        [NotMapped]
        public string? TaskRoleName
        {
            get => TaskRole.ToString();
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    TaskRole = null;
                else if (Enum.TryParse<TaskRole>(value, out var parsed))
                    TaskRole = parsed;
            }
        }

        public List<UserProject> UserProjects { get; set; } = new List<UserProject>();
        public List<Task> Tasks { get; set; } = new List<Task>();
        public Boolean IsActive { get; set; } = false;
    }
}