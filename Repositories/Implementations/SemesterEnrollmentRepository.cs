using InscripcionApi.Data;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InscripcionApi.Repositories.Implementations
{
    public class SemesterEnrollmentRepository : ISemesterEnrollmentRepository
    {
        private readonly ApplicationDbContext _context;

        public SemesterEnrollmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SemesterEnrollment?> GetByIdAsync(int id)
        {
            return await _context.SemesterEnrollments
                                 .Include(se => se.EnrolledCourses)
                                 .FirstOrDefaultAsync(se => se.Id == id);
        }

        // Regla de negocio: obtener la inscripción activa de un estudiante (asumiendo una por semestre)
        public async Task<SemesterEnrollment?> GetActiveEnrollmentByStudentIdAsync(int studentId)
        {
            // Para simplificar, consideramos "activa" la última inscripción creada para el estudiante.
            // En un sistema real, podrías tener un campo "IsActive" o comparar fechas de inicio/fin del semestre.
            return await _context.SemesterEnrollments
                                 .Where(se => se.StudentId == studentId)
                                 .OrderByDescending(se => se.EnrollmentDate)
                                 .Include(se => se.EnrolledCourses)
                                 .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<SemesterEnrollment>> GetAllByStudentIdAsync(int studentId, int page, int pageSize)
        {
            return await _context.SemesterEnrollments
                                 .Where(se => se.StudentId == studentId)
                                 .Include(se => se.EnrolledCourses)
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync();
        }

        public async Task AddAsync(SemesterEnrollment enrollment)
        {
            await _context.SemesterEnrollments.AddAsync(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SemesterEnrollment enrollment)
        {
            _context.SemesterEnrollments.Update(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(SemesterEnrollment enrollment)
        {
            _context.SemesterEnrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountByStudentIdAsync(int studentId)
        {
            return await _context.SemesterEnrollments.CountAsync(se => se.StudentId == studentId);
        }
    }
}