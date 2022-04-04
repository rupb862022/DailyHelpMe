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

        [Route("getRequests")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] string id)
        {
            try
            {
                List<Requests> res = GetRequests(id, "none", null);
                if (res == null)
                {
                    return Ok("NO");
                }
                return Ok(res);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [Route("getRequestsSorted")]
        [HttpPost]
        public IHttpActionResult Post([FromBody] SortRequestBy sortBy)
        {
            try
            {
                string type;
                if (sortBy.VolunteerCode != 0)
                {
                    type = "sortByType";
                }
                else if (sortBy.CurrentLocation.CityName != null)
                {
                    type = "sortByCityName";
                }
                else
                {
                    type = "sortByCoords";
                }
                List<Requests> res = GetRequests(sortBy.ID, type, sortBy);
                if (res == null)
                {
                    return Ok("NO");
                }
                return Ok(res);
            }
            catch (Exception)
            {
                return NotFound();
            }

        }

        public List<Requests> GetRequests(string id, string type, SortRequestBy sortby)
        {
            try
            {
                double maxLng, minLng, maxLat, minLat, km = 10;
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();
                List<Requests> requestList = new List<Requests>();
                List<Tasks> tasksList = new List<Tasks>();
                List<Task> temp = new List<Task>();

                List<Request> reqList = db.Request.Where(x => x.RequestStatus == "פעיל").Where(y => y.ID != id).ToList();

                foreach (Request request in reqList)
                {
                    switch (type)
                    {
                        case "none":
                            temp = db.Task.Where(x => x.RequestCode == request.RequestCode).Where(x => x.NumOfVulRequired != x.RegisteredTo.Count).ToList();
                            break;
                        case "sortByType":
                            temp = db.TaskTypes.Where(x => x.VolunteerCode == sortby.VolunteerCode).Select(x => x.Task).Where(x => x.RequestCode == request.RequestCode)
                                .Where(x => x.NumOfVulRequired != x.RegisteredTo.Count).ToList();
                            break;
                        case "sortByCityName":
                            temp = request.Task.Where(t => t.CityCode == db.City.First(x => x.CityName == sortby.CurrentLocation.CityName).CityCode).ToList();
                            break;
                        case "sortByCoords":
                            temp = request.Task.Where(x => x.NumOfVulRequired != x.RegisteredTo.Count).ToList();

                            maxLat = double.Parse(sortby.CurrentLocation.Lat) + (km / 110.574);
                            maxLng = double.Parse(sortby.CurrentLocation.Lng) + (km / 111.320 * Math.Cos(double.Parse(sortby.CurrentLocation.Lat)));

                            minLat = double.Parse(sortby.CurrentLocation.Lat) - (km / 110.574);
                            minLng = double.Parse(sortby.CurrentLocation.Lng) - (km / 111.320 * Math.Cos(double.Parse(sortby.CurrentLocation.Lat)));

                            temp = temp.Where(x => (double.Parse(x.Lat) > minLat) && (double.Parse(x.Lat) < maxLat) && (double.Parse(x.Lng) > minLng) && (double.Parse(x.Lat) < maxLng)).ToList();
                            break;

                        default:
                            break;
                    }
                    tasksList = temp.Select(x => new Tasks
                    {
                        TaskNumber = x.TaskNumber,
                        TaskName = x.TaskName,
                        TaskHour = x.TaskHour,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        TaskDescription = x.TaskDescription,
                        Confirmation = x.Confirmation,
                        RequestCode = x.RequestCode,
                        Lat = x.Lat,
                        Lng = x.Lng,
                        CityName = db.City.FirstOrDefault(y => y.CityCode == x.CityCode).CityName,
                    }).ToList();

                    foreach (Tasks item in tasksList)
                    {
                        item.Status = StatusSet(item.TaskNumber, id);
                    }

                    if (tasksList.Count != 0)
                    {
                        requestList.Add(new Requests
                        {
                            RequestCode = request.RequestCode,
                            RequestName = request.RequestName,
                            ID = request.ID,
                            RequestStatus = request.RequestStatus,
                            Tasks = tasksList.OrderBy(x => x.StartDate).ToList(),
                            Image = db.Users.FirstOrDefault(x => x.ID == request.ID).Photo,
                            TypesList = db.TaskTypes.Where(y => y.Task.RequestCode == request.RequestCode).Select(x => x.VolunteerType.VolunteerName).Distinct().ToList(),
                            EndDate = db.Task.Where(x => x.RequestCode == request.RequestCode).Max(x => x.EndDate),
                            StartDate = db.Task.Where(x => x.RequestCode == request.RequestCode).Min(x => x.StartDate),
                        });
                    }
                }
                return requestList.OrderBy(x => x.StartDate).ToList();
            }
            catch (Exception)
            {
                return null;
            }
        }


        string StatusSet(int TaskNumber, string VolunteerID)
        {
            DailyHelpMeDbContext db = new DailyHelpMeDbContext();

            if (db.InterestedInRegistered.Where(x => x.TaskNumber == TaskNumber).FirstOrDefault(x => x.ID == VolunteerID) != null)
            {
                return "wait";
            }
            else if (db.RegisteredTo.Where(x => x.TaskNumber == TaskNumber).FirstOrDefault(x => x.ID == VolunteerID) != null)
            {
                return "cancel";
            }
            return "sign";
        }
    }
}
