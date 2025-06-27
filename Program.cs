// Program.cs
using MiUtilsApi.Services;
using MiUtilsApi.Data;
using MiUtilsApi.Repositories;
using MiUtilsApi.Security; // Importa tu namespace de seguridad

using Microsoft.EntityFrameworkCore; // Para UseMySql
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides; // Para ForwardedHeaders
using Microsoft.OpenApi.Models; // Para Swagger con seguridad
using Microsoft.Extensions.Configuration; // Necesario para GetConnectionString
using Microsoft.Extensions.DependencyInjection; // Necesario para GetRequiredService
using System; // Necesario para InvalidOperationException

var builder = WebApplication.CreateBuilder(args);

// --- Configuración de Servicios (Dependency Injection) ---

// Configurar ForwardedHeaders para obtener la IP real del cliente detrás de proxies (IIS en Somee)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

// Registrar el filtro de acción de restricción por IP
builder.Services.AddScoped<IpRestrictionAttribute>();

// Agrega los controladores a la aplicación.
builder.Services.AddControllers();

// Configuración de Swagger/OpenAPI con soporte para JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MiUtilsApi", Version = "v1" });

    // Definición del esquema de seguridad JWT (Bearer) para Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingresa el token JWT de esta forma: Bearer {tu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
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
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configuración de conexión a base de datos MySQL con Entity Framework Core
// Este AddDbContext es NECESARIO para que las herramientas de migraciones (dotnet ef) funcionen.
// Aunque los repositorios instancian el DbContext directamente, EF Core Tools lo necesita.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 32))) // ¡Ajusta esta versión si tu MySQL es diferente!
);

// Registro de repositorios y servicios
// Los repositorios reciben la cadena de conexión directamente, con la verificación de null
builder.Services.AddScoped<UserRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for UserRepository.");
    }
    return new UserRepository(connectionString);
});

builder.Services.AddScoped<PalindromeRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for PalindromeRepository.");
    }
    return new PalindromeRepository(connectionString);
});

builder.Services.AddScoped<NumberRepository>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found or is empty for NumberRepository.");
    }
    return new NumberRepository(connectionString);
});

// Los servicios reciben los repositorios (AddScoped)
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UtilityService>();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.")))
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();

// --- Configuración del Pipeline de Solicitudes HTTP (Middleware) ---

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MiUtilsApi v1");
    });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
