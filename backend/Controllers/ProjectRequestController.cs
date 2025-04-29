using backend.Data;
using backend.Dtos.ProjectRequest;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project/requests")]
    public class ProjectRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;

        public ProjectRequestController(ApplicationDbContext context, IHubContext<ChatHub, IChatClient> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRequest([FromBody] CreateProjectRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.ProjectRequests.Add(request.FromCreateDtoToModel());
            await _context.SaveChangesAsync();
            return Ok(new { message = "Request successfully created", request });
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetRequestsByProject(int projectId)
        {
            var requests = await _context.ProjectRequests
                .Where(r => r.ProjectId == projectId)
                .Include(r => r.RequestedBy)
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequestById(int id)
        {
            var request = await _context.ProjectRequests
                .Include(r => r.RequestedBy)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return NotFound(new { message = "Request not found" });

            return Ok(request);
        }

        [HttpPut("{id}/close")]
        public async Task<IActionResult> CloseRequest(int id, [FromBody] string closingNote)
        {
            var request = await _context.ProjectRequests.FindAsync(id);

            if (request == null)
                return NotFound(new { message = "Request not found" });

            request.IsClosed = true;
            request.ClosingNote = closingNote;
            request.ClosedAt = DateTime.UtcNow;

            _context.ProjectRequests.Update(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Request successfully closed", request });
        }

        [HttpPost("create-request")]
        public async Task<IActionResult> CreateProjectRequest(
            [FromBody] CreateProjectRequestDto requestDto
        )
        {
            try
            {
                var request = new ProjectRequest
                {
                    ProjectId = requestDto.ProjectId,
                    RequestedById = requestDto.RequestedById,
                    Description = requestDto.Description,
                    CriticLevelName = requestDto.CriticLevelName,
                    IsClosed = false,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.ProjectRequests.AddAsync(request);
                await _context.SaveChangesAsync();

                var dto = request.FromProjectRequestToDto();

                // SignalR kullanıcılarına gönder
                foreach (var connection in ChatHub.UserConnections.Values)
                {
                    await _hubContext.Clients.Client(connection).ReceiveProjectRequest(request.FromProjectRequestToDto());
                }

                return Ok(new
                {
                    message = "Request successfully created",
                    request = dto
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"Error while creating project request: {ex.Message}"
                });
            }
        }

    }
}
