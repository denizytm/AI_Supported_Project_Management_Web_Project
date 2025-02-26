using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/chat")] // define path for controller
    [ApiController]
    public class ChatController : ControllerBase
    {

        private readonly ApplicationDbContext _context; 
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;

        public ChatController(IHubContext<ChatHub, IChatClient> hubContext, ApplicationDbContext context)
        {
            _context = context; // get DBcontext and hubContext
            _hubContext = hubContext;
        }

        [HttpPost("message/send")]
        public async Task<IActionResult> MessageFromClient(ChatMessage request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest("Invalid request");
            }

            await _hubContext.Clients.All.ReceiveMessage(request.Content); // send message to all clients 
            return NoContent();
        }
    }

}