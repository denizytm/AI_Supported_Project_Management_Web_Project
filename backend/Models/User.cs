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
        public string Email { get; set; } = String.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
        [JsonIgnore] // when we return a data instance, this attribute won't be shown in the JSON 
        public Role Role { get; set; }
        [NotMapped] // this makes the attribtute not to be saved in db but only in code section 
        public string RoleName
        {
            get => Role.ToString();
            set => Role = Enum.Parse<Role>(value);
        }
        public AvailabilityStatus Status { get; set; }
        public List<Project>? Projects { get; set; }
        public List<Technology>? Technologies { get; set; }
        public List<Task>? AssignedTask { get; set; } 
    }
}