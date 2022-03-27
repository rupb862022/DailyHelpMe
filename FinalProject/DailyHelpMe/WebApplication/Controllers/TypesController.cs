using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DailyHelpMe;

namespace WebApplication.Controllers
{
    public class TypesController : ApiController
    {
        // GET: api/Types
        public IEnumerable<string> Get()
        {
            DailyHelpMeDbContext db = new DailyHelpMeDbContext();
            return db.VolunteerType.Select(v => v.VolunteerName).ToList();
        }

        // GET: api/Types/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Types
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Types/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Types/5
        public void Delete(int id)
        {
        }
    }
}
