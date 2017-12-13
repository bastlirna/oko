using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Oko.IsOAuthProvider
{
    public class IsAuthenticationOptions : OAuthOptions
    {
        public IsAuthenticationOptions()
        {
            AuthenticationScheme = IsAuthenticationDefaults.AuthenticationScheme;
            DisplayName = IsAuthenticationDefaults.DisplayName;
            ClaimsIssuer = IsAuthenticationDefaults.Issuer;

            CallbackPath = new PathString(IsAuthenticationDefaults.CallbackPath);

            AuthorizationEndpoint = IsAuthenticationDefaults.AuthorizationEndPoint;
            TokenEndpoint = IsAuthenticationDefaults.TokenEndpoint;
            UserInformationEndpoint = IsAuthenticationDefaults.UserInformationEndpoint;
        }

        public string UserRolesEndpoint { get; set; } = IsAuthenticationDefaults.UserRolesEndpoint;
    }
}