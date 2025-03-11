using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class CreateUserDto
    {
        public string Name { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public string ProficiencyLevelName { get; set; } = String.Empty;
        public string RoleName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
    }
}