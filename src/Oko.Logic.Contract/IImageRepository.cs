using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Oko.Logic.Contract.Dto;

namespace Oko.Logic.Contract
{
    public interface IImageRepository
    {
        IEnumerable<ImageInfo> GetImages(string cameraName, DateTime day);

        ImageInfo GetImage(string cameraName, DateTime day, string imageName);

        Stream GetImageStream(string cameraName, DateTime day, string imageName);
    }
}
