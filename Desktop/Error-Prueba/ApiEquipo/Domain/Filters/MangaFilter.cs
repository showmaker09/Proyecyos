namespace MiMangaBot.Domain.Filters;

using System;
using System.Linq.Expressions;


// Helper para construir predicados de LINQ dinámicamente
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

public class MangaFilter
{
    public string? Nombre { get; set; }
    public string? Genero { get; set; }
    public string? FechaDePublicacion { get; set; }

    public Expression<Func<Manga, bool>> BuildFilter()
    {
        Expression<Func<Manga, bool>> predicate = manga => true; // Predicado inicial que siempre es verdadero

        if (!string.IsNullOrEmpty(Nombre))
        {
            predicate = predicate.And(m => m.Nombre != null && m.Nombre.Contains(Nombre, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(Genero))
        {
            predicate = predicate.And(m => m.Genero != null && m.Genero.Contains(Genero, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(FechaDePublicacion))
        {
            predicate = predicate.And(m => m.FechaDePublicacion != null && m.FechaDePublicacion.Contains(FechaDePublicacion, StringComparison.OrdinalIgnoreCase));
        }

        return predicate;
    }
}
