using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.ChatModel
{
    public class ChatModelDto
    {
        public int UserId { get; set; }
        public string Input { get; set; } = String.Empty;
        public string Sender { get; set; } = String.Empty;
    }
}