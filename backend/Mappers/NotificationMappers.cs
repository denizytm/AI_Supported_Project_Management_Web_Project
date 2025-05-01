using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Notification;
using backend.Models;

namespace backend.Mappers
{
    public static class NotificationMappers
    {
        public static NotificationDto FromModelToDto(this Notification notification)
        {
            return new NotificationDto
            {
                Id = notification.Id,
                CreatedAt = notification.CreatedAt,
                IsRead = notification.IsRead,
                Message = notification.Message,
                TargetUserId = notification.TargetUserId,
                Title = notification.Title,
            };
        }

        public static Notification FromCreateToModel(this CreateNotificationDto createNotificationDto)
        {
            return new Notification
            {
                Title = createNotificationDto.Title,
                Message = createNotificationDto.Message,
                TargetUserId = createNotificationDto.TargetUserId,
            };
        }
    }
}