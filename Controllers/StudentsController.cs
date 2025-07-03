using InscripcionApi.Dtos.Students;
using InscripcionApi.Services.Interfaces;
using InscripcionApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Para acceder a los claims del usuario

namespace InscripcionApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Estudiante")] // Solo usuarios autenticados (Admin o Estudiante) pueden acceder
    [ServiceFilter(typeof(IpRestrictionAttribute))] // Proteger todos los endpoints del controlador
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(IStudentService studentService, ILogger<StudentsController> logger)
        {
            _studentService = studentService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene un estudiante por su ID. Solo accesible por el propio estudiante o un Admin.
        /// </summary>
        /// <param name="id">ID del estudiante.</param>
        /// <returns>Detalles del estudiante.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetStudent(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null)
            {
                return Forbid(); // No debería ocurrir si [Authorize] funciona
            }

            // Permite al estudiante ver solo su propio perfil, a menos que sea un Admin
            if (userRole != "Admin" && userId != id.ToString())
            {
                return Forbid();
            }

            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null)
            {
                return NotFound($"Estudiante con ID {id} no encontrado.");
            }
            return Ok(student);
        }

        /// <summary>
        /// Obtiene todos los estudiantes con paginación. Solo accesible por Admin.
        /// </summary>
        /// <param name="page">Número de página.</param>
        /// <param name="pageSize">Tamaño de la página.</param>
        /// <returns>Lista paginada de estudiantes.</returns>
        [HttpGet]
        [Authorize(Roles = "Admin")] // Solo Admin puede listar todos
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAllStudents([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1 || pageSize < 1)
            {
                return BadRequest("Los parámetros de paginación deben ser mayores que 0.");
            }

            var (students, totalItems) = await _studentService.GetAllStudentsAsync(page, pageSize);
            return Ok(new { data = students, total = totalItems, page, pageSize });
        }

        /// <summary>
        /// Crea un nuevo estudiante. Solo accesible por Admin.
        /// </summary>
        /// <param name="createDto">Datos del nuevo estudiante.</param>
        /// <returns>El estudiante creado.</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")] // Solo Admin puede crear estudiantes
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateStudent([FromBody] StudentCreateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newStudent = await _studentService.CreateStudentAsync(createDto);
                return CreatedAtAction(nameof(GetStudent), new { id = newStudent.Id }, newStudent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Actualiza la información de un estudiante. Accesible por el propio estudiante o un Admin.
        /// </summary>
        /// <param name="id">ID del estudiante a actualizar.</param>
        /// <param name="updateDto">Datos a actualizar.</param>
        /// <returns>El estudiante actualizado.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateDto updateDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null)
            {
                return Forbid();
            }

            // Permite al estudiante actualizar solo su propio perfil, a menos que sea un Admin
            if (userRole != "Admin" && userId != id.ToString())
            {
                return Forbid();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedStudent = await _studentService.UpdateStudentAsync(id, updateDto);
                if (updatedStudent == null)
                {
                    return NotFound($"Estudiante con ID {id} no encontrado.");
                }
                return Ok(updatedStudent);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Elimina un estudiante por su ID. Solo accesible por Admin.
        /// </summary>
        /// <param name="id">ID del estudiante a eliminar.</param>
        /// <returns>Respuesta de no contenido si es exitoso.</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Solo Admin puede eliminar estudiantes
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var result = await _studentService.DeleteStudentAsync(id);
            if (!result)
            {
                return NotFound($"Estudiante con ID {id} no encontrado.");
            }
            return NoContent();
        }
    }
}