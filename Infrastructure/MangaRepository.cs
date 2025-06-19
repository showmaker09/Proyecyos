using MiMangaBot.Domain;
using MiMangaBot.Domain.Filters;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MiMangaBot.Infrastructure;

public class MangaRepository
{
    private readonly string _connectionString;

    public MangaRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IEnumerable<Manga> GetAllMangas()
    {
        var mangas = new List<Manga>();
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "SELECT id, nombre, genero, Fecha_de_Publicacion FROM Manga_Flor.mangas";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            mangas.Add(new Manga
                            {
                                Id = reader.GetInt32("id"),
                                Nombre = reader.GetString("nombre"),
                                Genero = reader.IsDBNull(reader.GetOrdinal("genero")) ? null : reader.GetString("genero"),
                                // ¡CAMBIO AQUÍ! Leer como String
                                FechaDePublicacion = reader.IsDBNull(reader.GetOrdinal("Fecha_de_Publicacion")) ? null : reader.GetString("Fecha_de_Publicacion")
                            });
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener todos los mangas: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener todos los mangas: {ex.Message}");
                throw;
            }
        }
        return mangas;
    }

    public Manga? GetMangaById(int id)
    {
        Manga? manga = null;
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "SELECT id, nombre, genero, Fecha_de_Publicacion FROM Manga_Flor.mangas WHERE id = @id";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            manga = new Manga
                            {
                                Id = reader.GetInt32("id"),
                                Nombre = reader.GetString("nombre"),
                                Genero = reader.IsDBNull(reader.GetOrdinal("genero")) ? null : reader.GetString("genero"),
                                // ¡CAMBIO AQUÍ!
                                FechaDePublicacion = reader.IsDBNull(reader.GetOrdinal("Fecha_de_Publicacion")) ? null : reader.GetString("Fecha_de_Publicacion")
                            };
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener manga por ID: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener manga por ID: {ex.Message}");
                throw;
            }
        }
        return manga;
    }

    public void AddManga(Manga manga)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "INSERT INTO Manga_Flor.mangas (nombre, genero, Fecha_de_Publicacion) VALUES (@nombre, @genero, @Fecha_de_Publicacion)";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@nombre", manga.Nombre);
                    command.Parameters.AddWithValue("@genero", (object?)manga.Genero ?? DBNull.Value);
                    // ¡CAMBIO AQUÍ! Pasar el string directamente
                    command.Parameters.AddWithValue("@Fecha_de_Publicacion", (object?)manga.FechaDePublicacion ?? DBNull.Value);

                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al añadir manga: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al añadir manga: {ex.Message}");
                throw;
            }
        }
    }

    public void UpdateManga(int id, Manga updatedManga)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "UPDATE Manga_Flor.mangas SET nombre = @nombre, genero = @genero, Fecha_de_Publicacion = @Fecha_de_Publicacion WHERE id = @id";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@nombre", updatedManga.Nombre);
                    command.Parameters.AddWithValue("@genero", (object?)updatedManga.Genero ?? DBNull.Value);
                    // ¡CAMBIO AQUÍ!
                    command.Parameters.AddWithValue("@Fecha_de_Publicacion", (object?)updatedManga.FechaDePublicacion ?? DBNull.Value);
                    command.Parameters.AddWithValue("@id", id);

                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al actualizar manga: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al actualizar manga: {ex.Message}");
                throw;
            }
        }
    }

    public void DeleteManga(int id)
    {
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "DELETE FROM Manga_Flor.mangas WHERE id = @id";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);

                    command.ExecuteNonQuery();
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al eliminar manga: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al eliminar manga: {ex.Message}");
                throw;
            }
        }
    }

    public IEnumerable<Manga> SearchMangas(MangaFilter filter)
    {
        // Esto sigue filtrando en memoria
        return GetAllMangas().Where(filter.BuildFilter().Compile());
    }
}