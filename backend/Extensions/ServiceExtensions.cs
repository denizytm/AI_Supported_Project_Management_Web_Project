using backend.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureSignalR(this IServiceCollection services)
        {
            services.AddSignalR(); // add signal package 
        }

        public static void ConfigureSignalREndpoints(this WebApplication app)
        {
            app.MapHub<ChatHub>("/chathub"); // create the Hub to connect
        }

        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
                {
                    options.AddPolicy("CorsPolicy", builder =>  // this is for next.JS
                    {
                        builder.WithOrigins("http://localhost:3000")
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowCredentials(); 
                    });
                });
        }

    }
}
