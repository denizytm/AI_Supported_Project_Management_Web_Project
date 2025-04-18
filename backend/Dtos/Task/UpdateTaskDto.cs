using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Dtos.Task
{
    public class UpdateTaskDto
    {
        public string Description { get; set; } = String.Empty;
        public int TaskNameId { get; set; }
        public string TaskTypeName { get; set; } = String.Empty;
        public string TaskLabelName { get; set; } = String.Empty;
        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }
        public string TaskLevelName { get; set; } = String.Empty;
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        public int Progress { get; set; }
        public string Note { get; set; } = String.Empty;
        public int? TaskId { get; set; }
        public int UserId { get; set; }
    }
}