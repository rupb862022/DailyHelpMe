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
        public IHttpActionResult Post([FromBody] Request request)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                db.Request.Add(request);

                db.SaveChanges();

                return Ok("OK");

            }       
            catch (Exception e)
            {
                return Content(HttpStatusCode.BadRequest, e.GetType());
            }
        }


        [Route("signToTaskConfirm")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] InterestedInRegistered regi)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                db.InterestedInRegistered.Add(regi);

                db.SaveChanges();

                return Ok(regi);
            }
            catch (Exception e)
            {
                return Content(HttpStatusCode.BadRequest, e.GetType());
            }
        }

        [Route("signToTask")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] RegisteredTo regi)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                db.RegisteredTo.Add(regi);

                db.SaveChanges();

                return Ok(regi);
            }   
            catch (Exception e)
            {
                return Content(HttpStatusCode.BadRequest, e.GetType());
            }
        }



        [Route("cancelTask")]
        [HttpDelete]
        public IHttpActionResult Delete([FromBody] CancelTask taskCancel)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                InterestedInRegistered taskToCancel = db.InterestedInRegistered.Where(x => x.ID == taskCancel.ID).FirstOrDefault(x => x.TaskNumber == taskCancel.TaskNumber);

                if (taskToCancel != null)
                {
                    db.InterestedInRegistered.Remove(taskToCancel);
                    db.SaveChanges();
                    return Ok("OK");
                } 
                
                RegisteredTo taskToCancell = db.RegisteredTo.Where(x => x.ID == taskCancel.ID).FirstOrDefault(x => x.TaskNumber == taskCancel.TaskNumber);

                if (taskToCancell != null)
                {
                    db.RegisteredTo.Remove(taskToCancell);
                    db.SaveChanges();
                    return Ok("OK");
                }

                return Ok("NO");
            }
            catch (Exception e)
            {
                return Content(HttpStatusCode.BadRequest, e.GetType());
            }
        }
    }
}
