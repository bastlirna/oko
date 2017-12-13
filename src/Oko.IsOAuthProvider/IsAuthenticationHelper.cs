using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Oko.IsOAuthProvider
{
    public static class IsAuthenticationHelper
    {
        /// <summary>
        /// Gets the identifier corresponding to the authenticated user.
        /// </summary>
        public static string GetIdentifier(JObject user) => user.Value<string>("id");

        /// <summary>
        /// Gets the login corresponding to the authenticated user.
        /// </summary>
        public static string GetLogin(JObject user) => user.Value<string>("username");

        /// <summary>
        /// Gets the email address corresponding to the authenticated user.
        /// </summary>
        public static string GetEmail(JObject user) => user.Value<string>("email");

        /// <summary>
        /// Gets the name corresponding to the authenticated user.
        /// </summary>
        public static string GetFullName(JObject user) => user.Value<string>("first_name") + " " + user.Value<string>("surname");


        public static IEnumerable<string> GetRoles(JArray roles)
        {
            return roles.AsJEnumerable().Select(x => x.Value<string>("role"));
        }
    }
}