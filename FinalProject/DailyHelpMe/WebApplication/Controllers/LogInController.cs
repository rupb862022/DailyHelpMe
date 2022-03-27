using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DailyHelpMe;
using WebApplication.Dto;

namespace WebApplication.Controllers
{
    [EnableCors("*","*","*")]
    public class LogInController : ApiController
    {
        // GET: api/Register
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Register/5
        public string Get(int id)
        {
            return "value "+ id;
        }

        // POST: api/Register
        [HttpPost]
        public IHttpActionResult Post([FromBody] UserForReg CheckUser)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                Users user = db.Users.SingleOrDefault(x => x.Email == CheckUser.Email);
                if (user == null || user.Passwords != CheckUser.Passwords)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(user.ID);
                }                   
                              
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }         

        }

        // PUT: api/Register/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Register/5
        public void Delete(int id)
        {
        }
    }
}
