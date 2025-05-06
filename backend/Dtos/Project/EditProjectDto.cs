using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Project
{
    public class EditProjectDto
    {
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public int ProjectTypeId { get; set; }
        public int Budget { get; set; }
        public int SpentBudget { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        public int ManagerId { get; set; }
        public int CustomerId { get; set; }
    }
}