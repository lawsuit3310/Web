using System;
using System.Text;
using System.Web;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SqlTasks;
using HttpRequests.KInv;

public class StockController : Controller
{
//[HttpGet] <- 얘가 기본 값이라 설정 안해도 된대
	public IActionResult Index()
	{
		//SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		//var collection = con.Select("true");
		return View();
	}
	public string Search(string query)
	{
		SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		var collection = new StockCollection(con.SelectByName("like '%" + query + "%' "));
		return collection.ToJson();
	}// This action method handles the search functionality for stock items.
	
	public string Info(string ISIN)
	{
		SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		var stock = con.SelectByISIN(ISIN);
		return "info";
	}
	
	public string MarketIndex(string market)
	{
		SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		var json = KInvManager.GetMarketIndex(market).Result;
		return json;
	}
}