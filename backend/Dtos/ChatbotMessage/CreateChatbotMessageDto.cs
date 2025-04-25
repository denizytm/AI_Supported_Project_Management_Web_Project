using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ChatbotMessage
{
    public class CreateChatbotMessageDto
    {
        public int UserId { get; set; }
        public string Content { get; set; } = String.Empty;
        public string Sender { get; set; } = String.Empty;
    }
}