using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Notification;
using backend.Dtos.ProjectRequest;
using backend.Dtos.Task;

namespace backend.Interfaces
{
    public interface IChatClient
    {
        Task Register(int userId);
        Task ReceiveMessage(int senderUserId,string message);
        Task ReceiveProjectRequest(ProjectRequestDto projectRequest);
        Task ReceiveNotification(NotificationDto notificationDto);
        Task ReceiveTaskAssignment(TaskDto taskDto);
        Task SendPrivateMessage(int SenderUserId ,int receiverUserId,string target, string message);
    }
}