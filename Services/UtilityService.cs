// Services/UtilityService.cs
using MiUtilsApi.Models;
using MiUtilsApi.Repositories; // Para PalindromeRepository y NumberRepository
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MiUtilsApi.Services
{
    public class UtilityService
    {
        private readonly PalindromeRepository _palindromeRepository;
        private readonly NumberRepository _numberRepository;

        // El constructor ahora recibe los repositorios
        public UtilityService(PalindromeRepository palindromeRepository, NumberRepository numberRepository)
        {
            _palindromeRepository = palindromeRepository;
            _numberRepository = numberRepository;
        }

        public async Task<PalindromeEntry> ProcessPalindrome(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                throw new ArgumentException("El texto no puede estar vacío.");
            }
            string cleanedText = Regex.Replace(text, "[^a-zA-Z0-9]", "").ToLowerInvariant();
            bool isPalindrome = cleanedText.SequenceEqual(cleanedText.Reverse());

            var entry = new PalindromeEntry
            {
                OriginalText = text,
                IsPalindromeResult = isPalindrome,
                CreationDate = DateTime.UtcNow
            };
            return await _palindromeRepository.AddPalindromeEntryAsync(entry);
        }

        public async Task<NumberEntry> ProcessNumberParity(int number)
        {
            string parity = number % 2 == 0 ? "par" : "impar";
            var entry = new NumberEntry
            {
                Value = number,
                ParityResult = parity,
                CreationDate = DateTime.UtcNow
            };
            return await _numberRepository.AddNumberEntryAsync(entry);
        }

        public async Task<IEnumerable<PalindromeEntry>> GetAllPalindromesAsync()
        {
            return await _palindromeRepository.GetAllPalindromeEntriesAsync();
        }
        public async Task<PalindromeEntry?> GetPalindromeByIdAsync(int id)
        {
            return await _palindromeRepository.GetPalindromeEntryByIdAsync(id);
        }
        public async Task DeletePalindromeAsync(int id)
        {
            await _palindromeRepository.DeletePalindromeEntryAsync(id);
        }

        public async Task<IEnumerable<NumberEntry>> GetAllNumbersAsync()
        {
            return await _numberRepository.GetAllNumberEntriesAsync();
        }
        public async Task<NumberEntry?> GetNumberByIdAsync(int id)
        {
            return await _numberRepository.GetNumberEntryByIdAsync(id);
        }
        public async Task DeleteNumberAsync(int id)
        {
            await _numberRepository.DeleteNumberEntryAsync(id);
        }
    }
}
