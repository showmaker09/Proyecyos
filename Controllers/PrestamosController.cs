using Microsoft.AspNetCore.Mvc;
using MiMangaBot.Domain;
using MiMangaBot.Services;
using System;

namespace MiMangaBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // La URL base será /api/Prestamos
public class PrestamosController : ControllerBase
{
    private readonly PrestamoServices _prestamoServices;

    public PrestamosController(PrestamoServices prestamoServices)
    {
        _prestamoServices = prestamoServices;
    }

    // GET: api/Prestamos
    [HttpGet]
    public IActionResult GetAllPrestamos()
    {
        try
        {
            var prestamos = _prestamoServices.GetAllPrestamos();
            return Ok(prestamos);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener todos los préstamos: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al obtener préstamos.");
        }
    }

    // GET: api/Prestamos/{id}
    [HttpGet("{id}")]
    public IActionResult GetPrestamoById(int id)
    {
        try
        {
            var prestamo = _prestamoServices.GetPrestamoById(id);
            if (prestamo == null)
            {
                return NotFound($"Préstamo con ID {id} no encontrado.");
            }
            return Ok(prestamo);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener préstamo por ID: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al obtener el préstamo por ID.");
        }
    }

    // POST: api/Prestamos
    [HttpPost]
    public IActionResult AddPrestamo([FromBody] Prestamo prestamo)
    {
        if (prestamo == null || prestamo.MangaId <= 0 || string.IsNullOrWhiteSpace(prestamo.QuienPresto))
        {
            return BadRequest("Datos de préstamo incompletos o inválidos.");
        }
        // Puedes agregar validación adicional aquí, por ejemplo, si MangaId existe.

        try
        {
            prestamo.FechaPrestamo = DateTime.Now; // Asigna la fecha actual al préstamo
            _prestamoServices.AddPrestamo(prestamo);
            return StatusCode(201, prestamo); // Devuelve 201 Created con el objeto creado
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al añadir préstamo: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al añadir préstamo.");
        }
    }

    // PUT: api/Prestamos/{id}
    [HttpPut("{id}")]
    public IActionResult UpdatePrestamo(int id, [FromBody] Prestamo updatedPrestamo)
    {
        if (updatedPrestamo == null || updatedPrestamo.MangaId <= 0 || string.IsNullOrWhiteSpace(updatedPrestamo.QuienPresto))
        {
            return BadRequest("Datos de préstamo incompletos o inválidos para actualizar.");
        }

        try
        {
            var existingPrestamo = _prestamoServices.GetPrestamoById(id);
            if (existingPrestamo == null)
            {
                return NotFound($"Préstamo con ID {id} no encontrado para actualizar.");
            }

            _prestamoServices.UpdatePrestamo(id, updatedPrestamo);
            return NoContent(); // Retorna 204 No Content para una actualización exitosa
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al actualizar préstamo: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al actualizar préstamo.");
        }
    }

    // DELETE: api/Prestamos/{id}
    [HttpDelete("{id}")]
    public IActionResult DeletePrestamo(int id)
    {
        try
        {
            var existingPrestamo = _prestamoServices.GetPrestamoById(id);
            if (existingPrestamo == null)
            {
                return NotFound($"Préstamo con ID {id} no encontrado para eliminar.");
            }

            _prestamoServices.DeletePrestamo(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al eliminar préstamo: {ex.Message}");
            return StatusCode(500, "Error interno del servidor al eliminar préstamo.");
        }
    }
}