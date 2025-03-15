using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Dtos.Task
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = String.Empty;
        public TaskLabel TaskLabel { get; set; } = null!;
        public string TypeName { get; set; } = String.Empty;
        [JsonIgnore]
        public DateTime StartDate { get; set; }
        public string StartDateString => this.StartDate.ToString("yyyy-MM-dd");
        [JsonIgnore]
        public DateTime DueDate { get; set; }
        public string DueDateString => this.DueDate.ToString("yyyy-MM-dd");
        public string TaskLevelName { get; set; } = String.Empty;
        public string PriorityName { get; set; } = String.Empty;
        public string StatusName { get; set; } = String.Empty;
        public Double EstimatedHours { get; set; }
        public int Progress { get; set; }
        public string Note { get; set; } = String.Empty;
        public int ProjectId { get; set; }
        public backend.Models.Project Project { get; set; } = null!;
        public int? TaskId { get; set; }
        public backend.Models.Task? DependingTask { get; set; } = null!;
        public int TaskTypeId { get; set; }
        public TaskType TaskType { get; set; } = null!;
        public int UserId { get; set; }
        public UserDto AssignedUser { get; set; } = null!;
    }
}