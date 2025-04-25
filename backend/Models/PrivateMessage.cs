using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class PrivateMessage
    {
        public int Id { get; set; }

        public int SenderUserId { get; set; }
        public int ReceiverUserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public int ChatSessionId { get; set; }
        public ChatSession ChatSession { get; set; } = default!;

        public User SenderUser { get; set; } = default!;
        public User ReceiverUser { get; set; } = default!;
    }
}