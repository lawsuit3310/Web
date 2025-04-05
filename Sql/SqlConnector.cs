using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

using HttpRequests.KInv;

namespace SqlTasks
{
	
	public class SqlConnector
	{
		
		public string connectionString {get; set;}
		
		public SqlConnector(string s)
		{
			connectionString = s;
		}
		
		private MySqlConnection GetConnection()
		{
			return new MySqlConnection(connectionString);
		}
		private MySqlConnection GetConnection(string constring)
		{
			return new MySqlConnection(constring);
		}
		
		public List<Stock> SelectByName(string query)
		{
			List<Stock> result = new ();
			
			var con = GetConnection();
			string[] queryStringKRX = { $"select * from krx_complete where KR_Name {query} ",
									 $"select * from krx_complete where EN_Name {query}",
									 $"select * from krx_complete where ISIN {query}"};
			string[] queryStringETF = {$"select * from etf where KR_Name {query} ",
									 $"select * from etf where EN_Name {query} ",
									 $"select * from etf where ISIN {query} " };
			
			con.Open();
			
			foreach(string _query in queryStringKRX )
			{
				var cmd = new MySqlCommand(_query, con);
			
				using(var reader = cmd.ExecuteReader())
				{
					while(reader.Read())
					{
						result.Add(new (
							reader["ISIN"].ToString().Trim(),
							reader["Ticker"].ToString().Trim(),
							reader["KR_Name"].ToString().Trim(),
							reader["Short_Name"].ToString().Trim(),
							reader["EN_Name"].ToString().Trim(),
							reader["Listing_Date"].ToString().Trim(),
							reader["Market"].ToString().Trim(),
							reader["Privacy"].ToString().Trim(),
							reader["Section"].ToString().Trim(),
							reader["kind"].ToString().Trim(),
							Convert.ToInt32(reader["Issued_Share"].ToString()),
							reader["Industry"].ToString()
						));
					}
				}
			}
			
			foreach(string _query in queryStringETF )
			{
				var cmd = new MySqlCommand(_query, con);
			
				using(var reader = cmd.ExecuteReader())
				{
					while(reader.Read())
					{
						result.Add(new ETF (
							reader["ISIN"].ToString().Trim(),
							reader["Ticker"].ToString().Trim(),
							reader["KR_Name"].ToString().Trim(),
							reader["Short_Name"].ToString().Trim(),
							reader["EN_Name"].ToString().Trim(),
							reader["Listing_Date"].ToString().Trim(),
							Convert.ToInt32(reader["Listed_Shares"].ToString()),
							reader["Track_Index"].ToString().Trim(),
							reader["Institution"].ToString().Trim(),
							reader["Track_Times"].ToString().Trim(),
							reader["Copy_Type"].ToString().Trim(),
							reader["Base_Market_Div"].ToString().Trim(),
							reader["Base_Asset_Div"].ToString().Trim(),
							reader["Corp"].ToString().Trim(),
							Convert.ToInt32(reader["CU_Count"].ToString()),
							Convert.ToSingle(reader["Reward"].ToString()),
							reader["Tax_Type"].ToString().Trim()
						));
					}
				}
			}
			
			//중복 제거 후 ISIN 순으로 정렬
			result = result.GroupBy( x => x.ISIN)
				.Select(x => x.First())
				.ToList();
			result.OrderBy( x => x.ISIN);
			
			con.Close();
			
			return result;
			
		}
		
		public Stock SelectByISIN(string ISIN)
		{
			Stock result = null;
			
			var con = GetConnection();
			string queryStringKR = $"select * from krx_complete where ISIN = '{ISIN}' ";
			
			con.Open();
			
			var cmd = new MySqlCommand(queryStringKR, con);
			
			using(var reader = cmd.ExecuteReader())
			{
				while(reader.Read())
				{
					result = new (
						reader["ISIN"].ToString().Trim(),
						reader["Ticker"].ToString().Trim(),
						reader["KR_Name"].ToString().Trim(),
						reader["Short_Name"].ToString().Trim(),
						reader["EN_Name"].ToString().Trim(),
						reader["Listing_Date"].ToString().Trim(),
						reader["Market"].ToString().Trim(),
						reader["Privacy"].ToString().Trim(),
						reader["Section"].ToString().Trim(),
						reader["kind"].ToString().Trim(),
						Convert.ToInt32(reader["Issued_Share"].ToString()),
						reader["Industry"].ToString()
					);
				}
			}
			
			con.Close();
			
			return result;
			
		}
		
		public (string, DateTime) SelectTokenInfo(string appkey, string appsecret)
		{
			var con = GetConnection("Server = localhost; Database=user; User Id=asp; Password=041008;");
			con.Open();
			
			string queryString = $"select access_token, access_token_token_expired from authorization where appkey = '{appkey}' and appsecret = '{appsecret}' ";
			var cmd = new MySqlCommand(queryString, con);
			
			var result = ("", DateTime.Now);
			
			using(var reader = cmd.ExecuteReader())
			{
				reader.Read();
				
				var expired_date = DateTime.Parse(reader["access_token_token_expired"].ToString());
				//토큰 생성 후 24시간이 경과하지 않은 경우
				if (expired_date.AddDays(1) > DateTime.Now)
				{
					result = (reader["access_token"].ToString(), expired_date.AddDays(-1));
					Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss") + " Token 호출됨. by SQL Connector");
				}
			}
			
			con.Close();
			
			return result;
		}
		
		public void UpdateToken(string appkey, string appsecret, string token, DateTime token_expired)
		{
			var con = GetConnection("Server = localhost; Database=user; User Id=asp; Password=041008;");
			con.Open();
			
			string queryString = $"update authorization set access_token = '{token}', access_token_token_expired = '{token_expired.ToString("yyyy-MM-dd hh:mm:ss")}' where appkey = '{appkey}' and appsecret = '{appsecret}'";
			var cmd = new MySqlCommand(queryString, con);
			if (cmd.ExecuteNonQuery() == 0)
			{
				con.Close();
				InsertToken(appkey, appsecret, token, token_expired);
			}
			else
			{
				con.Close();
			}
		}
		
		private void InsertToken(string appkey, string appsecret, string token, DateTime token_expired)
		{
			var con = GetConnection("Server = localhost; Database=user; User Id=asp; Password=041008;");
			con.Open();
			
			string queryString = $"insert into authorization(appkey, appsecret, access_token, access_token_token_expired)"+
				$"value ('{appkey}', '{appsecret}', '{token}', '{token_expired.ToString("yyyy-MM-dd hh:mm:ss")}) ";
			var cmd = new MySqlCommand(queryString, con);
			Console.WriteLine(queryString);
			cmd.ExecuteNonQuery();
			con.Close();
		}
	}
}