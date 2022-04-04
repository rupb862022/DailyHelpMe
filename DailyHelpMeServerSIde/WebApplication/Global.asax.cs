using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Timers;
using DailyHelpMe;
using WebApplication.Services;

namespace WebApplication
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        static Timer timer = new Timer();
        string path = null;

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            //code for timer
            timer.Interval = 60 * 60 * 1000;
            timer.Elapsed += tm_Tick;
            path = Server.MapPath("/");
        }

        //code for timer
        private void tm_Tick(object sender, ElapsedEventArgs e)
        {
            EndTimer();
            TimerServices.CheckIf24Hpassed(path);
        }


        //code for timer
        public static void StartTimer()
        {
            timer.Enabled = true;
        }

        public static void EndTimer()
        {
            timer.Enabled = false;

        }
    }
}


