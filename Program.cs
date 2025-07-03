using InscripcionApi.Data;
using InscripcionApi.Repositories.Implementations;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Implementations;
using InscripcionApi.Services.Interfaces;
using InscripcionApi.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.OpenApi.Models; // ¡Importante: Añade este using!

var builder = WebApplication.CreateBuilder(args);

// Configuración para obtener la IP real del cliente detrás de un proxy (como Somee.com)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // Opcional: Si conoces los IPs de tus proxies, puedes añadirlos para mayor seguridad.
    // options.KnownProxies.Add(IPAddress.Parse("YOUR_PROXY_IP_HERE"));
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

// **************************************************************************************************
// INICIO DE LA CONFIGURACIÓN IMPORTANTE DE SWAGGER PARA JWT
// **************************************************************************************************
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Inscripcion API", Version = "v1" });

    // Define el esquema de seguridad para JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token JWT con el prefijo Bearer. Ejemplo: 'Bearer TU_TOKEN_AQUI'",
    });

    // Define los requisitos de seguridad globales
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
// **************************************************************************************************
// FIN DE LA CONFIGURACIÓN IMPORTANTE DE SWAGGER PARA JWT
// **************************************************************************************************


// Configuración de la base de datos MySQL con Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Inyección de dependencias de Repositorios
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ISemesterEnrollmentRepository, SemesterEnrollmentRepository>();
builder.Services.AddScoped<IEnrolledCourseRepository, EnrolledCourseRepository>();

// Inyección de dependencias de Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IStudentService, StudentService>();

// Inyección de dependencias del filtro de seguridad (IpRestrictionAttribute)
builder.Services.AddTransient<IpRestrictionAttribute>();

// Configuración de JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.")))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EstudiantePolicy", policy => policy.RequireRole("Estudiante"));
});

var app = builder.Build();

// Usar ForwardedHeaders para obtener la IP real
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();