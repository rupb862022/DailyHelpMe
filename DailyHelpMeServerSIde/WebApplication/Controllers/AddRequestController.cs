using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DailyHelpMe;
using WebApplication.Models;
using WebApplication.Controllers;
using WebApplication.Dto;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;

namespace WebApplication.Controllers
{
    public class AddRequestController : ApiController
    {

        [Route("addCity")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] string cityName)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                if (db.City.FirstOrDefault(x => x.CityName == cityName) == null)
                {
                    db.City.Add(new City { CityName = cityName });
                    db.SaveChanges();
                }

                return Ok(db.City.FirstOrDefault(x => x.CityName == cityName).CityCode);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }


        [Route("addRequest")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] RequestDto request)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                Request req = new Request()
                {
                    RequestName = request.RequestName,
                    ID = request.ID,
                    RequestStatus = request.RequestStatus,
                    PrivateRequest = request.PrivateRequest,
                };

                db.Request.Add(req);
                db.SaveChanges();

                foreach (var x in request.Task)
                {
                    Task t = new Task
                    {
                        TaskName = x.TaskName,
                        TaskDescription = x.TaskDescription,
                        NumOfVulRequired = x.NumOfVulRequired,
                        Confirmation = x.Confirmation,
                        CityCode = x.CityCode,
                        Lat = x.Lat,
                        Lng = x.Lng,
                        TaskHour = x.TaskHour,
                        EndDate = x.EndDate,
                        StartDate = x.StartDate,
                        RequestCode = req.RequestCode,
                    };

                    db.Task.Add(t);
                    db.SaveChanges();

                    foreach (var typeName in x.TypesList)
                    {
                        db.TaskTypes.Add(new TaskTypes
                        {
                            TaskNumber = t.TaskNumber,
                            VolunteerCode = db.VolunteerType.FirstOrDefault(y => y.VolunteerName == typeName).VolunteerCode
                        });
                        
                    }
                }
                db.SaveChanges();
                return Ok("OK");

            }
            catch (Exception e)
            {
                return Content(HttpStatusCode.BadRequest, e.GetType());
            }
        }


    }
}
