using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Swagger/OpenAPI için gerekli servisleri ekleyelim
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Weather API", Version = "v1" });
});

var app = builder.Build();

// Sadece Development ortamında Swagger UI'yi aç
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Weather API v1");
        c.RoutePrefix = ""; // Swagger'ı direkt root URL'ye ekler
    });
}

app.Run();

