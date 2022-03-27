using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DailyHelpMe;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    public class RequestController : ApiController
    {
        // GET: api/Request
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Request/5
        public string Get(int id)
        {
            return "value";
        }


        [Route("getRequests")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] string id)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                List<Request> reqList = db.Request.Where(x => x.RequestStatus == "פעיל").Where(y => y.ID != id).ToList();
                List<Task> temp = new List<Task>();

                List<Request> tempReqList = new List<Request>(reqList);

                foreach (var req in reqList)
                {
                    foreach (var task in req.Task)
                    {
                        temp = new List<Task>(req.Task);

                        if (db.RegisteredTo.Count(x => x.TaskNumber == task.TaskNumber) == db.Task.FirstOrDefault(y => y.TaskNumber == task.TaskNumber).NumOfVulRequired)
                        {
                            temp.Remove(task);
                        }
                    }

                    req.Task = temp;

                    if (req.Task == null)
                    {
                        tempReqList.Remove(req);
                    }
                }

                reqList = tempReqList;

                if (reqList == null)
                {
                    return NotFound();
                }

                List<Requests> requestList = new List<Requests>();
      
                foreach (var item in reqList)
                {
                    requestList.Add(new Requests
                    {
                        RequestCode = item.RequestCode,
                        RequestName = item.RequestName,
                        PrivateRequest = item.PrivateRequest,
                        Link = item.Link,
                        ID = item.ID,
                        StreetCode = item.StreetCode,
                        CityCode = item.CityCode,
                        RequestStatus = item.RequestStatus,
                        Tasks = null
                    });

                }

                return Ok(requestList);
                //1: full
                //2: wait
                //3: cancel
                //4: sign
            }
            catch (Exception)
            {

                return NotFound();
            }

        }

        [Route("getRequestsByTypes/{VolunteerCode1}")]
        [HttpPost]
        public IHttpActionResult PostSort([FromBody] string id, int VolunteerCode1)
        {
            DailyHelpMeDbContext db = new DailyHelpMeDbContext();

            List<Request> reqList = db.Request.Where(x => x.RequestStatus == "פעיל").Where(y => y.ID != id).ToList();

    
            

            return Ok(db.Topic.Where(x => x.VolunteerCode == VolunteerCode1).Select(y => y.Task.Request).ToList());
        }

        // POST: api/Request
        [Route("addRequest")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] Request request)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                db.Request.Add(request);

                db.SaveChanges();

                return Ok(request);
            }
            catch (Exception)
            {

                return NotFound();
            }
        }

        [Route("checkIfTaskFull")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] int taskNumber)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();


                if (db.RegisteredTo.Count(x => x.TaskNumber == taskNumber) == db.Task.FirstOrDefault(y => y.TaskNumber == taskNumber).NumOfVulRequired)
                {

                }






                return Ok();

            }
            catch (Exception)
            {

                return NotFound();
            }
        }


        // PUT: api/Request/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Request/5
        public void Delete(int id)
        {
        }
    }
}
