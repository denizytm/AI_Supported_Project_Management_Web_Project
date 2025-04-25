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
        public static ChatbotMessageDto FromCreateMessageToDto(this CreateChatbotMessageDto chatbotMessage)
        {
            return new ChatbotMessageDto
            {
                Content = chatbotMessage.Content,
                UserId = chatbotMessage.UserId,
                Sender = "user"
            };
        }
        public static ChatbotMessageDto FromChatbotMessageTODto(this ChatbotMessage chatbotMessage)
        {
            return new ChatbotMessageDto
            {
                Content = chatbotMessage.Content,
                Sender = chatbotMessage.Sender,
                UserId = chatbotMessage.UserId
            };
        }
    }
}