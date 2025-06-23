using MiMangaBot.Domain;
using MiMangaBot.Domain.Filters;
using MiMangaBot.Domain.Pagination; // ¡Nuevo using!
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq; // Necesario para .ToList()

namespace MiMangaBot.Infrastructure;

public class MangaRepository
{
    private readonly string _connectionString;

    public MangaRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    // --- ¡NUEVO! Método para obtener mangas paginados ---
    public PagedResponse<Manga> GetPagedMangas(PaginationParams paginationParams)
    {
        var mangas = new List<Manga>();
        int totalRecords = GetTotalMangaCount(); // Obtiene el conteo total primero
       using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                // Consulta para paginación: OFFSET (saltar) y LIMIT (tomar)
                string query = "SELECT id, nombre, genero, Fecha_de_Publicacion FROM Manga_Flor.mangas LIMIT @pageSize OFFSET @offset";

                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@pageSize", paginationParams.PageSize);
                    command.Parameters.AddWithValue("@offset", (paginationParams.PageNumber - 1) * paginationParams.PageSize);

                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            mangas.Add(new Manga
                            {
                                Id = reader.GetInt32("id"),
                                Nombre = reader.GetString("nombre"),
                                Genero = reader.IsDBNull(reader.GetOrdinal("genero")) ? null : reader.GetString("genero"),
                                FechaDePublicacion = reader.IsDBNull(reader.GetOrdinal("Fecha_de_Publicacion")) ? null : reader.GetString("Fecha_de_Publicacion")
                            });
                        }
                    }
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener mangas paginados: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener mangas paginados: {ex.Message}");
                throw;
            }
        }
        // Devuelve la respuesta paginada
        return new PagedResponse<Manga>(mangas, paginationParams.PageNumber, paginationParams.PageSize, totalRecords);
    }

    // --- ¡NUEVO! Método helper para contar el total de mangas ---
    private int GetTotalMangaCount()
    {
        int count = 0;
        using (MySqlConnection connection = new MySqlConnection(_connectionString))
        {
            try
            {
                connection.Open();
                string query = "SELECT COUNT(*) FROM Manga_Flor.mangas";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    count = Convert.ToInt32(command.ExecuteScalar());
                }
            }
            catch (MySqlException ex)
            {
                Console.WriteLine($"Error de MySQL al obtener el conteo de mangas: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al obtener el conteo de mangas: {ex.Message}");
                throw;
            }
        }
        return count;
    }

   // --- Tu código existente para GetAllMangas, GetMangaById, AddManga, UpdateManga, DeleteManga, SearchMangas debe seguir aquí ---
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
        // Este método sigue filtrando en memoria por simplicidad.
        // Para una gran cantidad de datos, se debería implementar la lógica de filtro directamente en la consulta SQL.
        return GetAllMangas().Where(filter.BuildFilter().Compile());
    }
}