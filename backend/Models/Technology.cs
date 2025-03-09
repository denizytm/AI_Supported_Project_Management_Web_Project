using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Technology
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<Project> Projects { get; set; } = new List<Project>();

        public List<User> Users { get; set; } = new List<User>();

    }
}