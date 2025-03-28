async function GetBalance()
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/balance`;

	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}

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

async function ShowBalance(event)
{
	x = event.data.balance;
	ContextSwitch('.balance_list');
	$(".balance_list").html('');

	var bal = await GetBalance();
	
	var bonds = JSON.parse(x['output3']);	
	
	bond_tot_buy_amt = 0;
	bond_tot_now_amt = 0;
	
	var _keys = Object.keys(bonds);
	
	//채권 구매가와 현제 시가의 총합
	for (var i = 0; i < _keys.length; i++)
	{
		var bond_price = await GetBondPrice(bonds[i]['pdno']);
		
		bond_tot_now_amt += bond_price['output']['bond_prpr']/10 * bonds[i]['cblc_qty'];
		bond_tot_buy_amt += Number(bonds[i]['buy_amt'])	
	}
	
	amt_now = Number(x['output2'][0]['evlu_amt_smtl_amt']) + Number(bond_tot_now_amt);
	amt_buy = Number(x['output2'][0]['pchs_amt_smtl_amt']) + Number(bond_tot_buy_amt);
	
	// 구입한 시점과 현재 금액의 차이
	var difference = amt_now - amt_buy;
	var i = [0];
	
	//현재 주식 잔고 항목을 ul로
	html = `<div class = "title"><span>총 금액</span></div><div style = "font-size : 0.8em;" class = "balance"></div>`+
		`<div ID = "bal_chart"class = "bal_chart"></div>`+
		`<ul><li><table><tr><th class = "number">종목명</th><td>평가액</td><td>수량</td><td>손익</td></tr></table></li>`;
	keys = Object.keys(x["output1"]);
	
	var data = {};
	
	for (var i = 0; i < keys.length; i++)
	{
		var stock_price = await GetStockInfo(x["output1"][i]["pdno"]);
		html += `<li><table><tr onclick = " stock_context = '${stock_price['output']['std_pdno']}'; ShowInfo('${x["output1"][i]["pdno"]}', '${stock_price["output"]["scty_grp_id_cd"]}')">`
	
		html += `<th>${x["output1"][i]["prdt_name"]}</th><td class = "number">${Number(x["output1"][i]["evlu_amt"]).toLocaleString()}</td><td class = "number">`+
			`${(x["output1"][i]["hldg_qty"]).toLocaleString()}</td><td class = "number" style = "color : ${x["output1"][i]["evlu_pfls_amt"] > 0 ? '#bb3322' : x["output1"][i]["evlu_pfls_amt"] == 0 ? 'grey' : '#3344bb'}">`+
			`${(x["output1"][i]["evlu_pfls_amt"] > 0 ? ' ▲ ' : x["output1"][i]["evlu_pfls_amt"] == 0 ? ' - ' : ' ▼ ') + Math.abs(x["output1"][i]["evlu_pfls_amt"]).toLocaleString()}</td>`

		html += `</tr></table></li>`
		
		var info = await GetStockInfo(x["output1"][i]["pdno"]);
		
		if (info['output']["idx_bztp_mcls_cd_name"] != '')
			if (data[info['output']["idx_bztp_mcls_cd_name"]] == null || data[info['output']["idx_bztp_mcls_cd_name"]] == 0)
				data[info['output']["idx_bztp_mcls_cd_name"]] = Number(x["output1"][i]["evlu_amt"]);
			else
				data[info['output']["idx_bztp_mcls_cd_name"]] += Number(x["output1"][i]["evlu_amt"]);
		else
			if (data["ETF"] == null || data["ETF"] == 0)
				data["ETF"] = Number(x["output1"][i]["evlu_amt"]);
			else
				data["ETF"] += Number(x["output1"][i]["evlu_amt"]);
	}
	
	//현재 채권 잔고 항목을 ul로
	bonds = JSON.parse(x["output3"]);
	
	for (var i = 0; i < bonds.length; i++)
	{
		var bond_price = await GetBondPrice(bonds[i]['pdno']);
		
		html += `<li><table><tr onclick = "ShowInfo('${bonds[i]["pdno"]}', 'bond' ) ">`
	
		var bond_tot_now_amt = bond_price['output']['bond_prpr']/10 * bonds[i]['cblc_qty'];
		var bond_tot_buy_amt = Number(bonds[i]['buy_amt'])
		dif = bond_tot_now_amt - bond_tot_buy_amt;
		
		html += `<th>${bonds[i]["prdt_name"]}</th><td class = "number">${(Math.round(bond_tot_now_amt)).toLocaleString()}</td><td class = "number">${bonds[i]['cblc_qty']}</td>`+
			`<td class = "number" style = " color : ${(dif > 0 ? '#bb3322' : dif == 0 ? 'grey' : '#3344bb')}">${(dif > 0 ? ' ▲ ' : dif == 0 ? ' - ' : ' ▼ ') + Math.abs(dif).toLocaleString()}</td>`

		html += `</tr></table></li>`
		
		if (data["채권"] == null || data["채권"] == 0)
				data["채권"] = bond_tot_now_amt;
			else
				data["채권"] += bond_tot_now_amt;
	}
	
	html += "</ul>";
	
	//적용
	$(".balance_list").html(html);
	DrawChartBalance (data)
	
	$('.balance_list .balance').html(`<span class = "number" style ="width : 55%">${Math.round(parseInt(amt_now)).toLocaleString() + " " }</span>`+
					   `<span class = "Currency"  style ="width : 15%">원</span><span style = "color : `+
					   `${difference > 0 ? '#bb3322' : difference == 0 ? 'grey' : '#3344bb'}; width : 30%" class = "difference">`+
					   `${difference > 0 ? ' ▲ ' : difference == 0 ? ' - ' : ' ▼ ' } ${Math.round(difference)}</span>`);
}

