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
		var collection = con.SelectByName("like '%" + query + "%' ");
		
		var result = "{";
		int i = 0;
		foreach (var stock in collection)
		{
			result += $"\"{i}\" : ";
			result += stock.ToString();
			if (++i != collection.Count)
				result += ",";
		}
		result += "}";
		return result;
	}// This action method handles the search functionality for stock items.
	
	public string Info(string ticker, string type = "")
	{
		var result = "";
		type = type.ToLower();
		
		switch (type)
		{
			case "bond":
				result = KInvManager.GetBondInfo(ticker).Result;
				break;
				
			case "ef":
			case "st":
			default :
				result = KInvManager.InquiryStockInfo(ticker).Result;
				break;
		}
		return result;
	}
	
	public string Price(string ticker, string type = "")
	{
		var result = "";
		type = type.ToLower();
		
		switch (type)
		{
			case "ef":
				result = KInvManager.InquiryETFPrice(ticker).Result;
				break;
			case "bond":
				result = KInvManager.GetBondPrice(ticker).Result;
				break;
			case "st":
			default :
				result = KInvManager.InquiryStockPrice(ticker).Result;
				break;
		}
		return result;
	}
	
	public string ETFItems(string ticker)
	{
		var result = "";
		result = KInvManager.InquiryETFItem(ticker).Result;
		return result;
	}
	
	public string DailyPrice(string ticker, string type = "")
	{
		var result = "";
		result = KInvManager.InquiryDailyStockPrice(ticker, type).Result;
		return result;
	}
	
	public string FinancialRatio(string ticker)
	{
		var result = KInvManager.FinancialRatio(ticker).Result;
		return result;
	}
	
	public string BalanceSheet(string ticker)
	{
		var result = KInvManager.BalanceSheet(ticker).Result;
		return result;
	}
	
	public string IncomeStatement(string ticker)
	{
		var result = KInvManager.IncomeStatement(ticker).Result;
		return result;
	}
	
	public string Exchange(string item)
	{
		var result = KInvManager.GetExchangeRate(item).Result;
		return result;
	}
	
	public string MarketIndex(string market)
	{
		SqlConnector con = HttpContext.RequestServices.GetService(typeof(SqlConnector)) as SqlConnector;
		var json = KInvManager.GetMarketIndex(market).Result;
		return json;
	}
	
	public string Balance()
	{
	    var json = KInvManager.GetBalance().Result;
        return json;
    }
	
	public string GeneralProductInfo()
	{
		var json = KInvManager.GetGeneralPriceInfo().Result;
		return json;
	}
}