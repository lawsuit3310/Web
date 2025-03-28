public class ETF : Stock
{
	string Track_Index = "";
	//지수 산출 기관
	string Institution = "";
	//추적 배수
	string Track_Times = "";
	//복제방법
	string Copy_Type = "";
	//기초시장분류
	string Base_Market_Div = "";
	//기초자산분류
	string Base_Asset_Div = "";
	//운용 기업
	string Corp = "";
	//CU 수량
	int CU_Count = 0;
	//운용보수
	float Reward = 0;
	//과세구분
	string Tax_Type = "";
	
	public ETF(string i, string t, string k, string s, string e, string l, int sh, string ti, string inst, string tt, string c, string bmd, string bad, string corp, int cc, float r, string tax): base(i, t, k, s, e, l, "", "", "", "", sh, "")
	{
	
	}
	
	public override string ToString()
	{
		var result = base.ToString();
		
		result = result.Replace("}", ",");
		
		result += $"\"Track_Index\" : \"{Track_Index}\",";
		result += $"\"Institution\" : \"{Institution}\",";
		result += $"\"Track_Times\" : \"{Track_Times}\",";
		result += $"\"Copy_Type\" : \"{Copy_Type}\",";
		result += $"\"Base_Market_Div\" : \"{Base_Market_Div}\",";
		result += $"\"Base_Asset_Div\" : \"{Base_Asset_Div}\",";
		result += $"\"Corp\" : \"{Corp}\",";
		result += $"\"CU_Count\" : {CU_Count},";
		result += $"\"Reward\" : {Reward},";
		result += $"\"Tax_Type\" : \"{Tax_Type}\"";
		result += "}";
		
		return result;
	}
}