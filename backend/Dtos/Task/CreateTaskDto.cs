using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Task
{
    public class CreateTaskDto
    {
        public string TaskName { get; set; } = String.Empty;
        public string TypeName { get; set; } = String.Empty;
        public int TaskLabelId { get; set; }
        public DateTime DueDate { get; set; }
        public string TaskLevelName { get; set; } = String.Empty;
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        public Double EstimatedHours { get; set; }
        public int Progress { get; set; }
        public string Note { get; set; } = String.Empty;
        public int ProjectId { get; set; }
        public int? TaskId { get; set; }
        public int UserId { get; set; }
    }
}