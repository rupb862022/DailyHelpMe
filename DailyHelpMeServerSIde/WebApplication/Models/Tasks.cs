using DailyHelpMe;
using System;
using System.Linq;


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
        public int? RequestCode { get; set; }
        public string Status { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public string CityName { get; set; }

    }
}