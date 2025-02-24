using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public enum Type {
    Web,
    Mobile,
    AI
}

namespace backend.Models
{
    public class ProjectType
    {
        public int Id { get; set; }
        public Type Type { get; set; }
    }
}