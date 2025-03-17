using System.Text.Json.Serialization;
using backend.Data;
using backend.Extensions;
using backend.Interfaces;
using backend.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args); // initializing the builder
var configuration = builder.Configuration; // get config for the appsettings.json

// adding the services
builder.Services.ConfigureSignalR();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.ConfigureCors();
builder.Services.AddHttpClient();

// adding the ChatBot Service
#pragma warning disable SKEXP0070
builder.Services.AddKernel()
    .AddGoogleAIGeminiChatCompletion(configuration["GoogleAI:ModelId"], configuration["GoogleAI:ApiKey"]);

// adding the DB Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// adding the Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

var app = builder.Build(); // building the app

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
    DbSeeder.Seed(context);
}

app.UseCors("CorsPolicy");
app.MapControllers();
app.ConfigureSignalREndpoints();

app.Run();
