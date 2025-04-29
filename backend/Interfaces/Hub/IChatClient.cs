using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ProjectRequest;

namespace backend.Interfaces
{
    public interface IChatClient
    {
        Task Register(int userId);
        Task ReceiveMessage(int senderUserId,string message);
        Task SendPrivateMessage(int SenderUserId ,int receiverUserId,string target, string message);
        Task ReceiveProjectRequest(ProjectRequestDto projectRequest);
    }
}