using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DailyHelpMe;

namespace WebApplication.Models
{
    public partial class Requests
    {
        public int RequestCode { get; set; }
        public string RequestName { get; set; }
        public bool? PrivateRequest { get; set; }
        public string Link { get; set; }
        public string ID { get; set; }
        public int? StreetCode { get; set; }
        public int? CityCode { get; set; }
        public string RequestStatus { get; set; }
        public string StreetName { get; set; }

        public List<Tasks> Tasks { get; set; }

         
    }
}