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
        public string Description { get; set; } = String.Empty;

        public int TaskLabelId { get; set; }
        public TaskLabel TaskLabel { get; set; } = null!;

        public DateTime StartDate { get; set; }
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

        public string Note { get; set; } = String.Empty;

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public int? TaskId { get; set; }
        public Task? DependingTask { get; set; } = null!;

        public int? UserId { get; set; }  
        public User? AssignedUser { get; set; } 

        public int TaskTypeId { get; set; }
        public TaskType TaskType { get; set; } = null!;
    }
}