using backend.Data;
using backend.Extensions;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSignalR();
builder.Services.AddControllers();
builder.Services.ConfigureCors();

builder.Services.AddDbContext<ApplicationDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();
app.UseCors();

app.ConfigureSignalREndpoints();
app.MapControllers();

app.Run();
