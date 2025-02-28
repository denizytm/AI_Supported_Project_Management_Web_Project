using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string ProficiencyLevelName { get; set; } = String.Empty;
        public string RoleName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
    }
}