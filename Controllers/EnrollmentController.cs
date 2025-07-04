using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Security;
using InscripcionApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InscripcionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Estudiante")]
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

        private int GetStudentIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int studentId))
            {
                throw new UnauthorizedAccessException("ID de estudiante no encontrado o inválido en el token.");
            }
            return studentId;
        }

        [HttpPost("start")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(SemesterEnrollmentResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> StartSemesterEnrollment([FromBody] StartEnrollmentDto startEnrollmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int studentId = GetStudentIdFromToken();
            if (studentId != startEnrollmentDto.StudentId)
            {
                return Forbid("No tienes permiso para iniciar una inscripción para otro estudiante.");
            }

            try
            {
                var newEnrollment = await _enrollmentService.StartSemesterEnrollmentAsync(startEnrollmentDto);
                _logger.LogInformation("Inscripción semestral iniciada para el estudiante ID {StudentId}, Semestre: {SemesterName}", studentId, startEnrollmentDto.SemesterName);
                return CreatedAtAction(nameof(GetSemesterEnrollmentById), new { enrollmentId = newEnrollment?.Id }, newEnrollment);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Conflicto al iniciar la inscripción semestral para el estudiante ID {StudentId}: {Message}", studentId, ex.Message);
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Solicitud incorrecta para iniciar la inscripción semestral para el estudiante ID {StudentId}: {Message}", studentId, ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al iniciar la inscripción semestral para el estudiante ID {StudentId}.", studentId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor al iniciar inscripción.");
            }
        }

        [HttpPost("{enrollmentId}/add-course")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EnrolledCourseResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> EnrollCourse(int enrollmentId, [FromBody] EnrollCourseDto enrollCourseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int studentId = GetStudentIdFromToken();
            var enrollment = await _enrollmentService.GetSemesterEnrollmentByIdAsync(enrollmentId);
            if (enrollment == null)
            {
                return NotFound($"Inscripción semestral con ID {enrollmentId} no encontrada.");
            }
            if (enrollment.StudentId != studentId)
            {
                return Forbid("No tienes permiso para inscribir cursos en esta inscripción.");
            }

            try
            {
                var newEnrolledCourse = await _enrollmentService.EnrollCourseAsync(enrollmentId, enrollCourseDto);
                _logger.LogInformation("Curso '{CourseName}' inscrito en la inscripción ID {EnrollmentId}", enrollCourseDto.CourseName, enrollmentId);
                return Ok(newEnrolledCourse);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Solicitud incorrecta para inscribir curso en la inscripción ID {EnrollmentId}: {Message}", enrollmentId, ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("Conflicto al inscribir curso en la inscripción ID {EnrollmentId}: {Message}", enrollmentId, ex.Message);
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al inscribir curso en la inscripción ID {EnrollmentId}.", enrollmentId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor al inscribir curso.");
            }
        }

        [HttpGet("{enrollmentId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SemesterEnrollmentResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetSemesterEnrollmentById(int enrollmentId)
        {
            int studentId = GetStudentIdFromToken();
            var enrollment = await _enrollmentService.GetSemesterEnrollmentByIdAsync(enrollmentId);

            if (enrollment == null)
            {
                return NotFound($"Inscripción semestral con ID {enrollmentId} no encontrada.");
            }
            if (enrollment.StudentId != studentId)
            {
                return Forbid("No tienes permiso para ver esta inscripción.");
            }

            return Ok(enrollment);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<SemesterEnrollmentResponseDto>))]
        public async Task<IActionResult> GetAllSemesterEnrollments([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == "Estudiante")
            {
                int studentId = GetStudentIdFromToken();
                var allEnrollments = await _enrollmentService.GetAllSemesterEnrollmentsAsync(1, int.MaxValue);
                var studentEnrollments = allEnrollments.Where(e => e.StudentId == studentId).Skip((page - 1) * pageSize).Take(pageSize);
                return Ok(studentEnrollments);
            }
            else if (userRole == "Administrador")
            {
                var enrollments = await _enrollmentService.GetAllSemesterEnrollmentsAsync(page, pageSize);
                return Ok(enrollments);
            }
            
            return Forbid("Rol no autorizado para ver inscripciones.");
        }

        [HttpDelete("{enrollmentId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteSemesterEnrollment(int enrollmentId)
        {
            int studentId = GetStudentIdFromToken();
            var enrollment = await _enrollmentService.GetSemesterEnrollmentByIdAsync(enrollmentId);
            if (enrollment == null)
            {
                return NotFound($"Inscripción semestral con ID {enrollmentId} no encontrada.");
            }
            if (enrollment.StudentId != studentId)
            {
                return Forbid("No tienes permiso para eliminar esta inscripción.");
            }

            var result = await _enrollmentService.DeleteSemesterEnrollmentAsync(enrollmentId);
            if (!result)
            {
                return NotFound($"Inscripción semestral con ID {enrollmentId} no encontrada.");
            }
            _logger.LogInformation("Inscripción semestral ID {EnrollmentId} eliminada.", enrollmentId);
            return NoContent();
        }

        [HttpDelete("{enrollmentId}/remove-course/{enrolledCourseId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> RemoveEnrolledCourse(int enrollmentId, int enrolledCourseId)
        {
            int studentId = GetStudentIdFromToken();
            var enrollment = await _enrollmentService.GetSemesterEnrollmentByIdAsync(enrollmentId);
            if (enrollment == null)
            {
                return NotFound($"Inscripción semestral con ID {enrollmentId} no encontrada.");
            }
            if (enrollment.StudentId != studentId)
            {
                return Forbid("No tienes permiso para modificar esta inscripción.");
            }

            try
            {
                var result = await _enrollmentService.RemoveEnrolledCourseAsync(enrollmentId, enrolledCourseId);
                if (!result)
                {
                    return NotFound($"Curso inscrito con ID {enrolledCourseId} no encontrado en la inscripción {enrollmentId}.");
                }
                _logger.LogInformation("Curso inscrito ID {EnrolledCourseId} removido de la inscripción ID {EnrollmentId}.", enrolledCourseId, enrollmentId);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Solicitud incorrecta para remover curso inscrito: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al remover curso inscrito ID {EnrolledCourseId} de la inscripción ID {EnrollmentId}.", enrolledCourseId, enrollmentId);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error interno del servidor al remover curso inscrito.");
            }
        }
    }
}