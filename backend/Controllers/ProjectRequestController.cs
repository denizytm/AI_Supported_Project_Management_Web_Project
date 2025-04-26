using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project-requests")]
    public class ProjectRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateRequest([FromBody] ProjectRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.ProjectRequests.Add(request);
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
    }
}
