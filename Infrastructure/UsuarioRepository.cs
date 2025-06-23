// MiMangaBot.Infrastructure/UsuarioRepository.cs
using MiMangaBot.Domain;
using MySql.Data.MySqlClient; // ¡Necesario para MySQL!
using System;
using System.Threading.Tasks;

namespace MiMangaBot.Infrastructure;

public class UsuarioRepository
{
    private readonly string _connectionString;

    public UsuarioRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<Usuario?> GetByUsername(string username)
    {
        Usuario? user = null;
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                await connection.OpenAsync();
                // IMPORTANTE: Los nombres de columna aquí deben COINCIDIR EXACTAMENTE con tu BD MySQL (sensible a mayúsculas/minúsculas)
                string query = "SELECT Id, Username, PasswordHash, Role FROM Manga_Flor.usuarios WHERE Username = @username";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@username", username);

                    using (MySqlDataReader reader = (MySqlDataReader)await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            user = new Usuario
                            {
                                Id = reader.GetInt32("Id"),          // COINCIDIR CON EL NOMBRE DE COLUMNA DE LA BD
                                Username = reader.GetString("Username"), // COINCIDIR CON EL NOMBRE DE COLUMNA DE LA BD
                                PasswordHash = reader.GetString("PasswordHash"), // COINCIDIR CON EL NOMBRE DE COLUMNA DE LA BD
                                Role = reader.GetString("Role")      // COINCIDIR CON EL NOMBRE DE COLUMNA DE LA BD
                            };
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener usuario por nombre: {ex.Message}");
                throw; // Volver a lanzar para que las capas superiores puedan manejarlo
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener usuario por nombre: {ex.Message}");
                throw; // Volver a lanzar para que las capas superiores puedan manejarlo
            }
        }
        return user;
    }

    // Este método es opcional, pero útil si quieres añadir usuarios desde tu API en el futuro
    
}