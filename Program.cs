using InscripcionApi.Data;
using InscripcionApi.Repositories.Implementations;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Implementations;
using InscripcionApi.Services.Interfaces;
using InscripcionApi.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.HttpOverrides;
using AutoMapper;
using InscripcionApi.Dtos.Students;
using InscripcionApi.Models;
using InscripcionApi.Dtos.Enrollment;

var builder = WebApplication.CreateBuilder(args);

// Configuración de la base de datos MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

// Configuración de JWT
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

// Configuración de Forwarded Headers para obtener la IP real detrás de un proxy
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});


// Añadir AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    // Mapeos para Students
    cfg.CreateMap<Student, StudentResponseDto>();
    cfg.CreateMap<StudentCreateDto, Student>();
    cfg.CreateMap<StudentUpdateDto, Student>();

    // Mapeos para SemesterEnrollment
    cfg.CreateMap<SemesterEnrollment, SemesterEnrollmentResponseDto>();
    cfg.CreateMap<StartEnrollmentDto, SemesterEnrollment>();

    // Mapeos para EnrolledCourse
    cfg.CreateMap<EnrolledCourse, EnrolledCourseResponseDto>();
    cfg.CreateMap<EnrollCourseDto, EnrolledCourse>();
});


// Inyección de dependencias para Repositorios
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ISemesterEnrollmentRepository, SemesterEnrollmentRepository>();
builder.Services.AddScoped<IEnrolledCourseRepository, EnrolledCourseRepository>();

// Inyección de dependencias para Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEnrollmentService, EnrollmentService>();
builder.Services.AddScoped<IStudentService, StudentService>();

// Añadir filtro de IP como un servicio de tipo scoped para permitir inyección de dependencias
builder.Services.AddScoped<IpRestrictionAttribute>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Usar Forwarded Headers
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();