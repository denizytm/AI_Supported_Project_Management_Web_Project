using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/chat/session")]
    [ApiController]
    public class ChatSessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatSessionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("get-session")]
        public async Task<IActionResult> GetSession(int user1Id, int user2Id)
        {
            var session = await _context.ChatSessions
                .Include(cS => cS.Messages)
                .FirstOrDefaultAsync(s =>
                    (s.User1Id == user1Id && s.User2Id == user2Id || s.User1Id == user2Id && s.User2Id == user1Id)
                    && s.EndedAt == null 
                );

            if (session == null)
            {
                return Ok(new { result = false });
            }

            return Ok(new {
                result = true,
                session
            });
        }

        [HttpPost("create-session")]
        public async Task<IActionResult> CreateSession(int user1Id, int user2Id)
        {
            try
            {
                var existingSession = await _context.ChatSessions
                    .FirstOrDefaultAsync(s =>
                        (s.User1Id == user1Id && s.User2Id == user2Id || s.User1Id == user2Id && s.User2Id == user1Id)
                        && s.EndedAt == null
                    );

                if (existingSession != null)
                {
                    return BadRequest(new { message = "An active chat session already exists between these users." });
                }

                var newSession = new ChatSession
                {
                    User1Id = user1Id,
                    User2Id = user2Id,
                    StartedAt = DateTime.UtcNow
                };

                await _context.ChatSessions.AddAsync(newSession);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chat session created successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error while creating chat session: {ex.Message}" });
            }
        }

        [HttpPost("end-session")]
        public async Task<IActionResult> EndSession(int sessionId)
        {
            try
            {
                var session = await _context.ChatSessions.FindAsync(sessionId);
                if (session == null)
                {
                    return NotFound(new { message = "Chat session not found." });
                }

                if (session.EndedAt != null)
                {
                    return BadRequest(new { message = "Chat session already ended." });
                }

                session.EndedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chat session ended successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error while ending chat session: {ex.Message}" });
            }
        }

        [HttpGet("user-sessions")]
        public async Task<IActionResult> GetSessionsForUser(int userId)
        {
            var sessions = await _context.ChatSessions
                .Where(s => s.User1Id == userId || s.User2Id == userId)
                .OrderByDescending(s => s.StartedAt)
                .ToListAsync();

            return Ok(sessions);
        }
    }
}
