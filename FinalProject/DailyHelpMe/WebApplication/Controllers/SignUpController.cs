using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using DailyHelpMe;


namespace WebApplication.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SignUpController : ApiController
    {
        // GET: api/SignUp
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/SignUp/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/SignUp
        //public IHttpActionResult Post([FromBody] string password)
        //{
        //    //if (CheckPassWord(password))
        //    //{
        //    //    password = ComputeSha256Hash(password);
        //    //}
        //    //return Ok("not valid");


        //}
        [Route("uploadpicture")]
        public Task<HttpResponseMessage> Post()
        {
            string output = "start---";
            List<string> savedFilePath = new List<string>();
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            //Where to put the picture on server  ...MapPath("~/TargetDir")
            string rootPath = HttpContext.Current.Server.MapPath("~/uploadFiles");
            var provider = new MultipartFileStreamProvider(rootPath);
            var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsCanceled || t.IsFaulted)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }
                    foreach (MultipartFileData item in provider.FileData)
                    {
                        try
                        {
                            output += " ---here";
                            string name = item.Headers.ContentDisposition.FileName.Replace("\"", "");
                            output += " ---here2=" + name;

                            //need the guid because in react native in order to refresh an inamge it has to have a new name
                            string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + CreateDateTimeWithValidChars() + Path.GetExtension(name);
                            //string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + Guid.NewGuid() + Path.GetExtension(name);
                            //string newFileName = name + "" + Guid.NewGuid();
                            output += " ---here3" + newFileName;

                            //delete all files begining with the same name
                            string[] names = Directory.GetFiles(rootPath);
                            foreach (var fileName in names)
                            {
                                if (Path.GetFileNameWithoutExtension(fileName).IndexOf(Path.GetFileNameWithoutExtension(name)) != -1)
                                {
                                    File.Delete(fileName);
                                }
                            }

                            //File.Move(item.LocalFileName, Path.Combine(rootPath, newFileName));
                            File.Copy(item.LocalFileName, Path.Combine(rootPath, newFileName), true);
                            File.Delete(item.LocalFileName);
                            output += " ---here4";

                            Uri baseuri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, string.Empty));
                            output += " ---here5";
                            string fileRelativePath = "~/uploadFiles/" + newFileName;
                            output += " ---here6 imageName=" + fileRelativePath;
                            Uri fileFullPath = new Uri(baseuri, VirtualPathUtility.ToAbsolute(fileRelativePath));
                            output += " ---here7" + fileFullPath.ToString();
                            savedFilePath.Add(fileFullPath.ToString());
                        }
                        catch (Exception ex)
                        {
                            output += " ---excption=" + ex.Message;
                            string message = ex.Message;
                        }
                    }

                    return Request.CreateResponse(HttpStatusCode.Created, "nirchen " + savedFilePath[0] + "!" + provider.FileData.Count + "!" + output);
                });
            return task;
        }

        private string CreateDateTimeWithValidChars()
        {
            return DateTime.Now.ToString().Replace('/', '_').Replace(':', '-').Replace(' ', '_');
        }

        // PUT: api/SignUp/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/SignUp/5
        public void Delete(int id)
        {
        }

        //static string ComputeSha256Hash(string password)
        //{
        //    // Create a SHA256   
        //    using (SHA256 sha256Hash = SHA256.Create())
        //    {
        //        // ComputeHash - returns byte array  
        //        byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

        //        // Convert byte array to a string   
        //        StringBuilder builder = new StringBuilder();
        //        for (int i = 0; i < bytes.Length; i++)
        //        {
        //            builder.Append(bytes[i].ToString("x2"));
        //        }
        //        return builder.ToString();
        //    }
        //}

        static bool CheckPassWord(string id)
        {

            try
            {
                if (AlgorithemToCheckID(id) % 10 == 0)
                {
                    return true;
                }
                else
                    return false;
            }
            catch (FormatException)
            {
                return false;
                //Console.WriteLine("the id contains invalid symbols");
            }
            //catch (Exception ex)
            //{
            //   Console.WriteLine(ex.Message);
            //}

        }

        static int AlgorithemToCheckID(string id)
        {

            int sum = 0, integer;

            for (int i = 0; i < id.Length; i++)
            {
                integer = Convert.ToInt32(id[i]) - 48;
                if (i % 2 == 0)
                    sum += integer * 1;
                else
                {
                    integer *= 2;
                    if (integer >= 10)
                        integer = integer % 10 + integer / 10;

                    sum += integer;
                }
            }
            return sum;
        }
    }
}