PrintBalance = async () => 
{
	var bal = await GetBalance();
	
	var bonds = JSON.parse(bal['output3']);	
	
	bond_tot_buy_amt = 0;
	bond_tot_now_amt = 0;
	
	var _keys = Object.keys(bonds);
	
	for (var i = 0; i < _keys.length; i++)
	{
		var bond_price = await GetBondPrice(bonds[i]['pdno']);
		
		bond_tot_now_amt += bond_price['output']['bond_prpr']/10 * bonds[i]['cblc_qty'];
		bond_tot_buy_amt += Number(bonds[i]['buy_amt'])	
	}
	
	
	amt_now = Number(bal['output2'][0]['evlu_amt_smtl_amt']) + Number(bond_tot_now_amt);
	amt_buy = Number(bal['output2'][0]['pchs_amt_smtl_amt']) + Number(bond_tot_buy_amt);
	
	var difference = amt_now - amt_buy;
	var i = [0];
	
	var intv = setInterval( (x) => {
		x[0] += 1
		$('.balance').html(`<span class = "number"> ${Math.round(amt_now * (x[0]/17)).toLocaleString()} </span>`+
						   `<span class = "Currency">원</span><span style = "color : `+
						   `${difference > 0 ? '#bb3322' : difference == 0 ? 'grey' : '#3344bb'}; " class = "difference">`+
						   `${difference > 0 ? '  ▲  ' : difference == 0 ? '  -  ' : '  ▼  ' } ${Math.round(difference * (x[0]/17))}</span>`);
		if(x[0] == 17)
		{			
			clearInterval(intv);
		}
	},50, i);
	
	$('.balance_preview').on( 'click', {balance : bal}, ShowBalance)
}


function DrawChartBalance (x)
{
	var char_div = document.getElementById('bal_chart');
	if (char_div == null)
		return;
	
	google.charts.load('current', {'packages':['corechart']});
 	google.charts.setOnLoadCallback( async () =>
	{			
		var original = x;
		var row = [];
		var keys = Object.keys(original);
		
		var table = new google.visualization.DataTable();
		var table_empty = new google.visualization.DataTable();
		var options = {
			'pieHole': 0.4,
			'backgroundColor' :  '#232326',
			'forceIFrame' : true,
			'sliceVisibilityThreshold' : .05,
			'legend' : {
				'position' : 'right',
				'textStyle' : {
					'color' : '#ccc',
					'fontSize' : 28
				}
			},
			'fontName' : 'Paperlogy-8ExtraBold',
			'chartArea': {'width': '120%', 'height': '100%'},
			'left' : '-1000px',
			'width' : 900,
			'height' : 400,
			'lineWidth' : 0,
			'fontSize' : 28,
		}

		
		for (i = 0; i < keys.length; i++)
		{
			row.push([keys[i], Number(original[keys[i]])]);
		}
		table.addColumn('string', 'item');
		table.addColumn('number', 'Price');
		table.addRows(row);

		// Pie chart는 애니메이션이 적용이 안된다고 함
		var chart = new google.visualization.PieChart(document.getElementById('bal_chart'));
		chart.draw(table, options);
	});
}


document.addEventListener('DOMContentLoaded', PrintBalance);

