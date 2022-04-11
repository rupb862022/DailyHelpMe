using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication.Dto;
using DailyHelpMe;

namespace WebApplication.Controllers
{
    public class ProfileController : ApiController
    {
        [Route("futureTaskToDo")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] string id)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();
                DateTime currentDateTime = DateTime.Now;
                List<RegisterProfile> taskList = new List<RegisterProfile>();
                taskList = db.RegisteredTo.Where(x => x.ID == id).Where(y => y.RegistereStatus == "טרם בוצע").Select(t => t.Task).Select(r => new RegisterProfile
                {

                    TaskNumber = r.TaskNumber,
                    TaskName = r.TaskName,
                    TaskHour = r.TaskHour,
                    TaskPlace = r.City.CityName,
                    TaskDate = r.StartDate,
                    MobilePhone = r.Request.Users.MobilePhone,
                    Past = r.EndDate < currentDateTime,
                    Status = db.RegisteredTo.FirstOrDefault(x=> x.TaskNumber == r.TaskNumber).RegistereStatus

                }).ToList();

                return Ok(taskList);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [Route("changeTaskStatus")]
        [HttpPost]
        public IHttpActionResult ChangeStatus([FromBody] CancelTask taskDet)
        {
            try
            {
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();
                RegisteredTo temp = db.RegisteredTo.Where(x => x.ID == taskDet.ID).Where(x => x.TaskNumber == taskDet.TaskNumber).
                    Where(x => x.RegistereStatus == "טרם בוצע").FirstOrDefault();

                if (temp != null)
                {
                    temp.RegistereStatus = "בוצע";
                    db.SaveChanges();
                    return Ok("Ok");
                }
                return Ok("No");
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

    }
}
