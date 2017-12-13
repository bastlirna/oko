using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using Oko.IsOAuthProvider;

namespace Oko.Web.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
        
        [HttpGet]
        public async Task<IActionResult> OAuth()
        {
            await HttpContext.Authentication.ChallengeAsync(IsAuthenticationDefaults.AuthenticationScheme, new AuthenticationProperties()
            {
                RedirectUri = "/"
            });

            // TODO opravit
            return Content("Unauthorized");
        }
        
        [HttpGet]
        public IActionResult Logout()
        {
            throw new NotImplementedException();
        }

        [Authorize]
        [HttpGet]
        public IActionResult UserInfo()
        {
            return View();
        }
    }
}
