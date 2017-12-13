using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Oko.IsOAuthProvider
{
    public class FakeIsAuthenticationOptions : AuthenticationOptions
    {
        public FakeIsAuthenticationOptions()
        {
            AuthenticationScheme = "Automatic";
            ClaimsIssuer = IsAuthenticationDefaults.Issuer;
        }
    }

    public class FakeIsAuthenticationMiddleware : AuthenticationMiddleware<FakeIsAuthenticationOptions>
    {
        protected override AuthenticationHandler<FakeIsAuthenticationOptions> CreateHandler()
        {
            return new FakeIsAuthenticationHandler();
        }

        public FakeIsAuthenticationMiddleware(RequestDelegate next, IOptions<FakeIsAuthenticationOptions> options, ILoggerFactory loggerFactory, UrlEncoder encoder) : base(next, options, loggerFactory, encoder)
        {
        }
    }

    public class FakeIsAuthenticationHandler : AuthenticationHandler<FakeIsAuthenticationOptions>
    {
        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            AuthenticateResult result = null;
            
            bool isValid = true;
            if (isValid)
            {
                //assigning fake identity, just for illustration
                ClaimsIdentity claimsIdentity = new ClaimsIdentity("Custom");

                var claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.Name, "admin"));
                claims.Add(new Claim(ClaimTypes.GivenName, "God"));
                claims.Add(new Claim(ClaimTypes.Email, "god@heven.test"));
                claims.Add(new Claim(ClaimTypes.NameIdentifier, "admin"));
                claims.Add(new Claim(ClaimTypes.Role, "admin"));
                claims.Add(new Claim("oko:zone", "*"));

                claimsIdentity.AddClaims(claims);

                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

                result =
                    AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal,
                        new AuthenticationProperties(), Options.AuthenticationScheme));
            }
            else
            {
                result = AuthenticateResult.Skip();
            }

            return result;
        }
    }

}
