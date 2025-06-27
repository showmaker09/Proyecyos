// Repositories/PalindromeRepository.cs
using MiUtilsApi.Models;
using MiUtilsApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiUtilsApi.Repositories
{
    public class PalindromeRepository
    {
        private readonly string _connectionString; // Ahora inyectamos la cadena de conexión

        public PalindromeRepository(string connectionString) // El constructor recibe la cadena de conexión
        {
            _connectionString = connectionString;
        }

        public async Task<PalindromeEntry> AddPalindromeEntryAsync(PalindromeEntry entry)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                await context.Palindromes.AddAsync(entry);
                await context.SaveChangesAsync();
                return entry;
            }
        }

        public async Task<IEnumerable<PalindromeEntry>> GetAllPalindromeEntriesAsync()
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                return await context.Palindromes.OrderByDescending(p => p.CreationDate).ToListAsync();
            }
        }

        public async Task<PalindromeEntry?> GetPalindromeEntryByIdAsync(int id)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                return await context.Palindromes.FindAsync(id);
            }
        }

        public async Task DeletePalindromeEntryAsync(int id)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                var entry = await context.Palindromes.FindAsync(id);
                if (entry != null)
                {
                    context.Palindromes.Remove(entry);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
