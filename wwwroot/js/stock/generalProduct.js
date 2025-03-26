async function GetGeneralProductPrice()
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/GeneralProductInfo`;
	
	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}

async function SetupGeneralProductInfo()
{
	var pr = await GetGeneralProductPrice();
	
	$('.gold_title').html("금 / 1g 당");	
	$('.gold_price').html(`최고 : ${Number(pr['gold']['item'][0]['hipr']).toLocaleString()} 원<br><br>최저 : ${Number(pr['gold']['item'][0]['lopr']).toLocaleString()} 원`);
	
	$('.gold_price_dif').css("color",pr['gold']['item'][0]['vs'] > 0 ? '#bb3322' : pr['gold']['item'][0]['vs'] == 0 ? 'grey' : '#3344bb');
	$('.gold_price_dif').html(`${pr['gold']['item'][0]['vs'] > 0 ? ' ▲ ' : pr['gold']['item'][0]['vs'] == 0 ? ' - ' : ' ▼ '} ${pr['gold']['item'][0]['vs']}`);
	$('.oil_title').html(`1L 당 유가 (${pr['oil']['item'][0]['oilCtg']})`);	
	$('.oil_price').html(`경쟁매매 : ${pr['oil']['item'][0]['wtAvgPrcCptn']} 원<br><br>협의거래 : ${pr['oil']['item'][0]['wtAvgPrcDisc']} 원`);
	$('.oil_price_dif').html(`기준일<br><br>${pr['oil']['item'][0]['basDt'].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}`);
}

SetupGeneralProductInfo();