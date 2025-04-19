using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ChatModel;
using backend.Models;

namespace backend.Mappers
{
    public static class ChatModelMappers
    {
        public static ChatModel FromCreateDtoToModel (this CreateChatModelDto createChatModelDto){
            return new ChatModel{
                Input = createChatModelDto.Input,
                UserId = createChatModelDto.UserId
            };
        }

        public static ChatModelDto FromModelToDto (this ChatModel chatModel){
            return new ChatModelDto{
                Input = chatModel.Input,
                UserId = chatModel.UserId
            };
        }

    }
}