document.addEventListener('DOMContentLoaded', async () =>
{	var kor_usd = $('.KRW')
	var kor_jpy = $('.KRWJS')
	var jpy_usd = $('.JPY')
	
	var kor_usd_amt = $('.KRW .item_amt')
	var kor_jpy_amt = $('.KRWJS .item_amt')
	var jpy_usd_amt = $('.JPY .item_amt')

	var kor_usd_dif = $('.KRW .dif')
	var kor_jpy_dif = $('.KRWJS .dif')
	var jpy_usd_dif = $('.JPY .dif')
	
	const Http = new XMLHttpRequest();
	const url =
	[
		`https://lawsuit3310.run.goorm.io/Stock/exchange?item=krw`,
		`https://lawsuit3310.run.goorm.io/Stock/exchange?item=krwjs`,
		`https://lawsuit3310.run.goorm.io/Stock/exchange?item=jpy`
	];
	object = []
	
	for (i = 0 ; i < url.length; i++)
	{
		response = await fetch(url[i]);
		jobject = await response.json();
		object.push(jobject);
	}
	
	kor_usd_amt.html((Math.round(object[0]['output1']['ovrs_prod_oprc'] * 100) / 100)+" 원");
	kor_jpy_amt.html((Math.round(object[1]['output1']['ovrs_prod_oprc'] * 10000) / 100)+" 원");
	jpy_usd_amt.html((Math.round(object[2]['output1']['ovrs_prod_oprc'] * 100) / 100)+" 원");
	
	var v_kor = object[0]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? ' ▲ ' :  object[0]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? ' - ' : ' ▼ '
	var v_kwj = object[1]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? ' ▲ ' :  object[1]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? ' - ' : ' ▼ '
	var v_jpy = object[2]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? ' ▲ ' :  object[2]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? ' - ' : ' ▼ '
	
	var c_kor = object[0]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? '#bb3322' :  object[0]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? 'grey' : '#3344bb'
	var c_kwj = object[1]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? '#bb3322' :  object[1]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? 'grey' : '#3344bb'
	var c_jpy = object[2]['output1']['ovrs_nmix_prdy_vrss'] > 0 ? '#bb3322' :  object[2]['output1']['ovrs_nmix_prdy_vrss'] == 0 ? 'grey' : '#3344bb'
	
	kor_usd_dif.css("color", c_kor);
	kor_jpy_dif.css("color", c_kwj);
	jpy_usd_dif.css("color", c_jpy);
	
	kor_usd_dif.html(v_kor + " " + Math.round(object[0]['output1']['ovrs_nmix_prdy_vrss'] * 100) / 100);
	kor_jpy_dif.html(v_kwj + " " + Math.round(object[1]['output1']['ovrs_nmix_prdy_vrss'] * 100) / 100);
	jpy_usd_dif.html(v_jpy + " " + Math.round(object[2]['output1']['ovrs_nmix_prdy_vrss'] * 100) / 100);
	
	
	kor_usd.on('click', (x) => {ShowExchange(object[0], 'krw')})
	kor_jpy.on('click', (x) => {ShowExchange(object[1], 'krwjs')})
	jpy_usd.on('click', (x) => {ShowExchange(object[2], 'jpy')})
})

async function ShowExchange (x, type)
{
	//검색 창 끔
	ContextSwitch('.stock_info_group')	
	//내용 초기화
	$('.stock_info').html('');
	var html = '';
	var ex = '';
	
	switch(type)
	{
		case 'krw':
			ex = '원 - 달러';
			break;
		case 'krwjs':
			ex = '100원 - 엔';
			break;
		case 'jpy':
			ex = '엔 - 달러';
			break;
		default:
			ex = 'Unknown Currency';
			break;
	}
	
	html = '<div class = "info_wrapper">';
	html = `<div class = "title"><span style = " font-size : 1em">${ex}</span></div>`;
	html += '<div ID = "exchange_chart" class = "exchange_chart"></div>';
	
	var min = 9999; var max = 0;
	
	for (i = 0 ; i < x['output2'].length; i++)
	{
		min = x['output2'][i]["ovrs_nmix_lwpr"] < min ? x['output2'][i]["ovrs_nmix_lwpr"] : min;
		max = x['output2'][i]["ovrs_nmix_hgpr"] > max ? x['output2'][i]["ovrs_nmix_hgpr"] : max
	}

	var data =
	{
		0 : {
			describe : "1년 최고가",
			value : max * (type == 'krwjs' ? 100 : 1) + (type == 'jpy' ? " 엔" : " 원")
		},
		1 : {
			describe : "1년 최저가",
			value : min * (type == 'krwjs' ? 100 : 1) + (type == 'jpy' ? " 엔" : " 원")
		}
	};
	
	var keys = Object.keys(data);

	for (i = 0; i < keys.length; i++)
	{
		html += "<table><tbody>"
		html += '<tr>'
		html += `<th>${data[i]["describe"]}</th>`
		html += `<td></td>`
		d = Number(data[i]["value"]);
		html += `<td class = "number">${!isNaN(d) ? d.toLocaleString() : data[i]["value"]}</td>`
		html += '</tr>'
		html += "</tbody></table>"
	}
	
	html += '</div>';
	$('.stock_info').html(html);
	
	DrawChartExchange(x);

}

function DrawChartExchange (x)
{
	var char_div = document.getElementById('exchange_chart');
	if (char_div == null)
		return;
	
	google.charts.load('current', {'packages':['corechart']});
 	google.charts.setOnLoadCallback( async () =>
	{		
		console.log(x)
		var original = (x['output2']).reverse();
		var table = new google.visualization.DataTable();
		var options = {
			colors : ['#bb3322'],
			backgroundColor :  '#232326',
			displayRangeSelector : false,
			displayZoomButtons : false,
			hAxis : {
				textPosition : 'none'
			},
			vAxis : {
				textPosition : 'out',
				textStyle : {
					color : '#ccc'
				},
				gridlines : {
					count : 0
				}
			},
			legend : {
				position : 'none'
			},
			width : 900,
			height : 400,
			lineWidth : 5
		}

		var row = [];
		var keys = Object.keys(original);
		
		options['colors'] = []
		options['colors'].push(original[0]['ovrs_nmix_hgpr'] > original[keys.length-1]['ovrs_nmix_hgpr'] ? '#3344bb' : '#bb3322');
		
		for (i = 0; i < keys.length; i++)
		{
			row.push([original[i]['stck_bsop_date'], Number(original[i]['ovrs_nmix_hgpr']) ]);
		}
		table.addColumn('string', 'Date');
		table.addColumn('number', 'Price');
		table.addRows(row);

		var chart = new google.visualization.LineChart(document.getElementById('exchange_chart'));
		chart.draw(table, options);
	});
}

