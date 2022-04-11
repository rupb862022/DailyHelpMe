using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Dto
{
    public class TaskDto
    {
        public int TaskNumber { get; set; }
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public System.TimeSpan TaskHour { get; set; }
        public System.DateTime StartDate { get; set; }
        public System.DateTime EndDate { get; set; }
        public Nullable<bool> Confirmation { get; set; }
        public byte NumOfVulRequired { get; set; }
        public Nullable<int> RequestCode { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public Nullable<int> CityCode { get; set; }

        public List<string> TypesList { get; set; }

    }
}