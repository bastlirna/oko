using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Oko.Logic.Contract;

namespace Oko.Web.Controllers
{
    public class ImageController : Controller
    {
        private readonly IImageRepository imageRepository;

        public ImageController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }
        
        public IActionResult GetImages(string cam, DateTime day)
        {
            var images = imageRepository.GetImages(cam, day);

            return new ObjectResult(images);
        }

        public IActionResult GetMultipleImages(string[] cams)
        {

            return null;
        }
    }
}
