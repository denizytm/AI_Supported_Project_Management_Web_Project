using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

public enum TaskStatus
{
    ToDo,
    InProgress,
    Done
}

public enum Priority
{
    Low,
    Medium,
    High,
    Critical
}

public enum TaskLevel
{
    Beginner,
    Intermediate,
    Expert
}

namespace backend.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string TaskName { get; set; } = String.Empty;
        public string Label { get; set; } = String.Empty;
        public DateTime DueDate { get; set; }
        public TaskLevel TaskLevel { get; set; }
        [NotMapped]
        public string TaskLevelName
        {
            get => TaskLevel.ToString();
            set => TaskLevel = Enum.Parse<TaskLevel>(value);
        }
        public Priority Priority { get; set; }
        [NotMapped]
        public string PriorityName
        {
            get => Priority.ToString();
            set => Priority = Enum.Parse<Priority>(value);
        }
        public TaskStatus Status { get; set; }
        [NotMapped]
        public string StatusName
        {
            get => Status.ToString();
            set => Status = Enum.Parse<TaskStatus>(value);
        }
        public Double EstimatedHours { get; set; }
        public int Progress { get; set; }
        public string Note { get; set; } = String.Empty;
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public int? TaskId { get; set; }
        public Task? DependingTask { get; set; } = null!;
        public int UserId { get; set; }
        public User AssignedUser { get; set; } = null!;
    }
}