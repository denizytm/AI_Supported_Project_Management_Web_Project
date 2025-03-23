using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class TaskAssignment
    {
        public int TaskId { get; set; }
        public int AssignedUserId { get; set; }
    }
}