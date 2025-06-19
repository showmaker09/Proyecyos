using MiMangaBot.Infrastructure;
using MiMangaBot.Services;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuración de Servicios (Dependency Injection) ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -- Registro de tus servicios y repositorios --

// Registrar MangaRepository
builder.Services.AddScoped<MangaRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty.");
    }
    return new MangaRepository(connectionString);
});

// Registrar MangaServices
builder.Services.AddScoped<MangaServices>();

// --- ¡NUEVO! Registrar PrestamoRepository ---
builder.Services.AddScoped<PrestamoRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty.");
    }
    return new PrestamoRepository(connectionString);
});

// --- ¡NUEVO! Registrar PrestamoServices ---
builder.Services.AddScoped<PrestamoServices>();


// --- 2. Construir la Aplicación ---
var app = builder.Build();

// --- 3. Configuración del Pipeline de Solicitudes HTTP ---

//if (app.Environment.IsDevelopment()) // siempre quitar el if
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Puedes configurar Swagger UI para una ruta específica si lo deseas, por ejemplo:
// app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mi Manga API v1"));


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();