using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ProjectRequest
{
    public class CreateProjectRequestDto
    {
        public int ProjectId { get; set; }

        public int RequestedById { get; set; }

        public string Description { get; set; } = string.Empty;

        public string CriticLevelName { get; set; } = String.Empty;

        public bool IsClosed { get; set; } = false;

        public string? ClosingNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
    }
}