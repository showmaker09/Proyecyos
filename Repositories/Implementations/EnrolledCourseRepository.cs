using InscripcionApi.Data;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InscripcionApi.Repositories.Implementations
{
    public class EnrolledCourseRepository : IEnrolledCourseRepository
    {
        private readonly ApplicationDbContext _context;

        public EnrolledCourseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EnrolledCourse?> GetByIdAsync(int id)
        {
            return await _context.EnrolledCourses.FindAsync(id);
        }

        public async Task<IEnumerable<EnrolledCourse>> GetByEnrollmentIdAsync(int enrollmentId)
        {
            return await _context.EnrolledCourses
                                 .Where(ec => ec.SemesterEnrollmentId == enrollmentId)
                                 .ToListAsync();
        }

        public async Task AddAsync(EnrolledCourse enrolledCourse)
        {
            await _context.EnrolledCourses.AddAsync(enrolledCourse);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(EnrolledCourse enrolledCourse)
        {
            _context.EnrolledCourses.Update(enrolledCourse);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(EnrolledCourse enrolledCourse)
        {
            _context.EnrolledCourses.Remove(enrolledCourse);
            await _context.SaveChangesAsync();
        }
    }
}