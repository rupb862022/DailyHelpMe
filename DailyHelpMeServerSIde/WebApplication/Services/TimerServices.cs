using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication.Controllers;
using WebApplication.Dto;
using DailyHelpMe;
using System.Data.Entity;

namespace WebApplication.Services
{
    public static class TimerServices
    {
        public static void CheckIf24Hpassed(string path)
        {
            try
            {
                
                DateTime currentDateTime = DateTime.Now;
                DailyHelpMeDbContext db = new DailyHelpMeDbContext();

                PushNotificationsController push = new PushNotificationsController();

                List<InterestedInRegistered> regi = db.InterestedInRegistered.Where(x => DbFunctions.AddDays(x.SignToTaskTime, 1) <= currentDateTime).ToList();

                foreach (InterestedInRegistered item in regi)
                {
                    push.PushNoti(new PushNoteData
                    {
                        to = db.Users.FirstOrDefault(x => x.ID == item.ID).TokenID,
                        title = "בקשת ההתנדבות לא אושרה",
                        body = $"מעלה הבקשה לא אישר את שיבוצך ב24 שעות האחרונות ולכן ניסיון שיבוצך לבקשה {item.Task.TaskName} מתבטלת"
                    });

                    push.PushNoti(new PushNoteData
                    {
                        to = db.Users.FirstOrDefault(x => x.ID == item.Task.Request.ID).TokenID,
                        title = "בקשת ההתנדבות לא אושרה",
                        body = $" ניסיון השיבוץ של {item.Users.FirstName} לבקשתך {item.Task.TaskName} בוטל עקב אי אישורה ",
                      
                    }) ;

                    db.InterestedInRegistered.Remove(item);
                }

                db.SaveChanges();

            }
            catch (Exception)
            {
                return;
            }

        }
    }
}