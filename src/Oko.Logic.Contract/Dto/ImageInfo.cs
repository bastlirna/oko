using System;
using System.Globalization;
using System.IO;

namespace Oko.Logic.Contract.Dto
{
    public class ImageInfo
    {
        private DateTime? _time = null;

        public string FullName { get; set; }
        
        public const string FilenameFormat = "yyyyMMdd_HHmmss";

        public DateTime Time {
            get
            {
                if(_time == null)
                {
                    CultureInfo provider = CultureInfo.InvariantCulture;
                    _time = DateTime.ParseExact(FullName.Substring(0, FilenameFormat.Length), FilenameFormat, provider);
                }

                return _time.Value;
            }
        }
    }
}