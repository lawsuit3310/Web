using System;
using System.IO;
using System.Text;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HttpRequests.KInv
{
	public class KInvManager
	{
		static readonly HttpClient client = new HttpClient();
		static readonly string baseUrl = "https://openapi.koreainvestment.com:9443";
		
		private async static Task<string> GetTokenAsync(string appkey, string appsecret)
		{
			string result = "";
			
			string tokenPath = Directory.GetCurrentDirectory() + "/Private/token.json";
			if (File.Exists(tokenPath))
			{
				string json = "";
				using(var reader = new StreamReader(tokenPath, Encoding.UTF8))
				{
					//파일의 마지막까지 읽어 들였는지를 EndOfStream 속성을 보고 조사
					while (!reader.EndOfStream)
					{
						//ReadLine 메서드로 한 행을 읽어 들여 line 변수에 대입
						json += reader.ReadLine();
					}
				}
				
				try
				{
					var jobject = JObject.Parse(json);
					
					//마지막으로 키를 발급 받고 1일이 경과했을 때
					if (DateTime.Parse(jobject["access_token_token_expired"].ToString()).AddDays(1) < DateTime.Now)
					{
						result = await CreateToken(appkey, appsecret);
					}
					else
					{
						result = jobject["access_token"].ToString();
					}
				}
				catch(Exception e)
				{
					Console.WriteLine(e.Message);
					Console.WriteLine("Failed to Parsing Json");
					//json 파싱에 실패하면 새로 생성
					result = await CreateToken(appkey, appsecret);
				}
				
			}
			else
			{
				//토큰 신규 발급
				result = await CreateToken(appkey, appsecret);
				
			}
			return result;
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
				
				string tokenPath = Directory.GetCurrentDirectory() + "/Private/token.json";
				
				var writer = File.CreateText(tokenPath);
				writer.WriteLine(json);    //저장될 string
				writer.Close();

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
		
		//한투 서버에 주식 종목정보를 조회하는 함수
		public static async Task<Stock> Inquiry(Stock stock)
		{
			string subUrl = "/uapi/domestic-stock/v1/quotations/search-info";
			string url = baseUrl + subUrl + $"?PDNO={"475150"}&PRDT_TYPE_CD={300}";
			
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
					cli.DefaultRequestHeaders.Add("tr_id", "CTPF1604R");
					cli.DefaultRequestHeaders.Add("custtype", "P");

					response = await cli.GetAsync(url);
				}
				catch (Exception e)
				{
					Console.WriteLine("Error Occured " + e.Message);
				}
				var resJson = await response.Content.ReadAsStringAsync();
				
				Console.WriteLine(resJson);
				jobject = JObject.Parse(resJson);
				
				
				
			}
			return stock;
		}
	}
}