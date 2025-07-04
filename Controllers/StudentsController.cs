using InscripcionApi.Dtos.Students;
using InscripcionApi.Security;
using InscripcionApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InscripcionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(IStudentService studentService, ILogger<StudentsController> logger)
        {
            _studentService = studentService;
            _logger = logger;
        }

        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(StudentResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RegisterStudent([FromBody] StudentCreateDto studentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newStudent = await _studentService.RegisterStudentAsync(studentDto);
                _logger.LogInformation("Estudiante registrado exitosamente: {Email} con Username: {Username}", newStudent?.Email, newStudent?.Username);
                return CreatedAtAction(nameof(GetStudentById), new { id = newStudent?.Id }, newStudent);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Conflicto al registrar estudiante: {Message}", ex.Message);
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar estudiante.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor.");
            }
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        [ServiceFilter(typeof(IpRestrictionAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<StudentResponseDto>))]
        public async Task<IActionResult> GetAllStudents([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var students = await _studentService.GetAllStudentsAsync(page, pageSize);
            return Ok(students);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Estudiante")]
        [ServiceFilter(typeof(IpRestrictionAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StudentResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userRole == "Estudiante" && userId != id.ToString())
            {
                return Forbid("No tienes permiso para ver este perfil de estudiante.");
            }

            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null)
            {
                return NotFound($"Estudiante con ID {id} no encontrado.");
            }
            return Ok(student);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Estudiante")]
        [ServiceFilter(typeof(IpRestrictionAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(StudentResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateDto studentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userRole == "Estudiante" && userId != id.ToString())
            {
                return Forbid("No tienes permiso para actualizar este perfil de estudiante.");
            }

            try
            {
                var updatedStudent = await _studentService.UpdateStudentAsync(id, studentDto);
                if (updatedStudent == null)
                {
                    return NotFound($"Estudiante con ID {id} no encontrado.");
                }
                _logger.LogInformation("Estudiante con ID {Id} actualizado exitosamente.", id);
                return Ok(updatedStudent);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Conflicto al actualizar estudiante {Id}: {Message}", id, ex.Message);
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar estudiante con ID {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor.");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        [ServiceFilter(typeof(IpRestrictionAttribute))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var result = await _studentService.DeleteStudentAsync(id);
            if (!result)
            {
                return NotFound($"Estudiante con ID {id} no encontrado.");
            }
            _logger.LogInformation("Estudiante con ID {Id} eliminado exitosamente.", id);
            return NoContent();
        }
    }
}