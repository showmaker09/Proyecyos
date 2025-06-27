// Controllers/UtilitiesController.cs
using Microsoft.AspNetCore.Mvc;
using MiUtilsApi.Services;
using MiUtilsApi.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using MiUtilsApi.Security;
using System.Threading.Tasks;

namespace MiUtilsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,User")] // Todos los endpoints aquí requieren token (User o Admin)
    [ServiceFilter(typeof(IpRestrictionAttribute))] // Y la IP debe estar permitida
    public class UtilitiesController : ControllerBase
    {
        private readonly UtilityService _utilityService;

        public UtilitiesController(UtilityService utilityService)
        {
            _utilityService = utilityService;
        }

        // --- Endpoints para Palíndromos ---

        /// <summary>
        /// Verifica si una cadena de texto es un palíndromo y la guarda en la base de datos.
        /// POST: api/Utilities/palindromes
        /// Requiere token (Admin) e IP permitida.
        /// </summary>
        [HttpPost("palindromes")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddPalindrome([FromBody] PalindromeEntry entry)
        {
            if (string.IsNullOrWhiteSpace(entry.OriginalText))
            {
                return BadRequest("El texto original no puede estar vacío.");
            }
            try
            {
                var addedEntry = await _utilityService.ProcessPalindrome(entry.OriginalText);
                return StatusCode(201, addedEntry);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al procesar palíndromo: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene todos los registros de palíndromos desde la base de datos.
        /// GET: api/Utilities/palindromes
        /// Requiere token (User o Admin) e IP permitida.
        /// </summary>
        [HttpGet("palindromes")]
        public async Task<IActionResult> GetAllPalindromes()
        {
            var palindromes = await _utilityService.GetAllPalindromesAsync();
            return Ok(palindromes);
        }

        /// <summary>
        /// Obtiene un registro de palíndromo por ID.
        /// GET: api/Utilities/palindromes/{id}
        /// Requiere token (User o Admin) e IP permitida.
        /// </summary>
        [HttpGet("palindromes/{id}")]
        public async Task<IActionResult> GetPalindromeById(int id)
        {
            var palindrome = await _utilityService.GetPalindromeByIdAsync(id);
            if (palindrome == null)
            {
                return NotFound($"Palíndromo con ID {id} no encontrado.");
            }
            return Ok(palindrome);
        }

        /// <summary>
        /// Elimina un registro de palíndromo por ID.
        /// DELETE: api/Utilities/palindromes/{id}
        /// Requiere token (Admin) e IP permitida.
        /// </summary>
        [HttpDelete("palindromes/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePalindrome(int id)
        {
            var existingEntry = await _utilityService.GetPalindromeByIdAsync(id);
            if (existingEntry == null)
            {
                return NotFound($"Palíndromo con ID {id} no encontrado para eliminar.");
            }
            await _utilityService.DeletePalindromeAsync(id);
            return NoContent();
        }


        // --- Endpoints para Números (Par/Impar) ---

        /// <summary>
        /// Verifica si un número es par o impar y lo guarda en la base de datos.
        /// POST: api/Utilities/numbers
        /// Requiere token (Admin) e IP permitida.
        /// </summary>
        [HttpPost("numbers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddNumber([FromBody] NumberEntry entry)
        {
            if (entry.Value == 0 && !Request.Body.CanSeek)
            {
                 // Considera una validación más robusta si 0 es un valor de entrada válido.
            }
            try
            {
                var addedEntry = await _utilityService.ProcessNumberParity(entry.Value);
                return StatusCode(201, addedEntry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al procesar número: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene todos los registros de números desde la base de datos.
        /// GET: api/Utilities/numbers
        /// Requiere token (User o Admin) e IP permitida.
        /// </summary>
        [HttpGet("numbers")]
        public async Task<IActionResult> GetAllNumbers()
        {
            var numbers = await _utilityService.GetAllNumbersAsync();
            return Ok(numbers);
        }

        /// <summary>
        /// Obtiene un registro de número por ID.
        /// GET: api/Utilities/numbers/{id}
        /// Requiere token (User o Admin) e IP permitida.
        /// </summary>
        [HttpGet("numbers/{id}")]
        public async Task<IActionResult> GetNumberById(int id)
        {
            var number = await _utilityService.GetNumberByIdAsync(id);
            if (number == null)
            {
                return NotFound($"Número con ID {id} no encontrado.");
            }
            return Ok(number);
        }

        /// <summary>
        /// Elimina un registro de número por ID.
        /// DELETE: api/Utilities/numbers/{id}
        /// Requiere token (Admin) e IP permitida.
        /// </summary>
        [HttpDelete("numbers/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteNumber(int id)
        {
            var existingEntry = await _utilityService.GetNumberByIdAsync(id);
            if (existingEntry == null)
            {
                return NotFound($"Número con ID {id} no encontrado para eliminar.");
            }
            await _utilityService.DeleteNumberAsync(id);
            return NoContent();
        }
    }
}
