using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class ChatPrivateMessage
    {
        public string SenderUserId { get; set; } = string.Empty;
        public string ReceiverUserId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

}