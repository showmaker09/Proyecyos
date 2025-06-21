using Microsoft.AspNetCore.Mvc;
using MiMangaBot.Domain;
using MiMangaBot.Services;
using MiMangaBot.Domain.Filters;
using MiMangaBot.Domain.Pagination; // ¡Nuevo using!
using Microsoft.AspNetCore.Authorization; // ¡Nuevo using para seguridad!
using System;
using System.Linq; // Necesario para .Any() en SearchMangas

namespace MiMangaBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // ¡NUEVO! Todos los endpoints de este controlador requieren autenticación por defecto
public class MangasController : ControllerBase
{
    private readonly MangaServices _mangaServices;

    public MangasController(MangaServices mangaServices)
    {
        _mangaServices = mangaServices;
    }

    // --- ¡NUEVO! Endpoint para obtener mangas paginados ---
    // GET: api/Mangas/paged?PageNumber=1&PageSize=10
    // Este método requiere autenticación porque la clase tiene [Authorize].
    // Si quisieras que este endpoint fuera público, añadirías [AllowAnonymous] aquí.
    [HttpGet("paged")]
    public IActionResult GetPagedMangas([FromQuery] PaginationParams paginationParams)
    {
        try
        {
            var pagedMangas = _mangaServices.GetPagedMangas(paginationParams);
            return Ok(pagedMangas);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener mangas paginados: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al obtener mangas paginados.");
        }
    }

    // --- Tu código existente (GET ALL, GET BY ID, SEARCH) debe seguir aquí ---
    // GET: api/Mangas
    [HttpGet]
    public IActionResult GetAllMangas()
    {
        try
        {
            var mangas = _mangaServices.GetAllMangas();
            return Ok(mangas);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener todos los mangas: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al obtener mangas.");
        }
    }

    // GET: api/Mangas/{id}
    [HttpGet("{id}")]
    public IActionResult GetMangaById(int id)
    {
        try
        {
            var manga = _mangaServices.GetMangaById(id);
            if (manga == null)
            {
                return NotFound($"Manga con ID {id} no encontrado.");
            }
            return Ok(manga);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener manga por ID: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al obtener el manga por ID.");
        }
    }

    // --- ¡NUEVO! Atributo de autorización por rol ---
    // POST: api/Mangas
    // Solo usuarios con rol "Admin" pueden añadir mangas
    [HttpPost]
    [Authorize(Roles = "Admin")] // posible error
    public IActionResult AddManga([FromBody] Manga manga)
    {
        if (manga == null || string.IsNullOrWhiteSpace(manga.Nombre))
        {
            return BadRequest("El nombre del manga no puede estar vacío.");
        }

        try
        {
            _mangaServices.AddManga(manga);
            return StatusCode(201, manga);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al añadir manga: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al añadir manga.");
        }
    }

    // --- ¡NUEVO! Atributo de autorización por rol ---
    // PUT: api/Mangas/{id}
    // Solo usuarios con rol "Admin" pueden actualizar mangas
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateManga(int id, [FromBody] Manga updatedManga)
    {
        if (updatedManga == null || string.IsNullOrWhiteSpace(updatedManga.Nombre))
        {
            return BadRequest("El nombre del manga no puede estar vacío.");
        }

        try
        {
            var existingManga = _mangaServices.GetMangaById(id);
            if (existingManga == null)
            {
                return NotFound($"Manga con ID {id} no encontrado para actualizar.");
            }

            _mangaServices.UpdateManga(id, updatedManga);
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al actualizar manga: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al actualizar manga.");
        }
    }

    // --- ¡NUEVO! Atributo de autorización por rol ---
    // DELETE: api/Mangas/{id}
    // Solo usuarios con rol "Admin" pueden eliminar mangas
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteManga(int id)
    {
        try
        {
            var existingManga = _mangaServices.GetMangaById(id);
            if (existingManga == null)
            {
                return NotFound($"Manga con ID {id} no encontrado para eliminar.");
            }

            _mangaServices.DeleteManga(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al eliminar manga: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al eliminar manga.");
        }
    }

    // GET: api/Mangas/search?nombre=...&genero=...&fechaDePublicacion=...
    [HttpGet("search")]
    public IActionResult SearchMangas([FromQuery] MangaFilter filter)
    {
        try
        {
            var mangas = _mangaServices.SearchMangas(filter);
            if (mangas == null || !mangas.Any())
            {
                return NotFound("No se encontraron mangas con los criterios de búsqueda.");
            }
            return Ok(mangas);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al buscar mangas: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al buscar mangas.");
        }
    }
}