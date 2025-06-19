using System;

namespace MiMangaBot.Domain;

public class Prestamo
{
    public int Id { get; set; } // ID del préstamo (PRIMARY KEY)
    public int MangaId { get; set; } // Foreign key al Manga prestado
    public DateTime FechaPrestamo { get; set; } // Fecha del préstamo
    public string? QuienPresto { get; set; } // Nombre de la persona que prestó o a quien se le prestó
}