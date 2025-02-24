using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = String.Empty; // Örneğin: "In Progress", "Completed"

        // İlişkiler
        public ICollection<Task> Tasks { get; set; }   // Projede birden fazla görev olabilir
    }
}