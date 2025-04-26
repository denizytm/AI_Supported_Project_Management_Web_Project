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
        public string? Name { get; set; } = String.Empty;
        public string? LastName { get; set; } = String.Empty;
        public string? Email { get; set; } = String.Empty;
        public string? Password { get; set; } = String.Empty;
        public string? ProficiencyLevelName { get; set; } = String.Empty;
        public string? RoleName { get; set; } = String.Empty;
        public string? StatusName { get; set; } = String.Empty;
        public string? TaskRoleName { get; set; } = String.Empty;
        public List<backend.Models.Task>? Tasks { get; set; }
    }
}