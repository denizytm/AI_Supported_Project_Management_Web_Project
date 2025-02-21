using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Resource
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Type { get; set; } = String.Empty; // "Human", "Equipment", vs.
        public int Quantity { get; set; }

        // Kaynağın projelere atanabilirliğini gösterebiliriz
        public ICollection<Project> AssignedProjects { get; set; }
    }
}
