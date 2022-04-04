using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Dto
{
    public class SortRequestBy
    {
        public Location CurrentLocation { set; get; }
        public int VolunteerCode { get; set; }
        public string ID { get; set; }

    }
}