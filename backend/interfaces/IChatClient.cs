using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(string message);
    }
}