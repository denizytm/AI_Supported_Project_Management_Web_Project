using backend.Data;
using backend.Extensions;
using backend.Interfaces;
using backend.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSignalR();
builder.Services.AddControllers();
builder.Services.ConfigureCors();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddHttpClient();

#pragma warning disable SKEXP0070

builder.Services.AddKernel()
    .AddGoogleAIGeminiChatCompletion("gemini-1.5-pro","AIzaSyD-40W--DxNGGUGYcBg6qjYNEkuhkKKwKQ");
  

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

app.UseCors();
app.ConfigureSignalREndpoints();
app.MapControllers();

app.MapPost("/chat", async (IChatCompletionService chatCompletionService, ChatModel chatModel) =>
{
    var response = await chatCompletionService.GetChatMessageContentAsync(chatModel.Input);
    return response?.ToString() ?? "Boş yanıt alındı!";
}).WithRequestTimeout(TimeSpan.FromMinutes(10));

app.Run();
