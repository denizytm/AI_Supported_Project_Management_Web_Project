using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.PrivateMessage
{
    public class PrivateMessageDto
    {
        public int SenderUserId { get; set; }
        public int ReceiverUserId { get; set; }
        public DateTime SentAt { get; set; }
        public string Content { get; set; } = string.Empty;
    }

}