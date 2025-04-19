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
        [HttpPost("message/private")]
        public async Task<IActionResult> SendPrivateMessage([FromBody] ChatPrivateMessage request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Content) ||
                string.IsNullOrEmpty(request.SenderUserId) ||
                string.IsNullOrEmpty(request.ReceiverUserId))
            {
                return BadRequest("Invalid request");
            }

            if (ChatHub.UserConnections.TryGetValue(request.ReceiverUserId, out var connectionId))
            {
                var formattedMessage = $"[Özel Mesaj] {request.SenderUserId}: {request.Content}";
                await _hubContext.Clients.Client(connectionId).ReceiveMessage(formattedMessage);

                return NoContent();
            }

            return NotFound("Receiver user not available.");
        }

    }

}