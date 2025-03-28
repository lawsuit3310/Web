using System;
using System.IO;
using System.Text;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using SqlTasks;

namespace HttpRequests.KInv
{
	public class KInvManager
	{
		static readonly HttpClient client = new HttpClient();
		static readonly string baseUrl = "https://openapi.koreainvestment.com:9443";
		
		private async static Task<string> GetTokenAsync(string appkey, string appsecret)
		{
			var con = new SqlConnector("Server = localhost; Database=user; User Id=asp; Password=041008;");
			var keysecret = await GetKeySecret();
			var tokeninfo = con.SelectTokenInfo(keysecret[0], keysecret[1]);
			var token = "";
			if (tokeninfo.Item1 == "")
			{
				token = await CreateToken(keysecret[0], keysecret[1]);
				con.UpdateToken(keysecret[0], keysecret[1], token, DateTime.Now);
			}
			else
			{
				token = tokeninfo.Item1;
			}
			
			return token;
		}
		private static async Task<string> CreateToken(string appkey, string appsecret)
		{
			HttpContent content = new StringContent(
				$"{{\"grant_type\":\"client_credentials\",\"appkey\":\"{appkey}\",\"appsecret\":\"{appsecret}\" }}",
				Encoding.UTF8);

			var response = await client.PostAsync(baseUrl + "/oauth2/tokenP", content);
			string json = await response.Content.ReadAsStringAsync();
			string result = "";
			try
			{
				var jobject = JObject.Parse(json);
				result = jobject["access_token"].ToString();
			}
			catch
			{
				Console.WriteLine("요청이 너무 잦습니다.");
				result = "요청이 너무 잦습니다.";
			}
			return result;
		}
		private static async Task<string[]> GetKeySecret()
		{
			var result = new string[2] {"", ""};
			string keyPath = Directory.GetCurrentDirectory() + "/Private/access.json";
			if (File.Exists(keyPath))
			{
				string json = "";
				using(var reader = new StreamReader(keyPath, Encoding.UTF8))
				{
					//파일의 마지막까지 읽어 들였는지를 EndOfStream 속성을 보고 조사
					while (!reader.EndOfStream)
					{
						//ReadLine 메서드로 한 행을 읽어 들여 line 변수에 대입
						json += reader.ReadLine();
					}
				}
				var jobject = JObject.Parse(json);
				
				result[0] = jobject["appkey"].ToString();
				result[1] = jobject["appsecret"].ToString();
			}
			else
			{
				result[0] = "The Path is not vaild.";
				result[1] = "Failed to Get Access Key.";
			}
			return result;
		}
		
		//한투 서버에 주식 상세 정보를 조회하는 함수
		public static async Task<string> InquiryStockInfo(string ticker)
		{
			string result = "";
			
			string subUrl = "/uapi/domestic-stock/v1/quotations/search-stock-info";
			string url = baseUrl + subUrl + $"?PDNO={ticker}&PRDT_TYPE_CD={300}";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "CTPF1002R");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				var resJson = await response.Content.ReadAsStringAsync();
				result = resJson;
				
