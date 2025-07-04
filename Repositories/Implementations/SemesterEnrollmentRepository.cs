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

        public async Task<IEnumerable<SemesterEnrollment>> GetAllEnrollmentsAsync(int page, int pageSize)
        {
            return await _context.SemesterEnrollments
                                 .Include(se => se.EnrolledCourses)
                                 .Include(se => se.Student)
                                 .OrderBy(se => se.EnrollmentDate)
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync();
        }

        public async Task<SemesterEnrollment?> GetEnrollmentByIdAsync(int id)
        {
            return await _context.SemesterEnrollments
                                 .Include(se => se.EnrolledCourses)
                                 .Include(se => se.Student)
                                 .FirstOrDefaultAsync(se => se.Id == id);
        }

        public async Task<SemesterEnrollment?> GetActiveEnrollmentByStudentIdAsync(int studentId)
        {
            return await _context.SemesterEnrollments
                                 .Include(se => se.EnrolledCourses)
                                 .FirstOrDefaultAsync(se => se.StudentId == studentId);
        }

        public async Task AddEnrollmentAsync(SemesterEnrollment enrollment)
        {
            _context.SemesterEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEnrollmentAsync(SemesterEnrollment enrollment)
        {
            _context.SemesterEnrollments.Update(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEnrollmentAsync(int id)
        {
            var enrollment = await _context.SemesterEnrollments.FindAsync(id);
            if (enrollment != null)
            {
                _context.SemesterEnrollments.Remove(enrollment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> EnrollmentExistsAsync(int id)
        {
            return await _context.SemesterEnrollments.AnyAsync(e => e.Id == id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}