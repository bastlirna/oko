using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Oko.Logic.Contract;
using Oko.Logic.Contract.Dto;
using Oko.Logic.Core.Helpers;

namespace Oko.Logic.Core
{
    public class FileCameraRepository : ICameraRepository
    {
        private readonly string path;

        private IList<CameraDefinition> cameras;

        public FileCameraRepository(string path)
        {
            this.path = path;
            Load();
        }

        private void Load()
        {
            var json = File.ReadAllText(path);
            cameras = JsonConvert.DeserializeObject<IList<CameraDefinition>>(json);
        }
        

        public IEnumerable<CameraDefinition> GetCameras()
        {
            return cameras;
        }

        public IEnumerable<CameraDefinition> GetCamerasByZone(params string[] zones)
        {
            return GetCameras().Where(x => ZoneHelper.Test(x.Zone, zones));
        }
    }
}
