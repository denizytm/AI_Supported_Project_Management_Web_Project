using System;
using backend.Models; 

public enum ResourceType
{
    Equipment,
    Software
}

namespace backend.Models
{
    public class Resource
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public ResourceType Type { get; set; }
        public Double Cost { get; set; }
        public int? AssignedProjectId { get; set; }
        public Project AssignedProject { get; set; } = null!;
    }
}
