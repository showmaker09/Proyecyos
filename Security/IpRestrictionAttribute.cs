using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace InscripcionApi.Security
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class IpRestrictionAttribute : Attribute, IAsyncActionFilter
    {
        private readonly string[] _allowedIps;
        private readonly ILogger<IpRestrictionAttribute> _logger;

        public IpRestrictionAttribute(IConfiguration configuration, ILogger<IpRestrictionAttribute> logger)
        {
            // Carga las IPs permitidas desde la configuración
            _allowedIps = configuration.GetSection("AllowedIpsForTokenAccess").Get<string[]>() ?? Array.Empty<string>();
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var remoteIp = context.HttpContext.Connection.RemoteIpAddress;
            _logger.LogInformation($"Attempting to access from IP: {remoteIp}");

            if (remoteIp == null)
            {
                _logger.LogWarning("Remote IP address is null.");
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            // Aquí puedes añadir lógica para manejar IPv4 vs IPv6 si es necesario,
            // y para rangos de IP si tus AllowedIps son CIDR.
            // Por simplicidad, se hace una comparación directa.
            var remoteIpString = remoteIp.ToString();

            if (!_allowedIps.Any(ip => IPAddress.Parse(ip).Equals(remoteIp)))
            {
                _logger.LogWarning($"Access denied for IP: {remoteIpString}. Not in allowed list.");
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            await next(); // Continúa con la ejecución de la acción
        }
    }
}