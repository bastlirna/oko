using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Oko.Logic.Contract.Dto;

namespace Oko.Logic.Contract
{
    public interface IImageRepository
    {
        IEnumerable<ImageInfo> GetImages(string cameraName, DateTime day);
    }
}
