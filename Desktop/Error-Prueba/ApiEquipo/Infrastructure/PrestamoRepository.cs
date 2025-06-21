using MiMangaBot.Domain;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace MiMangaBot.Infrastructure;

public class PrestamoRepository
{
    private readonly string _connectionString;

    public PrestamoRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IEnumerable<Prestamo> GetAllPrestamos()
    {
        var prestamos = new List<Prestamo>();
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "SELECT id, MangaId, FechaPrestamo, QuienPresto FROM Manga_Flor.prestamos";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            prestamos.Add(new Prestamo
                            {
                                Id = reader.GetInt32("id"),
                                MangaId = reader.GetInt32("MangaId"),
                                FechaPrestamo = reader.GetDateTime("FechaPrestamo"),
                                QuienPresto = reader.IsDBNull(reader.GetOrdinal("QuienPresto")) ? null : reader.GetString("QuienPresto")
                            });
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener todos los préstamos: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener todos los préstamos: {ex.Message}");
                throw;
            }
        }
        return prestamos;
    }

    public Prestamo? GetPrestamoById(int id)
    {
        Prestamo? prestamo = null;
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "SELECT id, MangaId, FechaPrestamo, QuienPresto FROM Manga_Flor.prestamos WHERE id = @id";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            prestamo = new Prestamo
                            {
                                Id = reader.GetInt32("id"),
                                MangaId = reader.GetInt32("MangaId"),
                                FechaPrestamo = reader.GetDateTime("FechaPrestamo"),
                                QuienPresto = reader.IsDBNull(reader.GetOrdinal("QuienPresto")) ? null : reader.GetString("QuienPresto")
                            };
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener préstamo por ID: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener préstamo por ID: {ex.Message}");
                throw;
            }
        }
        return prestamo;
    }

    public void AddPrestamo(Prestamo prestamo)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "INSERT INTO Manga_Flor.prestamos (MangaId, FechaPrestamo, QuienPresto) VALUES (@mangaId, @fechaPrestamo, @quienPresto)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@mangaId", prestamo.MangaId);
                    command.Parameters.AddWithValue("@fechaPrestamo", prestamo.FechaPrestamo);
                    command.Parameters.AddWithValue("@quienPresto", (object?)prestamo.QuienPresto ?? DBNull.Value);
                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al añadir préstamo: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al añadir préstamo: {ex.Message}");
                throw;
            }
        }
    }

    public void UpdatePrestamo(int id, Prestamo updatedPrestamo)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "UPDATE Manga_Flor.prestamos SET MangaId = @mangaId, FechaPrestamo = @fechaPrestamo, QuienPresto = @quienPresto WHERE id = @id";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@mangaId", updatedPrestamo.MangaId);
                    command.Parameters.AddWithValue("@fechaPrestamo", updatedPrestamo.FechaPrestamo);
                    command.Parameters.AddWithValue("@quienPresto", (object?)updatedPrestamo.QuienPresto ?? DBNull.Value);
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al actualizar préstamo: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al actualizar préstamo: {ex.Message}");
                throw;
            }
        }
    }

    public void DeletePrestamo(int id)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "DELETE FROM Manga_Flor.prestamos WHERE id = @id";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al eliminar préstamo: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al eliminar préstamo: {ex.Message}");
                throw;
            }
        }
    }
}