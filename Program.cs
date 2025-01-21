using System;

public class Program
{
    static void Main()
    {
        double lado, lado2, lado3;

        Console.WriteLine("Ingrese el primer lado del triángulo:");
        lado = double.Parse(Console.ReadLine());

        Console.WriteLine("Ingrese el segundo lado del triángulo:");
        lado2 = double.Parse(Console.ReadLine());

        Console.WriteLine("Ingrese el tercer lado del triángulo:");
        lado3 = double.Parse(Console.ReadLine());

        Calcular C1 = new Calcular(lado, lado2, lado3);

        Console.WriteLine($"El área del triángulo es: {C1.Area()}");
    }
}

public class Calcular
{
    // Campos para almacenar los lados del triángulo
    public double lado;
    public double lado2;
    public  double lado3;

    // Constructor para inicializar los lados del triángulo
    public Calcular(double lado, double lado2, double lado3)
    {
        this.lado = lado;
        this.lado2 = lado2;
        this.lado3 = lado3;
    }

    // Método para calcular el semiperímetro
    public double SumaVariables()
    {
        return (lado + lado2 + lado3) / 2;
    }

    // Método para calcular el área usando la fórmula de Herón
    public double Area()
    {
        double p = SumaVariables();
        return Math.Sqrt(p * (p - lado) * (p - lado2) * (p - lado3));
    }
}