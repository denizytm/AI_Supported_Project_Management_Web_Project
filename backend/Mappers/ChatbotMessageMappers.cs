using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ChatbotMessage;
using backend.Models;

namespace backend.Mappers
{
    public static class ChatbotMessageMappers
    {
        public static ChatbotMessageDto FromMessageToDto (this ChatbotMessage chatbotMessage){
            return new ChatbotMessageDto{
                Content = chatbotMessage.Content,
                UserId = chatbotMessage.UserId,
                Sender = chatbotMessage.Sender
            };
        } 
    }
}