using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Oko.Web.Authorization;

namespace Oko.Web.Controllers
{
    [Authorize(Roles = "admin")]
    public class AclController : Controller
    {
        private readonly AclRepository acl;

        public AclController(AclRepository acl)
        {
            this.acl = acl;
        }
        
        public IActionResult Index()
        {
            return View(acl.GetAllUsers());
        }
    }
}
