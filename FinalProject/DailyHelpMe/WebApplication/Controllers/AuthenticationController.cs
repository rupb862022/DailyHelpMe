using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DailyHelpMe;
using WebApplication.Dto;

namespace WebApplication.Controllers
{
    public class AuthenticationController : ApiController
    {
        // GET: api/Authentication
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Authentication/5
        public string Get(int id)
        {
            return "value";
        }


        [Route("addUser")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] UserDto user)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                Users u = new Users
                {
                    ID = user.ID,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    MobilePhone = user.MobilePhone,
                    Passwords = user.Passwords,
                    Email = user.Email,
                    DateOfBirth = user.DateOfBirth,
                    Photo = user.Photo,
                    InterestedInMailing = user.InterestedInMailing,
                    UStatus = user.UStatus,
                    Gender = user.Gender,
                    TotalRate = user.TotalRate,
                    StreetCode = user.StreetCode,
                    CityCode = user.CityCode,
                    UserDescription = user.UserDescription,                      
                };

                db.Users.Add(u);

                db.SaveChanges();

                foreach (var item in user.VolunteerTypes)
                {
                    db.InterestedIn.Add(new InterestedIn
                    {
                        ID = user.ID,
                        VolunteerCode = item.VolunteerCode,
                        dummy = false,
                                           
                    });
                }

                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {

                return Content(HttpStatusCode.NotFound, ex.Message);
            }


        }


        [Route("checkEmail")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] string Email)
        {
            DailyHelpMeDbContext db = new DailyHelpMeDbContext();
            Users u = db.Users.SingleOrDefault(x => x.Email == Email);

            

            if (u == null)
            {
                return Ok("email is valid");
            }
            return Ok("email exists");
        }

        [Route("checkID")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] int id)
        {
            DailyHelpMeDbContext db = new DailyHelpMeDbContext();
            Users uId = db.Users.SingleOrDefault(x => x.ID == id.ToString());
            if (uId == null)
            {
                if (AlgorithemToCheckID(id.ToString()) % 10 == 0)
                {
                    return Ok("ID is valid");
                }
                else
                {
                    return Ok("ID is invalid");
                }
            }
            return Ok("ID is already in the system");

        }

        static int AlgorithemToCheckID(string id)
        {
            int sum = 0, integer;

            for (int i = 0; i < id.Length; i++)
            {
                integer = Convert.ToInt32(id[i]) - 48;
                if (i % 2 == 0)
                    sum += integer * 1;
                else
                {
                    integer *= 2;
                    if (integer >= 10)
                        integer = integer % 10 + integer / 10;

                    sum += integer;
                }
            }
            return sum;
        }

        // POST: api/Authentication
        //public void Post([FromBody]string value)
        //{
        //}

        // PUT: api/Authentication/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Authentication/5
        public void Delete(int id)
        {
        }
    }
}
