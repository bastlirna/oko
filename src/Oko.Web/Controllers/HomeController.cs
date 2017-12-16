using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Oko.Logic.Contract;
using Oko.Logic.Contract.Dto;
using Oko.Web.Authorization;

namespace Oko.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ICameraRepository cameraRepository;

        private readonly IImageRepository imageRepository;

        public HomeController(ICameraRepository cameraRepository, IImageRepository imageRepository)
        {
            this.cameraRepository = cameraRepository;
            this.imageRepository = imageRepository;
        }

        public IActionResult Index()
        {
            var zones = User.GetZones().ToArray();
            var cameras = cameraRepository.GetCamerasByZone(zones);

            return View(cameras);
        }

        [HttpGet]
        public IActionResult Images(string cameraName, DateTime day)
        {
            if(cameraName == null || day == null)
            {
                return BadRequest();
            }

            return Json(imageRepository.GetImages(cameraName, day));
        }

        [HttpGet]
        public IActionResult Image(string cameraName, DateTime day, string imageName)
        {
            if (cameraName == null || day == null || imageName == null)
            {
                return BadRequest();
            }

            Stream stream = imageRepository.GetImageStream(cameraName, day, imageName);

            if (stream == null)
            {
                return NotFound();
            }
            
            return File(stream, "application/jpeg");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
