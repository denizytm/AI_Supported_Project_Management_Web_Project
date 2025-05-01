using backend.Data;
using backend.Dtos.Notification;
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
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Kullanıcının bildirimlerini getir
        [HttpGet("get")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.TargetUserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        // Yeni bir bildirim oluştur
        [HttpPost("create")]
        public async Task<IActionResult> CreateNotification(
            [FromBody] CreateNotificationDto createNotificationDto,
            [FromServices] IHubContext<ChatHub, IChatClient> hubContext
        )
        {
            var notification = createNotificationDto.FromCreateToModel();

            notification.CreatedAt = DateTime.UtcNow;
            notification.IsRead = false;

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            var notificationDto = notification.FromModelToDto();

            if (ChatHub.UserConnections.TryGetValue(notification.TargetUserId, out var connectionId))
            {
                await hubContext.Clients.Client(connectionId)
                    .ReceiveNotification(notificationDto);
            }

            return Ok(new
            {
                message = "Notification created successfully",
                notification
            });
        }

        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkNotificationsAsRead([FromBody] List<int> ids)
        {
            var notifications = await _context.Notifications
                .Where(n => ids.Contains(n.Id))
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Notifications marked as read." });
        }

    }
}
