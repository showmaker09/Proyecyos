<<<<<<< HEAD
using JaveragesLibrary.Services.Features.Mangas;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<MangaService>();

builder.Services.AddControllers(); //

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen
(options => // Configuración opcional para Swagger
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Version = "v1",
        Title = "MangaBot API",
        Description = "Una API para gestionar una increíble colección de mangas",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Tu Nombre/Equipo",
            Url = new Uri("https://tuwebsite.com") // Cambia esto
        }
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

  
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => // Para que Swagger apunte a nuestra V1 por defecto
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "MangaBot API V1");
        options.RoutePrefix = string.Empty; // Para que Swagger UI esté en la raíz (http://localhost:XXXX/)
    });
}

app.UseHttpsRedirection();
app.UseAuthorization(); // Lo veremos más adelante
app.MapControllers();   // Para que las peticiones lleguen a nuestros Controllers

app.Run();

// si swagger falla intenta: dotnet add package Swashbuckle.AspeNetCore
=======
﻿using System;

public class Program
{
    static void Main()
    {
        double lado, lado2, lado3;

        Console.WriteLine("Ingrese el primer lado del triángulo:");
        lado = double.Parse(Console.ReadLine());

        Console.WriteLine("Ingrese el segundo lado del triángulo:");
        lado2 = double.Parse(Console.ReadLine());

        Console.WriteLine("Ingrese el tercer lado del triángulo:");
        lado3 = double.Parse(Console.ReadLine());

        Calcular C1 = new Calcular(lado, lado2, lado3);

        Console.WriteLine($"El área del triángulo es: {C1.Area()}");
    }
}

public class Calcular
{
    // Campos para almacenar los lados del triángulo
    public double lado;
    public double lado2;
    public  double lado3;

    // Constructor para inicializar los lados del triángulo
    public Calcular(double lado, double lado2, double lado3)
    {
        this.lado = lado;
        this.lado2 = lado2;
        this.lado3 = lado3;
    }

    // Método para calcular el semiperímetro
    public double SumaVariables()
    {
        return (lado + lado2 + lado3) / 2;
    }

    // Método para calcular el área usando la fórmula de Herón
    public double Area()
    {
        double p = SumaVariables();
        return Math.Sqrt(p * (p - lado) * (p - lado2) * (p - lado3));
    }
}
>>>>>>> dedadb1d94de790c3101cac58c5d00476cf754f8
