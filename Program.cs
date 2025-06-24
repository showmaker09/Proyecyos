// Program.cs
// Asegúrate de que todos estos 'using' estén presentes al inicio del archivo
using MiMangaBot.Infrastructure;
using MiMangaBot.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; // Necesario para Swagger con seguridad JWT
using Microsoft.AspNetCore.Cors.Infrastructure; // Necesario para CORS

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuración de Servicios (Dependency Injection) ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- Configuración de Swagger/OpenAPI con soporte para JWT ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MiMangaBot API", Version = "v1" });

    // Definición del esquema de seguridad JWT (Bearer) para Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingresa el token JWT de esta forma: Bearer {tu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer" // El esquema se llama "bearer" para la mayoría de los tokens JWT
    });

    // Requerir el esquema de seguridad Bearer para todas las operaciones en Swagger UI
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // Debe coincidir con el nombre definido arriba
                }
            },
            new string[] {} // Las "scopes" para OAuth2, vacío para JWT simple
        }
    });
});

// --- Registro de tus servicios y repositorios existentes (AddScoped es una buena práctica) ---

// Manga Repository y Service
builder.Services.AddScoped<MangaRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for MangaRepository.");
    }
    return new MangaRepository(connectionString);
});
builder.Services.AddScoped<MangaServices>();

// Prestamo Repository y Service
builder.Services.AddScoped<PrestamoRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for PrestamoRepository.");
    }
    return new PrestamoRepository(connectionString);
});
builder.Services.AddScoped<PrestamoServices>();

// UsuarioRepository y AuthService (para autenticación JWT)
builder.Services.AddScoped<UsuarioRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for UsuarioRepository.");
    }
    return new UsuarioRepository(connectionString);
});
builder.Services.AddScoped<AuthService>(); // Nuestro servicio de autenticación

// --- INICIO DE CONFIGURACIÓN CORS (Cross-Origin Resource Sharing) en Servicios ---
// Aquí defines la o las políticas CORS que tu aplicación usará.
builder.Services.AddCors(options =>
{
    // Define una política predeterminada. Es la que se usará con app.UseCors();
    options.AddDefaultPolicy(
        policy =>
        {
            // *** IMPORTANTE PARA PRODUCCIÓN ***
            // Para la publicación, si ya sabes los dominios exactos desde los que se conectará tu frontend,
            // ¡reemplaza AllowAnyOrigin() por WithOrigins() para mayor seguridad!
            // Ejemplo:
            // policy.WithOrigins("https://tudominiofrontend.com", "http://localhost:3000")
            //       .AllowAnyHeader()
            //       .AllowAnyMethod();

            // Para pruebas o una API pública, AllowAnyOrigin() es útil:
            policy.AllowAnyOrigin()  // Permite solicitudes desde cualquier dominio (origen)
                  .AllowAnyHeader()  // Permite cualquier encabezado HTTP (incluyendo 'Authorization')
                  .AllowAnyMethod(); // Permite cualquier método HTTP (GET, POST, PUT, DELETE, etc.)
        });

    // Opcional: Puedes añadir políticas CORS con nombres específicos si lo necesitas.
    // options.AddPolicy("MiPoliticaEspecifica",
    //     policy =>
    //     {
    //         policy.WithOrigins("https://otro-dominio.com")
    //               .WithMethods("GET")
    //               .WithHeaders("X-Custom-Header");
    //     });
});
// --- FIN DE CONFIGURACIÓN CORS en Servicios ---

// --- Configuración de Autenticación JWT Bearer ---
// Esto le dice a ASP.NET Core cómo validar los tokens JWT entrantes.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,             // Valida el emisor del token (Jwt:Issuer en appsettings.json)
            ValidateAudience = true,           // Valida la audiencia del token (Jwt:Audience en appsettings.json)
            ValidateLifetime = true,           // Valida que el token no ha expirado y no es "not before"
            ValidateIssuerSigningKey = true,   // Valida la firma del token con la clave secreta

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.")))
        };
    });

// Habilita el sistema de autorización para que puedas usar [Authorize] y [Authorize(Roles="Admin")]
builder.Services.AddAuthorization();


// --- 2. Construir la Aplicación ---
var app = builder.Build();

// --- 3. Configuración del Pipeline de Solicitudes HTTP (orden CRÍTICO) ---

// Habilitar Swagger UI solo en entorno de desarrollo por seguridad
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MiMangaBot API v1");
    });
}

// Redirecciona automáticamente las solicitudes HTTP a HTTPS.
app.UseHttpsRedirection();

// --- INICIO DE HABILITACIÓN DEL MIDDLEWARE CORS ---
// ¡CRÍTICO!: El middleware UseCors() debe ir ANTES de UseAuthentication() y UseAuthorization().
// Esto aplica la política CORS por defecto que definiste arriba.
app.UseCors();
// Si hubieras definido una política CORS con un nombre específico (ej. "MiPoliticaEspecifica"),
// la usarías así: app.UseCors("MiPoliticaEspecifica");
// --- FIN DE HABILITACIÓN DEL MIDDLEWARE CORS ---

// Habilita los middlewares de autenticación y autorización.
// El orden es FUNDAMENTAL: Authentication siempre DEBE ir ANTES de Authorization.
app.UseAuthentication(); // Primero, intenta autenticar al usuario (verifica el token JWT).
app.UseAuthorization();  // Luego, verifica los permisos del usuario autenticado (roles, políticas).

// Mapea los controladores de API para que las rutas se dirijan a tus métodos de controlador.
app.MapControllers();

// Ejecuta la aplicación.
app.Run();