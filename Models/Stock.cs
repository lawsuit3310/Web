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
	public int Price {get;}
	public int Issued_Share {get;}
	
	public Stock(string i, string t, string k, string s, string e, string l, string m, string p, string sec, string ki, int pr, int sh)
	{
		ISIN = i;
		Ticker = t;
		KR_Name = k;
		Short_Name = s;
		EN_Name = e;
		Listing_Date = l;
		Market = m;
		Privacy = p;
		Section = sec;
		Kind = ki;
		Price = pr;
		Issued_Share = sh;
	}
}