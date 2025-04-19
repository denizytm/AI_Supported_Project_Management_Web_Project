using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ChatbotMessage
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Sender { get; set; } = String.Empty; 
        public string Content { get; set; } = String.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}