				//Console.WriteLine(resJson);
			}
			return result;
		}
		
		//주식 시세 조회
		public static async Task<string> InquiryStockPrice(string ticker)
		{
			string subUrl = "/uapi/domestic-stock/v1/quotations/inquire-price";
			string url = baseUrl + subUrl + $"?FID_INPUT_ISCD={ticker}&FID_COND_MRKT_DIV_CODE={"J"}";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST01010100");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		public static async Task<string> InquiryDailyStockPrice(string ticker, string type)
		{
			type = type.ToLower();
			string subUrl = "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice";
			
			var FID_INPUT_DATE_1 = "";
			
			switch(type)
			{
				case "d":
					FID_INPUT_DATE_1 = DateTime.Today.AddDays(-14).ToString("yyyyMMdd");
					break;
				case "w":
					FID_INPUT_DATE_1 = DateTime.Today.AddMonths(-3).ToString("yyyyMMdd");
					type = "d";
					break;
				case "y":
					FID_INPUT_DATE_1 = DateTime.Today.AddYears(-5).ToString("yyyyMMdd");
					type = "m";
					break;
				case "m":
				default:
					FID_INPUT_DATE_1 = DateTime.Today.AddYears(-1).ToString("yyyyMMdd");
					type = "w";
					break;
			}
			
			string url = baseUrl + subUrl + $"?FID_INPUT_ISCD={ticker}&FID_COND_MRKT_DIV_CODE={"J"}"+
				$"&FID_INPUT_DATE_1={FID_INPUT_DATE_1}&FID_INPUT_DATE_2={DateTime.Today.ToString("yyyyMMdd")}"+
				$"&FID_PERIOD_DIV_CODE={type.ToUpper()}&FID_ORG_ADJ_PRC=0";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST03010100");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		//ETF
		public static async Task<string> InquiryETFPrice(string ticker)
		{
			string subUrl = "/uapi/etfetn/v1/quotations/inquire-price";
			string url = baseUrl + subUrl + $"?fid_input_iscd={ticker}&fid_cond_mrkt_div_code=J";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHPST02400000");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		//기업 재무 비율 조회
		public static async Task<string> FinancialRatio(string ticker)
		{
			string subUrl = "/uapi/domestic-stock/v1/finance/financial-ratio";
			string url = baseUrl + subUrl + $"?FID_DIV_CLS_CODE={0}&fid_cond_mrkt_div_code={"J"}&fid_input_iscd={ticker}";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST66430300");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		//대차대조표 조회
		public static async Task<string> BalanceSheet(string ticker)
		{
			string subUrl = "/uapi/domestic-stock/v1/finance/balance-sheet";
			string url = baseUrl + subUrl + $"?FID_DIV_CLS_CODE={0}&fid_cond_mrkt_div_code={"J"}&fid_input_iscd={ticker}";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST66430100");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		//손익 계산서 조회
		public static async Task<string> IncomeStatement(string ticker)
		{
			string subUrl = "/uapi/domestic-stock/v1/finance/income-statement";
			string url = baseUrl + subUrl + $"?FID_DIV_CLS_CODE={0}&fid_cond_mrkt_div_code={"J"}&fid_input_iscd={ticker}";
			
			//Console.WriteLine(url);
			
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			var resJson = "";
			{
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();
					
					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]) + " ");	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST66430200");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				resJson = await response.Content.ReadAsStringAsync();
			}
			return resJson;
		}
		
		//지수 조회
		public async static Task<string> GetMarketIndex(string market)
		{
			//Dictionary<string, string> result = new ();	
			string result = "";
			string subUrl = "/uapi/domestic-stock/v1/quotations/inquire-index-daily-price";
			string code = "0001";
			market = market.ToUpper();
			//국내
			if (market == "KOSPI" || market == "KOSPI200" || market == "KOSDAQ")
			{
				switch(market)
				{
					case "KOSPI":
						code = "0001";
						break;
					case "KOSDAQ":
						code ="1001";
						break;
					case "KOSPI200":
						code ="2001";
						break;	
				}
				string url = baseUrl + subUrl +
				$"?FID_COND_MRKT_DIV_CODE=U&FID_INPUT_ISCD={code}&fid_input_date_1={DateTime.Today.ToString("yyyyMMdd")}&fid_period_div_code=W";
			
			//Console.WriteLine(url);
			
				HttpClient cli = new ();
				HttpResponseMessage response = default;
				JObject jobject = default;
				{
					string stock_info = "";
					try
					{
						var keysecret = await GetKeySecret();

						cli.DefaultRequestHeaders
							  .Accept
							  .Add(new MediaTypeWithQualityHeaderValue("application/json"));
					
					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHPUP02120000");
					//cli.DefaultRequestHeaders.Add("tr_cont", "");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				var resJson = await response.Content.ReadAsStringAsync();
				jobject = JObject.Parse(resJson);
				
				result = resJson;
				
				//Console.WriteLine(jobject.ToString());
				//Console.WriteLine(Convert.ToInt32(jobject["stck_prpr"].ToString()));
			}
			}
			//해외
			else
			{
				switch(market)
				{
					case "NASDAQ":
						code = "COMP";
						break;
					case "DJI":
						code =".DJI";
						break;
					case "SPX":
						code ="SPX";
						break;
					case "NIKKEI":
						code ="JP%23NI225";
						break;
				}
				
                subUrl ="/uapi/overseas-price/v1/quotations/inquire-daily-chartprice";
				string url = baseUrl + subUrl +
				$"?FID_COND_MRKT_DIV_CODE=N&FID_INPUT_ISCD={code}&FID_INPUT_DATE_1={DateTime.Today.AddYears(-1).ToString("yyyyMMdd")}&fid_input_date_2={DateTime.Today.ToString("yyyyMMdd")}&FID_PERIOD_DIV_CODE=W";
			
				//Console.WriteLine(url);
			
				HttpClient cli = new ();
				HttpResponseMessage response = default;
				JObject jobject = default;
				string stock_info = "";
				try
				{
					var keysecret = await GetKeySecret();

					cli.DefaultRequestHeaders
						  .Accept
						  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

					cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
					cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
					cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
					cli.DefaultRequestHeaders.Add("tr_id", "FHKST03030100");
					//cli.DefaultRequestHeaders.Add("tr_cont", "");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				var resJson = await response.Content.ReadAsStringAsync();
				jobject = JObject.Parse(resJson);

				result = resJson;

				//Console.WriteLine(jobject.ToString());
				//Console.WriteLine(Convert.ToInt32(jobject["stck_prpr"].ToString()));
			}
			return result;
		}
		public async static Task<string> GetBalance()
		{
			string result = "";
            string subUrl ="/uapi/domestic-stock/v1/trading/inquire-balance";
			string url = baseUrl + subUrl +
				$"?CANO=64516751&ACNT_PRDT_CD=01&AFHR_FLPR_YN=N&OFL_YN=%20&INQR_DVSN=02&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N"+
				$"&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=%20&CTX_AREA_NK100=%20";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "TTTC8434R");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			jobject = JObject.Parse(resJson);
			
			var bondJson = await GetBondBalance();
			var bondObj = JObject.Parse(bondJson);
			
			jobject.Add("output3", bondObj["output"].ToString());
			
			//Console.WriteLine(await GetBonds("KR6348951F26"));
			
			resJson = jobject.ToString();
			
			result = resJson;
			return result;
        }
		
		public async static Task<string> GetBondBalance()
		{
			string result = "";
            string subUrl ="/uapi/domestic-bond/v1/trading/inquire-balance";
			string url = baseUrl + subUrl +
				$"?CANO=64516751&ACNT_PRDT_CD=01&INQR_CNDT=00&PDNO=%20&BUY_DT=%20&CTX_AREA_FK200=%20&CTX_AREA_NK200=%20";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "CTSC8407R");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			//jobject = JObject.Parse(resJson);

			result = resJson;
			return result;
        }
		public async static Task<string> GetBondInfo(string code)
		{
			var json1 = await GetBondStatus(code);
			var json2 = await GetBondBasicInfo(code);
			
			var obj = new JObject();
			var output = new JObject();
			
			var obj1 = JObject.Parse(json1);
			var obj2 = JObject.Parse(json2);
			
			output.Add("status", obj1["output"]);
			output.Add("basicInfo", obj2["output"]);
			output.Add("prdt_type_cd", obj1["output"]["prdt_type_cd"]);
			
			obj.Add("output", output);
			
			return obj.ToString();
        }
		
		//채권 발행 정보
		private async static Task<string> GetBondBasicInfo(string code)
		{
			string result = "";
            string subUrl ="/uapi/domestic-bond/v1/quotations/issue-info";
			string url = baseUrl + subUrl +
				$"?PDNO={code}&PRDT_TYPE_CD=302";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "CTPF1101R");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			//jobject = JObject.Parse(resJson);

			result = resJson;
			return result;
		}
		//채권 기본 정보
		private async static Task<string> GetBondStatus(string code)
		{
			string result = "";
            string subUrl ="/uapi/domestic-bond/v1/quotations/search-bond-info";
			string url = baseUrl + subUrl +
				$"?PDNO={code}&PRDT_TYPE_CD=302";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "CTPF1114R");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			//jobject = JObject.Parse(resJson);

			result = resJson;
			return result;
		}
		public async static Task<string> GetBondPrice(string code)
		{
			string result = "";
            string subUrl ="/uapi/domestic-bond/v1/quotations/inquire-price";
			string url = baseUrl + subUrl +
				$"?FID_COND_MRKT_DIV_CODE=B&FID_INPUT_ISCD={code}";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "FHKBJ773400C0");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			//jobject = JObject.Parse(resJson);
			
			result = resJson;
			return result;
        }
		
		private async static Task<string> GetOilPriceInfo()
		{
			string result = "";
			string burl= "http://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getOilPriceInfo";
			string suburl= "?serviceKey=HyIL%2BEr4nzCz09RFRzkcnz1fkwXwgNJrbGOfukunyoEybDkSjwYI5TjjJO5mfZG9nvAa1l3XMuX2h7fcunZlGw%3D%3D"+
				"&numOfRows=51&pageNo=1&resultType=json&oilCtg=휘발유";
			
			string url = burl + suburl;
			
			HttpClientHandler clientHandler = new HttpClientHandler();
			clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

			HttpClient cli = new (clientHandler);
			HttpResponseMessage response = default;
			JObject jobject = default;
			string resJson = "";
			try
			{
				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
				resJson = e.Message;
			}
			
			resJson = await response.Content.ReadAsStringAsync();
			
			//jobject = JObject.Parse(resJson);
			result = resJson;
			return result;
        }
		
		private async static Task<string> GetGoldPriceInfo()
		{
			string result = "";
			string burl= "http://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo";
			string suburl= "?serviceKey=HyIL%2BEr4nzCz09RFRzkcnz1fkwXwgNJrbGOfukunyoEybDkSjwYI5TjjJO5mfZG9nvAa1l3XMuX2h7fcunZlGw%3D%3D"+
				"&numOfRows=51&pageNo=1&resultType=json&isinCd=KRD040200002";
			
			string url = burl + suburl;
			
			HttpClientHandler clientHandler = new HttpClientHandler();
			clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

			HttpClient cli = new (clientHandler);
			HttpResponseMessage response = default;
			JObject jobject = default;
			string resJson = "";
			try
			{
				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
				resJson = e.Message;
			}
			
			resJson = await response.Content.ReadAsStringAsync();
			
			//jobject = JObject.Parse(resJson);
			result = resJson;
			return result;
        }
		
		public async static Task<string> GetGeneralPriceInfo()
		{
			var json1 = await GetOilPriceInfo();
			var json2 = await GetGoldPriceInfo();
			
			var jobject = new JObject();
			
			try
			{
				jobject.Add("oil", JObject.Parse(json1)["response"]["body"]["items"]);
				jobject.Add("gold", JObject.Parse(json2)["response"]["body"]["items"]);
			}
			catch
			{
				Console.WriteLine(json1);
			}
			
			return jobject.ToString();
		}
		
		public async static Task<string> GetExchangeRate(string item)
		{
			//원 / 달러 - FX@KRWKFTC or FX@KR
			//원 / 엔 - FX@KRWJS
			//엔 / 달러 - FX@JPY
			string result = "";
            string subUrl ="/uapi/overseas-price/v1/quotations/inquire-daily-chartprice";
			
			string code = "FX%40";
			
			switch (item.ToLower())
			{
				case "jpy":
					code += "JPY";
					break;
				case "krwjs":
					code += "KRWJS";
					break;
				case "kr":
				case "krw":
				default:
					code += "KRW";
					break;
			}
			
			string url = baseUrl + subUrl +
				$"?FID_COND_MRKT_DIV_CODE=X&FID_INPUT_ISCD={code}&FID_INPUT_DATE_1={DateTime.Today.AddYears(-1).ToString("yyyyMMdd")}&FID_INPUT_DATE_2={DateTime.Today.ToString("yyyyMMdd")}&FID_PERIOD_DIV_CODE=W";
			HttpClient cli = new ();
			HttpResponseMessage response = default;
			JObject jobject = default;
			string stock_info = "";
			try
			{
				var keysecret = await GetKeySecret();

				cli.DefaultRequestHeaders
					  .Accept
					  .Add(new MediaTypeWithQualityHeaderValue("application/json"));

				cli.DefaultRequestHeaders.Add ("authorization", "Bearer " + await GetTokenAsync(keysecret[0], keysecret[1]));	
				cli.DefaultRequestHeaders.Add("appkey", keysecret[0]);
				cli.DefaultRequestHeaders.Add("appsecret", keysecret[1]);
				cli.DefaultRequestHeaders.Add("tr_id", "FHKST03030100");
				//cli.DefaultRequestHeaders.Add("tr_cont", "");
				cli.DefaultRequestHeaders.Add("custtype", "P");

				response = await cli.GetAsync(url);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error Occured " + e.Message);
			}
			var resJson = await response.Content.ReadAsStringAsync();
			//jobject = JObject.Parse(resJson);

			result = resJson;
			return result;
		}
		
	}
}