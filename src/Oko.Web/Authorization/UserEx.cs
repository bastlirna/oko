using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Oko.Web.Authorization
{
    public static class UserEx
    {
        public static IEnumerable<string> GetZones(this ClaimsPrincipal user)
        {
            return user.FindAll("oko:zone").Select(x => x.Value).OrderBy(x => x.Length);
        }
    }
}
