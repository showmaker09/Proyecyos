using InscripcionApi.Data;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InscripcionApi.Repositories.Implementations
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync(int page, int pageSize)
        {
            return await _context.Students
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync();
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            return await _context.Students.FindAsync(id);
        }

        public async Task<Student?> GetStudentByEmailAsync(string email)
        {
            return await _context.Students.FirstOrDefaultAsync(s => s.Email == email);
        }

        public async Task<Student?> GetStudentByUsernameAsync(string username)
        {
            return await _context.Students.FirstOrDefaultAsync(s => s.Username == username);
        }

        public async Task AddStudentAsync(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStudentAsync(Student student)
        {
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteStudentAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student != null)
            {
                _context.Students.Remove(student);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> StudentExistsAsync(int id)
        {
            return await _context.Students.AnyAsync(e => e.Id == id);
        }

        public async Task<bool> StudentExistsByEmailAsync(string email)
        {
            return await _context.Students.AnyAsync(s => s.Email == email);
        }

        public async Task<bool> StudentExistsByUsernameAsync(string username)
        {
            return await _context.Students.AnyAsync(s => s.Username == username);
        }
    }
}