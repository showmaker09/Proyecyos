using MiMangaBot.Infrastructure; // Necesario para MangaRepository
using MiMangaBot.Services;     // Necesario para MangaServices
using Microsoft.Extensions.Configuration; // Necesario para IConfiguration y GetConnectionString

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuración de Servicios (Dependency Injection) ---

// Añade los controladores a la colección de servicios. Esto es necesario para que tu API funcione.
builder.Services.AddControllers();

// Configura Swagger/OpenAPI para la documentación de tu API (útil para Scalar).
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -- Registro de tus servicios y repositorios --

// Registrar MangaRepository: Aquí le indicamos al sistema cómo crear una instancia de MangaRepository.
// Usamos AddScoped, que crea una nueva instancia por cada solicitud HTTP.
builder.Services.AddScoped<MangaRepository>(provider =>
{
    // Obtenemos la configuración de la aplicación (que incluye ConnectionStrings).
    var configuration = provider.GetRequiredService<IConfiguration>();

    // Extraemos la cadena de conexión llamada "DefaultConnection" de appsettings.json.
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    // Si la cadena de conexión no se encuentra o está vacía, lanzamos una excepción.
    // Esto es crucial para que la aplicación no intente arrancar sin una configuración válida.
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty.");
    }

    // Finalmente, creamos y devolvemos una nueva instancia de MangaRepository,
    // pasándole la cadena de conexión que acabamos de obtener.
    return new MangaRepository(connectionString);
});

// Registrar MangaServices: Este servicio depende de MangaRepository.
// El sistema de inyección de dependencias (DI) automáticamente "sabe" cómo proveer MangaRepository
// porque ya lo registramos arriba.
builder.Services.AddScoped<MangaServices>();


// --- 2. Construir la Aplicación ---
var app = builder.Build();

// --- 3. Configuración del Pipeline de Solicitudes HTTP ---

// Si el entorno es de desarrollo, habilitamos Swagger para ver la documentación de la API.
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//

// Redirecciona automáticamente las solicitudes HTTP a HTTPS. Es una buena práctica de seguridad.
app.UseHttpsRedirection();

// Habilita la autorización para tus endpoints (aunque no tengas lógica de auth por ahora, es el middleware).
app.UseAuthorization();

// Mapea los controladores para que puedan responder a las rutas definidas (ej. /api/Mangas).
app.MapControllers();

// Inicia la aplicación web.
app.Run();