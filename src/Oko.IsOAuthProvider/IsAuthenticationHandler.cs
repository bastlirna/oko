using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace Oko.IsOAuthProvider
{
    public class IsAuthenticationHandler : OAuthHandler<IsAuthenticationOptions>
    {
        public IsAuthenticationHandler(HttpClient backchannel) : base(backchannel)
        {
        }

        protected override async Task<AuthenticationTicket> CreateTicketAsync(ClaimsIdentity identity,
            AuthenticationProperties properties, OAuthTokenResponse tokens)
        {
            var j = await LoadJson(tokens, Options.UserInformationEndpoint);
            var payload = JObject.Parse(j);

            identity.AddOptionalClaim(ClaimTypes.NameIdentifier, IsAuthenticationHelper.GetIdentifier(payload), Options.ClaimsIssuer)
                .AddOptionalClaim(ClaimTypes.Name, IsAuthenticationHelper.GetLogin(payload), Options.ClaimsIssuer)
                .AddOptionalClaim(ClaimTypes.Email, IsAuthenticationHelper.GetEmail(payload), Options.ClaimsIssuer)
                .AddOptionalClaim(ClaimTypes.GivenName, IsAuthenticationHelper.GetFullName(payload), Options.ClaimsIssuer);

            var jj = await LoadJson(tokens, Options.UserRolesEndpoint);
            var roles = JArray.Parse(jj);

            foreach (var role in IsAuthenticationHelper.GetRoles(roles))
            {
                identity.AddOptionalClaim("is:role", role, Options.ClaimsIssuer);
            }

            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, properties, Options.AuthenticationScheme);

            var context = new OAuthCreatingTicketContext(ticket, Context, Options, Backchannel, tokens, payload);
            await Options.Events.CreatingTicket(context);
            
            return context.Ticket;
        }

        private async Task<string> LoadJson(OAuthTokenResponse tokens, string endpoint)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokens.AccessToken);

            var response = await Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead,
                Context.RequestAborted);
            if (!response.IsSuccessStatusCode)
            {
                Logger.LogError("An error occurred while retrieving the user profile: the remote server " +
                                "returned a {Status} response with the following payload: {Headers} {Body}.",
                    /* Status: */ response.StatusCode,
                    /* Headers: */ response.Headers.ToString(),
                    /* Body: */ await response.Content.ReadAsStringAsync());

                throw new HttpRequestException("An error occurred while retrieving the user profile.");
            }

            //var payload = JObject.Parse(await response.Content.ReadAsStringAsync());

            return await response.Content.ReadAsStringAsync();
        }
    }
}