using System; // Necesario para DateTime

namespace MiMangaBot.Domain;

public class Manga
{
    // Propiedad Id (PRIMARY KEY en tu DB, a menudo autoincremental)
    // Coincide con la columna 'id' en tu DB
    public int Id { get; set; } // tiene que ser int porque es un ID

    // Coincide con la columna 'nombre' en tu DB
    public string? Nombre { get; set; }

    // Coincide con la columna 'genero' en tu DB
    public string? Genero { get; set; }

    // Coincide con la columna 'fecha_de_publicacion' en tu DB
    public string? FechaDePublicacion { get; set; }
}