using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;

namespace Oko.IsOAuthProvider
{
    public static class IsAuthenticationExtensions
    {
        public static IApplicationBuilder UseIsAuthentication(this IApplicationBuilder app, IsAuthenticationOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            return app.UseMiddleware<IsAuthenticationMiddleware>(Options.Create(options));
        }

        public static IApplicationBuilder UseFakeIsAuthentication(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            var options = new FakeIsAuthenticationOptions();

            return app.UseMiddleware<FakeIsAuthenticationMiddleware>(Options.Create(options));
        }
    }
}
