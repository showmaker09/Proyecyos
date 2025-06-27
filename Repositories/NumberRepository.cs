// Repositories/NumberRepository.cs
using MiUtilsApi.Models;
using MiUtilsApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiUtilsApi.Repositories
{
    public class NumberRepository
    {
        private readonly string _connectionString;

        public NumberRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<NumberEntry> AddNumberEntryAsync(NumberEntry entry)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                await context.Numbers.AddAsync(entry);
                await context.SaveChangesAsync();
                return entry;
            }
        }

        public async Task<IEnumerable<NumberEntry>> GetAllNumberEntriesAsync()
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                return await context.Numbers.OrderByDescending(n => n.CreationDate).ToListAsync();
            }
        }

        public async Task<NumberEntry?> GetNumberEntryByIdAsync(int id)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                return await context.Numbers.FindAsync(id);
            }
        }

        public async Task DeleteNumberEntryAsync(int id)
        {
            using (var context = new ApplicationDbContext(_connectionString))
            {
                var entry = await context.Numbers.FindAsync(id);
                if (entry != null)
                {
                    context.Numbers.Remove(entry);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
