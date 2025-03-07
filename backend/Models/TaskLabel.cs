using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace backend.Models
{
    public class TaskLabel
    {
        public int Id { get; set; }
        public string Label { get; set; } = String.Empty;
    }
}