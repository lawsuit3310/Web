$('.search_box').on( "change", (event) => {
	if(event.target.value != '')
	{
		ContextSwitch(".stock_list");
		SetupStockInfo();
	}
	else
	{	
		ContextSwitch(".stock_home");
	}
} )

async function SetupStockInfo()
{
	//내용 초기화
	$('.stock_list').html('');
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/Search?query=${$('.search_box').val().trim()}`;
	//console.log(url);
	
	response = await fetch(url);
	object = await response.json();

	console.log(object)
		
	//https://jss2981.tistory.com/7 <- 계속 처 에러 떴던 이유;;

	html = `<ul>`;

	var keys = Object.keys(object);

	for (i = 0; i < keys.length; i++)
	{
		var x = keys[i];
		html += `<li class = "stock"><a><table><tbody>
		<td value = ${x} style = "text-align : left; padding-left : 10%;">${object[x]["Ticker"]}</td>
		<td value = ${x}>${object[x]["Short_Name"]}</td>
		<td value = ${x}>${object[x]["Industry"]}</td>
		</table></tbody></a></li>`
	}

	html += `</ul>`

	$('.stock_list').html(html);

	$('.stock_list a').each((index, item) =>
	{
		$(item).on('click', async (x) =>
		{
			var info = await GetStockInfo(object[x.target.getAttribute('value')]["Ticker"])
			stock_context = object[x.target.getAttribute('value')]["Ticker"];
			ShowInfo(object[x.target.getAttribute('value')]["Ticker"], info['output']["scty_grp_id_cd"], "");
		});
	});
}
