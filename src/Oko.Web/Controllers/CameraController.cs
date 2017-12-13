using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Oko.Logic.Contract;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Oko.Web.Controllers
{
    [Authorize(Roles = "admin")]
    public class CameraController : Controller
    {
        private readonly ICameraRepository cameraRepository;

        public CameraController(ICameraRepository cameraRepository)
        {
            this.cameraRepository = cameraRepository;
        }

        public IActionResult List()
        {
            var cameras = cameraRepository.GetCameras();

            return View(cameras);
        }
    }
}
