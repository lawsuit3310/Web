
$('.search_box').on( "change", (event) => {
	if(event.target.value != '')
	{
		$('.stock_list').addClass('active');
		GetStockInfo();
	}
	else
	{		
		$('.stock_list').removeClass('active');
	}
} )

function GetStockInfo()
{
	//내용 초기화
	$('.stock_list').html('');
	const Http = new XMLHttpRequest();

	const url = `https://lawsuit3310.run.goorm.io/Stock/Search?query=${$('.search_box').val()}`;
	//console.log(url);
	
	Http.open('GET', url);
	Http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	Http.send();
	Http.onreadystatechange = (e) => {
		text = Http.responseText;
		
		//https://jss2981.tistory.com/7 <- 계속 처 에러 떴던 이유;;
		if(Http.readyState == 4)
		{
			var object = JSON.parse(text)

			html = `<ul>`;
			
			var keys = Object.keys(object);
			
			keys.forEach((x) => {
				html += `<li class = "stock"><a><table><tbody>
				<td value = ${x} style = "text-align : left; padding-left : 10%;">${object[x]["Ticker"]}</td>
				<td value = ${x}>${object[x]["Short_Name"]}</td>
				<td value = ${x}>${object[x]["Industry"]}</td>
				</table></tbody></a></li>`
			});
			
			html += `</ul>`
			
			$('.stock_list').html(html);
			
			$('.stock_list a').each((index, item) =>
			{
				$(item).on('click', (x) =>
				{
					stock_context = object[x.target.getAttribute('value')]["ISIN"];
					
					console.log(stock_context);
					showInfo();
				});
			});
		}
	};
	
	
}
