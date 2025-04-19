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
        public int UserId { get; set; }
        public User? User { get; set; } = null!;
        public int ChatSessionId { get; set; }
        public ChatSession? ChatSession { get; set; } = null!;
    }
}