using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication.Dto;
using DailyHelpMe;
using System.Collections;
using System.Web.Http.Cors;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomePageController : ApiController
    {
        // GET: api/HomePage
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/HomePage/test
     
        [HttpPost]
        public IHttpActionResult POST([FromBody] string userId)
        {


            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();
                List<Request> request;
                List<Request> temp = new List<Request>();

                request = db.Request.Where(x => x.RequestStatus == "פעיל").ToList();

                foreach (var item in request)
                {
                    List<Task> tasks = db.Task.Where(x => x.RequestCode == item.RequestCode).ToList();
                    List<Task> tasksss = new List<Task>();

                    foreach (var itemT in tasks)
                    {
                        Task t = new Task()
                        {
                            TaskDescription = itemT.TaskDescription,
                            TaskName = itemT.TaskName,
                            TaskHour = itemT.TaskHour,
                            TaskNumber = itemT.TaskNumber,
                            StartDate = itemT.StartDate,
                            EndDate = itemT.EndDate,
                            NumOfVulRequired = itemT.NumOfVulRequired,
                          
                            Confirmation = itemT.Confirmation
                        };

                        tasksss.Add(t);
                    }

                    Request req = new Request()
                    {
                        ID = item.ID,
                        RequestName = item.RequestName,
                        CityCode = item.CityCode,
                        StreetCode = item.StreetCode,
                        RequestStatus = item.RequestStatus,
                        PrivateRequest = item.PrivateRequest,
                        Link = item.Link,
                        RequestCode = item.RequestCode,
                        Task = tasksss,
                    };

                    temp.Add(req);
                }

                return Ok(temp);
            }
            catch (Exception)
            {

                return NotFound();
            }
        }
        // POST: api/HomePage
        //public void Post([FromBody] string value)
        //{
        //}

        // PUT: api/HomePage/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/HomePage/5
        public void Delete(int id)
        {
        }
    }
}
