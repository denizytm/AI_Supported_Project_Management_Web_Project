using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(string message);
    }
}