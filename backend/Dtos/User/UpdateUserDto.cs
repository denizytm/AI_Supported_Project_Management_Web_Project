using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.User
{
    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
        public Role Role { get; set; }
        public AvailabilityStatus Status { get; set; }
        public List<UserProject> UserProjects { get; set; } = new List<UserProject>();
        public List<Technology>? Technologies { get; set; }
        public List<backend.Models.Task>? Tasks { get; set; }
    }
}