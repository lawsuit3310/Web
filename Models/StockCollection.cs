using System.Collections.Generic;
using System.Linq;
public class StockCollection
{
	//json 검사 하다 막히면 https://jsonlint.com/
	List<Stock> collection = null;
	public StockCollection (List<Stock> col)
	{
		collection = col;
	}
	public string ToJson()
	{
		string result = "{";
		int index = 0;
		foreach (Stock stock in collection)
		{
			result += $"\"{index}\":{{";
			result += $" \"ISIN\":\"{stock.ISIN}\",";
			result += $" \"Ticker\":\"{stock.Ticker}\",";
			result += $" \"KR_Name\":\"{stock.KR_Name}\",";
			result += $" \"Short_Name\":\"{stock.Short_Name}\",";
			result += $" \"EN_Name\":\"{stock.EN_Name}\",";
			result += $" \"Listing_Date\":\"{stock.Listing_Date}\",";
			result += $" \"Market\":\"{stock.Market}\",";
			result += $" \"Privacy\":\"{stock.Privacy}\",";
			result += $" \"Section\":\"{stock.Section}\",";
			result += $" \"Kind\":\"{stock.Kind}\", ";
			result += $" \"Issued_Share\":\"{stock.Issued_Share}\",";
			result += $" \"Industry\":\"{stock.Industry}\",";
			result += $" \"stck_prpr\":\"{stock.stck_prpr}\",";
			result += $" \"prdy_vrss\":\"{stock.prdy_vrss}\",";
			result += $" \"w52_hgpr\":\"{stock.w52_hgpr}\",";
			result += $" \"w52_lwpr\":\"{stock.w52_lwpr}\"}}";
			index += 1;
			if (index < collection.Count)
				result += ",";
		}
		result += "}";
		return result;
	}
}
