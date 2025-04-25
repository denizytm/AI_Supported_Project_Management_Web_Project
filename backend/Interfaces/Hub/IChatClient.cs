using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IChatClient
    {
        Task Register(int userId);
        Task ReceiveMessage(int senderUserId,string message);
        Task SendPrivateMessage(int SenderUserId ,int receiverUserId,string target, string message);
    }
}