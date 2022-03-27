using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DailyHelpMe;

namespace WebApplication.Models
{
    public partial class Tasks
    {
     
        public int TaskNumber { get; set; }
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public TimeSpan TaskHour { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? Confirmation { get; set; }
        public byte NumOfVulRequired { get; set; }
        public int RequestCode { get; set; }     
        public virtual List<VolunteerType> VolunteerType { get; set; }
    }
}