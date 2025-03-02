using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel.ChatCompletion;

namespace backend.Controllers
{
    [Route("api/chatbot")] // define the path for controller
    [ApiController]
    public class ChatBotController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ChatBotController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("chat")]

        public async Task<string> SendMessageToModel(IChatCompletionService chatService, ChatModel chatModel)
        {
            var response = await chatService.GetChatMessageContentAsync(chatModel.Input);
            return response?.ToString() ?? "No result";
        }

    }
}