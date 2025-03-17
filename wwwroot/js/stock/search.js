
$('.search_box').on( "change", (event) => {
	if(event.target.value != '')
	{
		GetStockInfo();
	}
} )

function GetStockInfo()
{
	//내용 초기화
	$('.stockList').html = ''
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
			console.log(text);
			JSON.parse(text)
		}
	};
	
	
}
