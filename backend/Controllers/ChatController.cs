using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using backend.Interfaces;
using backend.Models;
using backend.Data;
using backend.Dtos.ChatSession;
using backend.Dtos.PrivateMessage;
using Microsoft.EntityFrameworkCore;
using backend.Mappers;

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

        [HttpGet("session/messages")]
        public async Task<IActionResult> GetActiveSessions([FromQuery] int userId)
        {
            var sessions = await _context.ChatSessions
                .Where(s => (s.User1Id == userId || s.User2Id == userId) && s.EndedAt == null)
                .Include(s => s.User1)
                .Include(s => s.User2)
                .ToListAsync();

            if (!sessions.Any())
                return Ok(new
                {
                    result = false,
                    message = "No active sessions found with given ID."
                });

            var response = new List<ChatSessionWithMessagesDto>();

            foreach (var session in sessions)
            {
                var messages = await _context.PrivateMessages
                    .Where(m => m.ChatSessionId == session.Id)
                    .OrderBy(m => m.SentAt)
                    .Select(m => new PrivateMessageDto
                    {
                        SenderUserId = m.SenderUserId,
                        ReceiverUserId = m.ReceiverUserId,
                        Content = m.Content,
                        SentAt = m.SentAt
                    })
                    .ToListAsync();

                response.Add(new ChatSessionWithMessagesDto
                {
                    User1 = session.User1.ToUserDto(),
                    User2 = session.User2.ToUserDto(),
                    User1Id = session.User1Id,
                    User2Id = session.User2Id,
                    StartedAt = session.StartedAt,
                    Messages = messages
                });
            }

            return Ok(new
            {
                sessions = response,
                result = true
            });
        }


        [HttpPost("message/private")]
        public async Task<IActionResult> SendPrivateMessage([FromBody] PrivateMessageDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Mesaj içeriği boş olamaz.");

            var session = await _context.ChatSessions.FirstOrDefaultAsync(s =>
                ((s.User1Id == request.SenderUserId && s.User2Id == request.ReceiverUserId) ||
                 (s.User1Id == request.ReceiverUserId && s.User2Id == request.SenderUserId)) &&
                s.EndedAt == null);

            if (session == null)
            {
                session = new ChatSession
                {
                    User1Id = request.SenderUserId,
                    User2Id = request.ReceiverUserId,
                    StartedAt = DateTime.UtcNow
                };
                _context.ChatSessions.Add(session);
                await _context.SaveChangesAsync();

                session = await _context.ChatSessions.FirstOrDefaultAsync(s =>
                ((s.User1Id == request.SenderUserId && s.User2Id == request.ReceiverUserId) ||
                 (s.User1Id == request.ReceiverUserId && s.User2Id == request.SenderUserId)) &&
                s.EndedAt == null);

            }

            var message = new PrivateMessage
            {
                SenderUserId = request.SenderUserId,
                ReceiverUserId = request.ReceiverUserId,
                ChatSessionId = session.Id,
                Content = request.Content,
                SentAt = DateTime.UtcNow
            };

            _context.PrivateMessages.Add(message);
            await _context.SaveChangesAsync();

            

            if (ChatHub.UserConnections.TryGetValue(request.ReceiverUserId, out var connectionId))
            {
                await _hubContext.Clients.Client(connectionId)
                    .ReceiveMessage(request.SenderUserId, $"{request.Content}");
                return Ok(new {
                    ChatHub.UserConnections,
                    connectionId
                });
            }

            return Ok(new { session.Id }); 
        }

    }

}