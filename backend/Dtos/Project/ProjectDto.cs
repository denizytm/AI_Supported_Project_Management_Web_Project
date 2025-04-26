using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Dtos.Project
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectTypeId { get; set; } 
        public ProjectType ProjectType { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public int Progress { get; set; }
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        [Column(TypeName = "decimal(10,2)")]
        public decimal Budget { get; set; }
        public List<backend.Models.Task> Tasks { get; set; } = new List<backend.Models.Task>();
        public int ManagerId { get; set; }
        public UserDto Manager { get; set; } = null!;
        public int CustomerId { get; set; }
        public UserDto Customer { get; set; } = null!;
    }
}