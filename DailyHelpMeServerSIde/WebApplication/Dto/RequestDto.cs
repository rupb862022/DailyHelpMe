using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DailyHelpMe;

namespace WebApplication.Dto
{
    public class RequestDto
    {
        public int RequestCode { get; set; }
        public string RequestName { get; set; }
        public bool? PrivateRequest { get; set; }
        public string Link { get; set; }
        public string ID { get; set; }
        public int? StreetCode { get; set; }
        public int? CityCode { get; set; }
        public string RequestStatus { get; set; }
        
        public List<TaskDto> Task { get; set; }



    }
}