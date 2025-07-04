using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace InscripcionApi.Security
{
    public class IpRestrictionAttribute : ActionFilterAttribute
    {
        private readonly ILogger<IpRestrictionAttribute> _logger;
        private readonly List<string> _allowedIps;

        public IpRestrictionAttribute(ILogger<IpRestrictionAttribute> logger, IConfiguration configuration)
        {
            _logger = logger;
            _allowedIps = configuration.GetSection("AllowedIpsForTokenAccess").Get<List<string>>() ?? new List<string>();
            
            if (!_allowedIps.Any())
            {
                _logger.LogWarning("No se configuraron IPs permitidas para la restricción de acceso por IP.");
            }
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var remoteIpAddress = context.HttpContext.Connection.RemoteIpAddress;
            if (remoteIpAddress == null)
            {
                _logger.LogWarning("No se pudo obtener la IP remota para la solicitud.");
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            // Obtener la IP real si se usan proxies (ej. en Somee con ForwardedHeaders)
            var forwardedFor = context.HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            IPAddress? realIp = null;

            if (!string.IsNullOrEmpty(forwardedFor))
            {
                var ips = forwardedFor.Split(',').Select(ip => ip.Trim()).ToList();
                // Tomar la primera IP de la lista, que suele ser la del cliente original
                if (ips.Any() && IPAddress.TryParse(ips[0], out var parsedIp))
                {
                    realIp = parsedIp;
                }
            }

            // Si no se obtuvo de X-Forwarded-For, usar la IP remota directa
            if (realIp == null)
            {
                realIp = remoteIpAddress;
            }
            
            _logger.LogInformation($"Attempting access from IP: {realIp.ToString()}");

            if (!_allowedIps.Any(ip => IsIpAllowed(realIp.ToString(), ip)))
            {
                _logger.LogWarning($"Acceso denegado para la IP: {realIp.ToString()}");
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            base.OnActionExecuting(context);
        }

        private bool IsIpAllowed(string clientIp, string allowedIpRule)
        {
            if (IPAddress.TryParse(allowedIpRule, out var parsedAllowedIp))
            {
                // Es una IP específica (IPv4 o IPv6)
                return clientIp == allowedIpRule;
            }
            else if (allowedIpRule.Contains("/"))
            {
                // Es un rango CIDR (simplificado, puedes usar una librería más robusta si necesitas soporte completo para CIDR)
                // Esto es una implementación básica y puede no cubrir todos los casos de CIDR.
                // Para una solución robusta, considera una librería como `IpNetwork2`.
                try
                {
                    var parts = allowedIpRule.Split('/');
                    var networkIp = IPAddress.Parse(parts[0]);
                    var prefixLength = int.Parse(parts[1]);

                    var clientIpBytes = IPAddress.Parse(clientIp).GetAddressBytes();
                    var networkIpBytes = networkIp.GetAddressBytes();

                    if (clientIpBytes.Length != networkIpBytes.Length) return false; // Mismatched IP version

                    uint mask = ~(uint.MaxValue >> prefixLength);
                    mask = IPAddress.HostToNetworkOrder((int)mask); // Ensure correct byte order

                    for (int i = 0; i < clientIpBytes.Length; i++)
                    {
                        if ((clientIpBytes[i] & networkIpBytes[i]) != networkIpBytes[i])
                        {
                            return false;
                        }
                    }
                    return true;

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al analizar la regla IP CIDR: {rule}", allowedIpRule);
                    return false;
                }
            }
            return false;
        }
    }
}