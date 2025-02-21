using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.ReceiveMessage(message);
        }
        public override async Task OnConnectedAsync()
        {
    
            // Clients => everyone connected to the socket
            // Group => subset of the Clients
            // Context => the client just connected to the socket

            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");

            /* await base.OnConnectedAsync(); */
        }

        // Bağlantı kapandığında çalışan işlem
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            // Bağlantı kapandığında işlemi burada tanımlayabilirsiniz
            return base.OnDisconnectedAsync(exception);
        }
    }
}