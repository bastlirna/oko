using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Oko.Logic.Contract;
using Oko.Logic.Contract.Dto;

namespace Oko.Logic.Core
{
    public class FileImageRepository : IImageRepository
    {
        private readonly string storagePath;

        public FileImageRepository(string storagePath)
        {
            if (string.IsNullOrEmpty(storagePath))
            {
                throw new ArgumentException("not empty", nameof(storagePath));
            }

            this.storagePath = storagePath;
        }

        public IEnumerable<ImageInfo> GetImages(string cameraName, DateTime day)
        {
            var dir = GetDayDir(cameraName, day);

            if (dir == null)
            {
                yield break;
            }

            var images = dir.EnumerateFiles("*.jpg");

            foreach (var image in images)
            {
                var i = new ImageInfo
                {
                    FullName = image.Name
                };

                yield return i;
            }
        }

        private DirectoryInfo GetDayDir(string cameraName, DateTime day)
        {
            // TODO check camera name

            var path = Path.Combine(storagePath, cameraName, day.Year.ToString("D2"), day.Month.ToString("D2"), day.Day.ToString("D2"));

            if (!Directory.Exists(path))
            {
                return null;
            }

            return new DirectoryInfo(path);
        }
    }
}
