using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Oko.Logic.Core.Helpers
{
    public static class ZoneHelper
    {
        public static bool Test(string zone, params string[] availableZoneMasks)
        {
            foreach (var mask in availableZoneMasks)
            {
                if (TestMask(zone, mask))
                {
                    return true;
                }
            }

            return false;
        }

        public static bool TestMask(string zone, string mask)
        {
            if (mask == "*")
            {
                return true;
            }

            if (mask.EndsWith(".*", StringComparison.Ordinal))
            {
                return zone.StartsWith(mask.Substring(0, mask.Length - 2), StringComparison.OrdinalIgnoreCase);
            }

            return String.Equals(zone, mask, StringComparison.OrdinalIgnoreCase);
        }
    }
}
