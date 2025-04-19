using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IChatClient
    {
        Task Register(string userId);
        Task ReceiveMessage(string message);
        Task SendPrivateMessage(string receiverUserId, string message);
    }
}