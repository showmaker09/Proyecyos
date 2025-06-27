// Security/IpRestrictionAttribute.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;

namespace MiUtilsApi.Security
{
    public static class IpAddressHelper
    {
        public static bool IsIpAddressAllowed(IPAddress remoteIp, IEnumerable<string> allowedIpStrings)
        {
            if (remoteIp == null) return false;
            if (remoteIp.IsIPv4MappedToIPv6)
            {
                remoteIp = remoteIp.MapToIPv4();
            }

            foreach (var allowedIpString in allowedIpStrings)
            {
                if (string.IsNullOrWhiteSpace(allowedIpString)) continue;

                if (allowedIpString.Contains('/'))
                {
                    var parts = allowedIpString.Split('/');
                    if (IPAddress.TryParse(parts[0], out var networkAddress) && int.TryParse(parts[1], out var prefixLength))
                    {
                        var ipBytes = remoteIp.GetAddressBytes();
                        var networkBytes = networkAddress.GetAddressBytes();

                        if (ipBytes.Length != networkBytes.Length) continue;

                        var maskBytes = new byte[ipBytes.Length];
                        for (int i = 0; i < prefixLength / 8; i++) maskBytes[i] = 0xFF;
                        if (prefixLength % 8 != 0) maskBytes[prefixLength / 8] = (byte)(0xFF << (8 - (prefixLength % 8)));

                        bool isMatch = true;
                        for (int i = 0; i < ipBytes.Length; i++)
                        {
                            if ((ipBytes[i] & maskBytes[i]) != (networkBytes[i] & maskBytes[i]))
                            {
                                isMatch = false;
                                break;
                            }
                        }
                        if (isMatch) return true;
                    }
                }
                else
                {
                    if (IPAddress.TryParse(allowedIpString, out var allowedIp) && allowedIp.Equals(remoteIp))
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    public class IpRestrictionAttribute : ActionFilterAttribute
    {
        private readonly List<string> _allowedIps;
        private readonly ILogger<IpRestrictionAttribute> _logger;

        public IpRestrictionAttribute(ILogger<IpRestrictionAttribute> logger, IConfiguration configuration)
        {
            _logger = logger;
            _allowedIps = configuration.GetSection("AllowedIpsForTokenAccess").Get<List<string>>() ?? new List<string>();

            if (!_allowedIps.Any())
            {
                _logger.LogWarning("IpRestrictionAttribute: No IPs configured in 'AllowedIpsForTokenAccess' section. IP restriction for token access will not work as expected.");
            }
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var hasAuthorizeAttribute = context.ActionDescriptor.EndpointMetadata.OfType<AuthorizeAttribute>().Any();

            if (hasAuthorizeAttribute)
            {
                var remoteIp = context.HttpContext.Connection.RemoteIpAddress;
                _logger.LogInformation($"IpRestrictionAttribute: Incoming IP for authorized endpoint: {remoteIp} for {context.HttpContext.Request.Path}");

                if (remoteIp == null || !IpAddressHelper.IsIpAddressAllowed(remoteIp, _allowedIps))
                {
                    _logger.LogWarning($"IpRestrictionAttribute: Access denied for unauthorized IP: {remoteIp} trying to use a token.");
                    context.Result = new ForbidResult();
                    return;
                }
            }
            base.OnActionExecuting(context);
        }
    }
}