using System;
using System.Web;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;

using SqlTasks;

public class HomeController : Controller
{
    public IActionResult Index()
	{
		//SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		//var collection = con.Select("true");
		return View();
	}
	
	
}