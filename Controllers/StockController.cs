using System;
using System.Web;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;

using SqlTasks;

public class StockController : Controller
{
//[HttpGet] <- 얘가 기본 값이라 설정 안해도 된대
	public IActionResult Search(string query)
	{
		SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		var collection = con.Select("like '%" + query + "%'");
		return View(collection);
	}// This action method handles the search functionality for stock items.
}