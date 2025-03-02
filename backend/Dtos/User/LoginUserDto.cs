using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.User
{
    public class LoginUserDto
    {
        public string Email { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
    }
}