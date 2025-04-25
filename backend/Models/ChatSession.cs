using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ChatSession
    {
        public int Id { get; set; }

        public int User1Id { get; set; }
        public int User2Id { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }

        public bool IsActive => EndedAt == null;

        public User User1 { get; set; } = null!;
        public User User2 { get; set; } = null!;

        public List<PrivateMessage> Messages { get; set; } = new();
    }
}