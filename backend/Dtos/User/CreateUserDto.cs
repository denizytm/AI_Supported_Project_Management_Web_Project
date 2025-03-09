using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class CreateUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public ProficiencyLevel ProficiencyLevel { get; set; }
        public Role Role { get; set; }
        public AvailabilityStatus Status { get; set; }
    }
}