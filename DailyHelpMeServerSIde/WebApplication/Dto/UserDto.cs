using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DailyHelpMe;

namespace WebApplication.Dto
{
    public class UserDto
    {
        public string ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobilePhone { get; set; }
        public string Passwords { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Photo { get; set; }
        public string Gender { get; set; }
        public string CityName { get; set; }
        public string TokenID { get; set; }
        public List<string> VolunteerTypes { get; set; }

    }
}