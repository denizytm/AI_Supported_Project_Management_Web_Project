using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } // "Not Started", "In Progress", "Completed"
        
        // İlişki
        public int ProjectId { get; set; }
        public Project Project { get; set; } // Her görev bir projeye ait olacak
    }
}