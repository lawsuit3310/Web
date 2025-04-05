public class Stock
{
	public string ISIN {get;}
	public string Ticker {get;}
	public string KR_Name {get;}
	public string Short_Name {get;}
	public string EN_Name {get;}
	public string Listing_Date {get;}
	public string Market {get;}
	public string Privacy {get;}
	public string Section {get;}
	public string Kind {get;}
	public int Issued_Share {get;}
	public string Industry {get;}
	
	//현재가
	public int stck_prpr = 0;
	//전일 대비
	public int prdy_vrss = 0;
	//1년(52주 중) 최고가
	public int w52_hgpr = 0;
	//1년(52주 중) 최저가
	public int w52_lwpr = 0;
	
	
	public Stock(string i, string t, string k, string s, string e, string l, string m, string p, string sec, string ki, int sh, string ind)
	{
		ISIN = i;
		int len = t.Length;
		if (m == "KOSPI" || m == "KOSDAQ" || m == "KOSDAQ GLO" || m == "")	
		for (int f = 0; f <  6 - len; f++)
		{
			Console.WriteLine(t);
            t = t.Insert(0, "0");
		}
		Ticker = t;
		KR_Name = k;
		Short_Name = s;
		EN_Name = e;
		Listing_Date = l;
		Market = m;
		Privacy = p;
		Section = sec;
		Kind = ki;
		Issued_Share = sh;
		Industry = ind;
	}
	
	public override string ToString()
	{
		var result = "{" 
			+ $"\"ISIN\" : \"{ISIN}\","
			+ $"\"Ticker\" : \"{Ticker}\","
			+ $"\"KR_Name\" : \"{KR_Name}\","
			+ $"\"Short_Name\" : \"{Short_Name}\","
			+ $"\"EN_Name\" : \"{EN_Name}\","
			+ $"\"Listing_Date\" : \"{Listing_Date}\","
			+ $"\"Market\" : \"{Market}\","
			+ $"\"Privacy\" : \"{Privacy}\","
			+ $"\"Section\" : \"{Section}\","
			+ $"\"Kind\" : \"{Kind}\","
			+ $"\"Issued_Share\" : {Issued_Share},"
			+ $"\"Industry\" : \"{Industry}\" "
			+ "}";
		
		return result;
	}
}