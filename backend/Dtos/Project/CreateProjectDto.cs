using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Project
{
    public class CreateProjectDto
    {
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public string ProjectTypeName { get; set; } = String.Empty;
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        public int UserId { get; set; }
    }
}
