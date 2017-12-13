using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Oko.Logic.Contract;
using Oko.Web.Authorization;

namespace Oko.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ICameraRepository cameraRepository;

        public HomeController(ICameraRepository cameraRepository)
        {
            this.cameraRepository = cameraRepository;
        }

        public IActionResult Index()
        {
            var zones = User.GetZones().ToArray();
            var cameras = cameraRepository.GetCamerasByZone(zones);

            return View(cameras);
        }
        
        
        public IActionResult Error()
        {
            return View();
        }
    }
}
