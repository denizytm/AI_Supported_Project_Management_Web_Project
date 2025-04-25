using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PrivateMessage;
using backend.Dtos.User;

namespace backend.Dtos.ChatSession
{
    public class ChatSessionWithMessagesDto
    {
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public UserDto User1 { get; set; } = null!;
        public UserDto User2 { get; set; } = null!;
        public List<PrivateMessageDto> Messages { get; set; } = new();
        public DateTime StartedAt { get; internal set; }
    }
}