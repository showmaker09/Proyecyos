using System.Collections.Generic;

namespace MiMangaBot.Domain.Pagination;



public class PaginationParams
{
    private const int MaxPageSize = 50; // Máximo de registros permitidos por página
    public int PageNumber { get; set; } = 1; // Número de página actual, por defecto 1

    private int _pageSize = 10; // Tamaño de página por defecto
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; // No permite un tamaño de página mayor al máximo
    }
}


public class PagedResponse<T> where T : class
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalRecords { get; set; }
    public IEnumerable<T>? Data { get; set; } // Los elementos de la página

    // Propiedades adicionales para facilitar la navegación
    public int? NextPage
    {
        get => PageNumber < TotalPages ? PageNumber + 1 : (int?)null;
    }

    public int? PreviousPage
    {
        get => PageNumber > 1 ? PageNumber - 1 : (int?)null;
    }

    public PagedResponse(IEnumerable<T>? data, int pageNumber, int pageSize, int totalRecords)
    {
        Data = data;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalRecords = totalRecords;
        TotalPages = (int)Math.Ceiling(totalRecords / (double)pageSize); // Calcula el total de páginas
    }
}