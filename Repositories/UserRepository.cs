// Repositories/UserRepository.cs
using MiUtilsApi.Models;
using MiUtilsApi.Data; // Para ApplicationDbContext
using Microsoft.EntityFrameworkCore; // Para FirstOrDefaultAsync

namespace MiUtilsApi.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString; // Ahora inyectamos la cadena de conexión

        public UserRepository(string connectionString) // El constructor recibe la cadena de conexión
        {
            _connectionString = connectionString;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            // Creamos un nuevo contexto para cada operación
            using (var context = new ApplicationDbContext(_connectionString))
            {
                return await context.Users.FirstOrDefaultAsync(u => u.Username == username);
            }
        }

        public async Task AddUserAsync(User user)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
            }
        }
    }
}
