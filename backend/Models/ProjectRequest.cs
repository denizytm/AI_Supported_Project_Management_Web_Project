using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

public enum CriticLevel
{
    Low,
    Medium,
    High,
    Critical
}

namespace backend.Models
{
    public class ProjectRequest
    {
        public int Id { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public int RequestedById { get; set; }
        public User RequestedBy { get; set; } = null!;

        public string Description { get; set; } = string.Empty;

        public CriticLevel CriticLevel { get; set; }
        [NotMapped]
        public string? CriticLevellName
        {
            get => CriticLevel.ToString();
            set => CriticLevel = Enum.Parse<CriticLevel>(value);
        }

        public bool IsClosed { get; set; } = false;

        public string? ClosingNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
    }
}