using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class RegisterUserDto
    {
        public string Email { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public DateTime? Birth { get; set; }
        public string Phone { get; set; } = String.Empty;
        public string? GenderName { get; set; }
        public string? Company { get; set; }
        public string Password { get; set; } = String.Empty;
        public Boolean IsActive { get; set; } 
    }


}