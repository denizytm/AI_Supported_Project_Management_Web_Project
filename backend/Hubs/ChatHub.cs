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
        public static Dictionary<string, string> UserConnections = new Dictionary<string, string>();
        public async Task SendMessage(string message)
        {
            await Clients.All.ReceiveMessage(message);
        }
        public async Task Register(string userId)
        {
            if (!UserConnections.ContainsKey(userId))
            {
                UserConnections[userId] = Context.ConnectionId;
            }
            await Clients.Client(Context.ConnectionId).ReceiveMessage($" {userId}");
        }
        public async Task SendPrivateMessage(string receiverUserId, string message)
        {
            if (UserConnections.TryGetValue(receiverUserId, out var connectionId))
            {
                await Clients.Client(connectionId).ReceiveMessage(message);
            }
        }

        public override async Task OnConnectedAsync()
        {

            // Clients => everyone connected to the socket
            // Group => subset of the Clients
            // Context => the client just connected to the socket

            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined");

            /* await base.OnConnectedAsync(); */
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var user = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
            if (!string.IsNullOrEmpty(user.Key))
            {
                UserConnections.Remove(user.Key);
            }

            await Clients.All.ReceiveMessage($"{Context.ConnectionId} has left the hub");
            await base.OnDisconnectedAsync(exception);
        }

    }
}