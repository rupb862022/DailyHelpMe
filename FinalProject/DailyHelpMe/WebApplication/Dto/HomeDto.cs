using DailyHelpMe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Dto
{
    public class HomeDto
    {

        public string RequestName { get; set; }     
        public int RequestCode { get; set; }

       
        //public string RequestStatus { get; set; }

        public bool? PrivatRequest { get; set; }
        public List<string> VolunteerName { get; set; }
        public string CityName { get; set; }

        public string TaskName { get; set; }
        public int TaskNumber { get; set; }
        public string TaskDescription { get; set; }
        public TimeSpan TaskHour { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? Confirmation { get; set; }
        public byte NumOfVulRequired { get; set; }

        public string ID { get; set; }
        public string Photo { get; set; }
    }
}