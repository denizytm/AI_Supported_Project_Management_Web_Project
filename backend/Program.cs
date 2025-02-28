using backend.Data;
using backend.Extensions;
using backend.Interfaces;
using backend.Repository;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSignalR();
builder.Services.AddControllers();
builder.Services.ConfigureCors();
builder.Services.AddScoped<IUserRepository,UserRepository>();

builder.Services.AddDbContext<ApplicationDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();
app.UseCors();

app.ConfigureSignalREndpoints();
app.MapControllers();

app.Run();
