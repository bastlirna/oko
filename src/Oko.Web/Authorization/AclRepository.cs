using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Oko.Web.Authorization
{
    public class AclRepository
    {
        private readonly string path;

        private Dictionary<string, AclItem> users;

        public AclRepository(string path)
        {
            this.path = path;

            var json = File.ReadAllText(path);

            users = JsonConvert.DeserializeObject<Dictionary<string, AclItem>>(json);

            foreach (var user in users)
            {
                user.Value.Username = user.Key;
            }
        }

        public IEnumerable<AclItem> GetAllUsers()
        {
            return users.Values.OrderBy(x => x.Username);
        }

        public IEnumerable<string> GetRoles(string name)
        {
            if (!users.ContainsKey(name))
            {
                return Enumerable.Empty<string>();
            }

            return users[name].Roles;
        }

        public IEnumerable<string> GetZones(string name)
        {
            if (!users.ContainsKey(name))
            {
                return Enumerable.Empty<string>();
            }

            return users[name].Zones;
        }
    }

    public class AclItem
    {
        public string Username { get; set; }
        public IList<string> Roles { get; set; }
        public IList<string> Zones { get; set; }
    }

    
}
