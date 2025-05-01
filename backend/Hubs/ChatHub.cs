using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ProjectRequest;
using backend.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public static Dictionary<int, string> UserConnections = new Dictionary<int, string>();
        public async Task SendMessage(string message)
        {
            await Clients.All.ReceiveMessage(0, message);
        }
        public async Task Register(int userId)
        {
            if (!UserConnections.ContainsKey(userId))
            {
                UserConnections[userId] = Context.ConnectionId;
            }
            /* await Clients.All.ReceiveMessage(userId,$"{userId} has registered as {Context.ConnectionId}"); */ 
        }
        public async Task SendPrivateMessage(int senderUserId, int receiverUserId, string message)
        {
            if (UserConnections.TryGetValue(receiverUserId, out var connectionId))
            {
                await Clients.Client(connectionId).ReceiveMessage(senderUserId, message);
            }
        }

        public override async Task OnConnectedAsync()
        {

            // Clients => everyone connected to the socket
            // Group => subset of the Clients
            // Context => the client just connected to the socket

            /* await Clients.All.ReceiveMessage($"{Context.ConnectionId} has joined"); */

            /* await base.OnConnectedAsync(); */
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var user = UserConnections.FirstOrDefault(x => x.Value == Context.ConnectionId);
            if (user.Key != 0)
            {
                UserConnections.Remove(user.Key);
            }

            await base.OnDisconnectedAsync(exception);
        }

    }
}