async function GetBondInfo(c)
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/Info?ticker=${c}&type=bond`;

	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}

async function GetStockInfo(c)
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/Info?ticker=${c}&type=stock`;

	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}

async function GetBondPrice(c)
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/Price?ticker=${c}&type=bond`;

	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}
