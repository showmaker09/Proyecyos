using MiMangaBot.Infrastructure;
using MiMangaBot.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; // ¡IMPORTANTE: Asegúrate de tener este using statement!

var builder = WebApplication.CreateBuilder(args);

// --- 1. Configuración de Servicios (Dependency Injection) ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- INICIO DEL CÓDIGO A REEMPLAZAR/MODIFICAR ---
// Antes tenías: builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MiMangaBot API", Version = "v1" });

    // Definición del esquema de seguridad JWT (Bearer)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingresa el token JWT de esta forma: Bearer {tu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer" // El esquema se llama "bearer"
    });

    // Requerir el esquema de seguridad Bearer para todas las operaciones (o puedes aplicar por controlador/método)
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
// --- FIN DEL CÓDIGO A REEMPLAZAR/MODIFICAR ---


// -- Registro de tus servicios y repositorios existentes --

// Manga
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
builder.Services.AddScoped<MangaServices>();

// Prestamo
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
builder.Services.AddScoped<PrestamoServices>();

// --- ¡CORRECCIÓN AQUÍ! Registro de servicios para la Autenticación JWT ---
// UsuarioRepository - Ahora lo registramos correctamente, pasándole la cadena de conexión
builder.Services.AddScoped<UsuarioRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>(); // Obtiene la configuración
    var connectionString = configuration.GetConnectionString("DefaultConnection"); // Obtiene la cadena de conexión

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for UsuarioRepository.");
    }
    return new UsuarioRepository(connectionString); // Pasa la cadena de conexión al constructor
});

builder.Services.AddScoped<AuthService>();       // Nuestro servicio de autenticación

// --- ¡NUEVO! Configuración de Autenticación JWT Bearer ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"], // atención: Asegúrate de que estos valores estén en tu appsettings.json
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.")))
        };
    });

// --- ¡NUEVO! Añadir servicio de Autorización ---
builder.Services.AddAuthorization();


// --- 2. Construir la Aplicación ---
var app = builder.Build();
// --- 3. Configuración del Pipeline de Solicitudes HTTP ---


// En un entorno de producción, usualmente tendrías un 'if (app.Environment.IsDevelopment())'
// para estas líneas de Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// --- ¡MUY IMPORTANTE! Estos middlewares DEBEN ir ANTES de app.MapControllers() ---
// UseAuthentication() debe ir ANTES de UseAuthorization()
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();