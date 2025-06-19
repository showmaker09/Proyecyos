using System;
using System.Linq.Expressions;

namespace MiMangaBot.Domain.Filters;

public class MangaFilter
{
    public string? Nombre { get; set; }
    public string? Genero { get; set; }
    // ¡CAMBIO AQUÍ! Ahora es un string
    public string? FechaDePublicacion { get; set; }

    public Expression<Func<Manga, bool>> BuildFilter()
    {
        Expression<Func<Manga, bool>> predicate = manga => true;

        if (!string.IsNullOrEmpty(Nombre))
        {
            predicate = predicate.And(m => m.Nombre != null && m.Nombre.Contains(Nombre, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(Genero))
        {
            predicate = predicate.And(m => m.Genero != null && m.Genero.Contains(Genero, StringComparison.OrdinalIgnoreCase));
        }

        // ¡CAMBIO AQUÍ! Ahora filtra por contenido de cadena, no por fecha
        if (!string.IsNullOrEmpty(FechaDePublicacion))
        {
            predicate = predicate.And(m => m.FechaDePublicacion != null && m.FechaDePublicacion.Contains(FechaDePublicacion, StringComparison.OrdinalIgnoreCase));
        }

        return predicate;
    }
}

// PredicateBuilder permanece igual
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> a, Expression<Func<T, bool>> b)
    {
        ParameterExpression p = a.Parameters[0];
        SubstituteParameterVisitor visitor = new SubstituteParameterVisitor { NewParameter = p, OldParameter = b.Parameters[0] };
        Expression body = Expression.AndAlso(a.Body, visitor.Visit(b.Body));
        return Expression.Lambda<Func<T, bool>>(body, p);
    }

    private class SubstituteParameterVisitor : ExpressionVisitor
    {
        public ParameterExpression NewParameter { get; set; } = null!;
        public ParameterExpression OldParameter { get; set; } = null!;

        protected override Expression VisitParameter(ParameterExpression node)
        {
            return node == OldParameter ? NewParameter : base.VisitParameter(node);
        }
    }
}