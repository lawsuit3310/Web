using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

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
		
		public List<Stock> SelectByName(string query)
		{
			List<Stock> result = new ();
			
			var con = GetConnection();
			string queryStringKR = $"select * from krx where KR_Name {query} ";
			string queryStringEN = $"select * from krx where EN_Name {query} ";
			
			con.Open();
			
			var cmd = new MySqlCommand(queryStringKR, con);
			
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
						Convert.ToInt32(reader["Price"].ToString()),
						Convert.ToInt32(reader["Issued_Share"].ToString())
					));
				}
			}
			
			cmd.CommandText = queryStringEN;
			
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
						Convert.ToInt32(reader["Price"].ToString()),
						Convert.ToInt32(reader["Issued_Share"].ToString())
					));
				}
			}
			
			//중복 제거 후 ISIN 순으로 정렬
			result.Distinct();
			result.OrderBy( x => x.ISIN);
			
			con.Close();
			
			return result;
			
		}
		
		public Stock SelectByISIN(string ISIN)
		{
			Stock result = null;
			
			var con = GetConnection();
			string queryStringKR = $"select * from krx where ISIN = '{ISIN}' ";
			
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
						Convert.ToInt32(reader["Price"].ToString()),
						Convert.ToInt32(reader["Issued_Share"].ToString())
					);
				}
			}
			
			con.Close();
			
			return result;
			
		}
	}
}