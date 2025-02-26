using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public DateTime SentAt { get; set; }
/* 
        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;

        public int? ProjectId { get; set; }
        public Project Project { get; set; } = null!; */
    }
}