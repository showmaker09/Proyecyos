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

        public async Task<IEnumerable<EnrolledCourse>> GetCoursesByEnrollmentIdAsync(int enrollmentId)
        {
            return await _context.EnrolledCourses
                                 .Where(ec => ec.SemesterEnrollmentId == enrollmentId)
                                 .ToListAsync();
        }

        public async Task<EnrolledCourse?> GetEnrolledCourseByIdAsync(int id)
        {
            return await _context.EnrolledCourses.FindAsync(id);
        }

        public async Task AddEnrolledCourseAsync(EnrolledCourse enrolledCourse)
        {
            _context.EnrolledCourses.Add(enrolledCourse);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEnrolledCourseAsync(EnrolledCourse enrolledCourse)
        {
            _context.EnrolledCourses.Update(enrolledCourse);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteEnrolledCourseAsync(int id)
        {
            var enrolledCourse = await _context.EnrolledCourses.FindAsync(id);
            if (enrolledCourse != null)
            {
                _context.EnrolledCourses.Remove(enrolledCourse);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> EnrolledCourseExistsAsync(int id)
        {
            return await _context.EnrolledCourses.AnyAsync(e => e.Id == id);
        }
    }
}