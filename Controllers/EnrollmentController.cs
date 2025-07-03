using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Services.Interfaces;
using InscripcionApi.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InscripcionApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Estudiante,Admin")] // Estudiantes y Admin pueden interactuar con inscripciones
    [ServiceFilter(typeof(IpRestrictionAttribute))]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly ILogger<EnrollmentController> _logger;

        public EnrollmentController(IEnrollmentService enrollmentService, ILogger<EnrollmentController> logger)
        {
            _enrollmentService = enrollmentService;
            _logger = logger;
        }

        /// <summary>
        /// Inicia una nueva inscripción semestral para un estudiante.
        /// Solo el propio estudiante (o un Admin) puede iniciar su inscripción.
        /// </summary>
        /// <param name="startDto">Datos para iniciar la inscripción.</param>
        /// <returns>Detalles de la inscripción creada.</returns>
        [HttpPost("start")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Para duplicidad de inscripción
        public async Task<IActionResult> StartSemesterEnrollment([FromBody] StartEnrollmentDto startDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null) return Forbid();

            // Asegurar que el estudiante solo pueda iniciar su propia inscripción
            if (userRole == "Estudiante" && startDto.StudentId.ToString() != userId)
            {
                return Forbid("No tienes permiso para iniciar una inscripción para otro estudiante.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var newEnrollment = await _enrollmentService.StartSemesterEnrollmentAsync(startDto);
                return CreatedAtAction(nameof(GetEnrollment), new { id = newEnrollment?.Id }, newEnrollment);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Conflicto al iniciar inscripción: {ex.Message}");
                return Conflict(new { message = ex.Message }); // Regla de negocio: estudiante ya inscrito
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Error en datos al iniciar inscripción: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Inscribe una materia a una inscripción semestral existente.
        /// Solo el propio estudiante (o un Admin) puede añadir cursos a su inscripción.
        /// </summary>
        /// <param name="enrollmentId">ID de la inscripción semestral.</param>
        /// <param name="enrollDto">Datos de la materia a inscribir.</param>
        /// <returns>Detalles actualizados de la inscripción.</returns>
        [HttpPost("{enrollmentId}/add-course")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Para límite de créditos excedido
        public async Task<IActionResult> EnrollCourse(int enrollmentId, [FromBody] EnrollCourseDto enrollDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null) return Forbid();

            // Verificar si el usuario tiene permiso sobre esta inscripción
            var enrollment = await _enrollmentService.GetEnrollmentByIdAsync(enrollmentId);
            if (enrollment == null) return NotFound($"Inscripción con ID {enrollmentId} no encontrada.");

            if (userRole == "Estudiante" && enrollment.StudentId.ToString() != userId)
            {
                return Forbid("No tienes permiso para añadir cursos a esta inscripción.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEnrollment = await _enrollmentService.EnrollCourseAsync(enrollmentId, enrollDto);
                return Ok(updatedEnrollment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Conflicto de créditos en inscripción {enrollmentId}: {ex.Message}");
                return Conflict(new { message = ex.Message }); // Regla de negocio: límite de créditos
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene los detalles de una inscripción semestral por su ID.
        /// Solo el propio estudiante (o un Admin) puede ver su inscripción.
        /// </summary>
        /// <param name="id">ID de la inscripción.</param>
        /// <returns>Detalles de la inscripción.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetEnrollment(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null) return Forbid();

            var enrollment = await _enrollmentService.GetEnrollmentByIdAsync(id);
            if (enrollment == null)
            {
                return NotFound($"Inscripción con ID {id} no encontrada.");
            }

            // Asegurar que el estudiante solo vea sus propias inscripciones
            if (userRole == "Estudiante" && enrollment.StudentId.ToString() != userId)
            {
                return Forbid("No tienes permiso para ver esta inscripción.");
            }

            return Ok(enrollment);
        }

        /// <summary>
        /// Obtiene todas las inscripciones de un estudiante con paginación.
        /// Solo el propio estudiante (o un Admin) puede ver sus inscripciones.
        /// </summary>
        /// <param name="studentId">ID del estudiante.</param>
        /// <param name="page">Número de página.</param>
        /// <param name="pageSize">Tamaño de la página.</param>
        /// <returns>Lista paginada de inscripciones.</returns>
        [HttpGet("student/{studentId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetEnrollmentsByStudent(int studentId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userId == null || userRole == null) return Forbid();

            // Asegurar que el estudiante solo vea sus propias inscripciones
            if (userRole == "Estudiante" && studentId.ToString() != userId)
            {
                return Forbid("No tienes permiso para ver las inscripciones de otro estudiante.");
            }

            if (page < 1 || pageSize < 1)
            {
                return BadRequest("Los parámetros de paginación deben ser mayores que 0.");
            }

            var (enrollments, totalItems) = await _enrollmentService.GetEnrollmentsByStudentIdAsync(studentId, page, pageSize);
            return Ok(new { data = enrollments, total = totalItems, page, pageSize });
        }
    }
}