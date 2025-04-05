async function GetChartDataSet(market)
{
	const Http = new XMLHttpRequest();
	const url = `https://lawsuit3310.run.goorm.io/Stock/MarketIndex?market=${market}`;

	response = await fetch(url);
	jobject = await response.json();
	
	return jobject;
}

//차트 속성 참고 https://developers.google.com/apps-script/chart-configuration-options?hl=ko

document.addEventListener('DOMContentLoaded', () => {
	google.charts.load('current', {packages: ['corechart']});
	google.charts.setOnLoadCallback( async () => {
		
		var options = {
			colors : ['#bb3322'],
			backgroundColor :  'none',
			displayRangeSelector : false,
			displayZoomButtons : false,
			hAxis : {
				textPosition : 'none'
			},
			vAxis : {
				textPosition : 'out',
				gridlines : {
					count : 0
				}
			},
			legend : {
				position : 'none'
			},
			lineWidth : 5
		}
		
		var market_index_data = [];
		
		//KOSPI =====================================
		var market_index_1y = await GetChartDataSet('KOSPI');
	
		var array = [];
		var label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['bstp_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_kospi = new google.visualization.DataTable();
		data_kospi.addColumn('string', 'Date');
		data_kospi.addColumn('number', 'KOSPI');
		data_kospi.addRows(array);

		// Instantiate and draw the chart.
		var chart_kospi = new google.visualization.LineChart(document.getElementById('KOSPI'));
		chart_kospi.draw(data_kospi, options);
		
		market_index_data.push(market_index_1y);
		
		//KOSDAQ =====================================
		
		var market_index_1y = await GetChartDataSet('KOSDAQ');
	
		array = [];
		label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['bstp_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_kosdaq = new google.visualization.DataTable();
		data_kosdaq.addColumn('string', 'Date');
		data_kosdaq.addColumn('number', 'KOSDAQ');
		data_kosdaq.addRows(array);

		// Instantiate and draw the chart.
		var chart_kosdaq = new google.visualization.LineChart(document.getElementById('KOSDAQ'));
		chart_kosdaq.draw(data_kosdaq, options);
		
		market_index_data.push(market_index_1y);
		
		//NASDAQ =====================================
		
		var market_index_1y = await GetChartDataSet('NASDAQ');
		array = [];
		label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['ovrs_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_ndaq = new google.visualization.DataTable();
		data_ndaq.addColumn('string', 'Date');
		data_ndaq.addColumn('number', 'NASDAQ');
		data_ndaq.addRows(array);

		// Instantiate and draw the chart.
		var chart_ndaq = new google.visualization.LineChart(document.getElementById('NASDAQ'));
		chart_ndaq.draw(data_ndaq, options);
		
		market_index_data.push(market_index_1y);
		
		//DAW JONES =====================================
		
		var market_index_1y = await GetChartDataSet('DJI');
		array = [];
		label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['ovrs_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_dji = new google.visualization.DataTable();
		data_dji.addColumn('string', 'Date');
		data_dji.addColumn('number', 'DAW JONES');
		data_dji.addRows(array);

		// Instantiate and draw the chart.
		var chart_dji = new google.visualization.LineChart(document.getElementById('DJI'));
		chart_dji.draw(data_dji, options);
		
		market_index_data.push(market_index_1y);
		
		// S&P 500 =====================================
		
		var market_index_1y = await GetChartDataSet('SPX');
		array = [];
		label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['ovrs_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_spx = new google.visualization.DataTable();
		data_spx.addColumn('string', 'Date');
		data_spx.addColumn('number', 'S&P 500');
		data_spx.addRows(array);

		// Instantiate and draw the chart.
		var chart_spx = new google.visualization.LineChart(document.getElementById('SPX'));
		chart_spx.draw(data_spx, options);
		
		market_index_data.push(market_index_1y);
		
		// Nikkei =====================================
		
		var market_index_1y = await GetChartDataSet('Nikkei');
		array = [];
		label_set = [];

		for (x = 0 ; x < 51; x++)
		{
			array.push([market_index_1y['output2'][x]['stck_bsop_date'], Math.round(market_index_1y['output2'][x]['ovrs_nmix_prpr'])])
		}
		array = array.reverse();
		
		options['colors'] = []
		options['colors'].push(market_index_1y['output2'][0]['bstp_nmix_prpr'] < market_index_1y['output2'][51]['bstp_nmix_prpr'] ? '#3344bb' : '#bb3322');
		
		var data_nikkei = new google.visualization.DataTable();
		data_nikkei.addColumn('string', 'Date');
		data_nikkei.addColumn('number', 'NIKKEI 225');
		data_nikkei.addRows(array);

		// Instantiate and draw the chart.
		var chart_nikkei = new google.visualization.LineChart(document.getElementById('NIKKEI'));
		chart_nikkei.draw(data_nikkei, options);
		
		market_index_data.push(market_index_1y);
		
		var charts = $('.charts > .chart_wrapper > div');
		
		for (var i = 0; i < charts.length; i++)
		{
			var chart = $(`#${ charts[i].id}`);
			chart.attr('value', i);
			
			chart.on('click', x => {
				var index = $(`#${x.currentTarget.id}`).attr('value');
				switch (Number(index))
				{
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:;
						ShowMarketIndex(market_index_data[index], `${x.currentTarget.id}`);
						break;
				}
			});
		}

		$('.content').css("height", "100%") 
		setTimeout( () =>
		{
			$('.content').css("height", "auto");
			$('.content').css("min-height", "1000px");
		}, 1510)
	});
});

function ShowMarketIndex(market_index_data, market_index)
{
	ContextSwitch('.stock_info_group')
	ShowPage(0, '.stock_info_group')
	$('.stock_1').html('');
		
	var market_index_info = market_index_data['output1'];
	var table_data = [];
	var max = 0; var min = 999999;
	var color = 'grey'; var vrss = "-";
	
	var html = '';
	
	console.log(market_index_info);
	
	html = '<div class = "info_wrapper">';
	html += `<div class = "title"><span style = " font-size : 1.25em">${market_index_info["hts_kor_isnm"] == null ? market_index : market_index_info["hts_kor_isnm"]}</span><span class = "industry">지수</span></div>`;

	html += '<div ID = "info_chart" class = "info_chart"></div>'
		
	market_index_data = market_index_data['output2'];
	
	switch (market_index)
	{
		case 'KOSPI':
		case 'KOSDAQ':
		case 'KOSPI200':
			for (var x = 0 ; x < 53; x++)
			{
				table_data.push([market_index_data[x]['stck_bsop_date'], Math.round(market_index_data[x]['bstp_nmix_prpr'])])
			}
			for (var i = 0 ; i < table_data.length; i++)
			{
				max = max < market_index_data[i]['bstp_nmix_prpr'] ? market_index_data[i]['bstp_nmix_prpr'] : max;
				min = min > market_index_data[i]['bstp_nmix_prpr'] ? market_index_data[i]['bstp_nmix_prpr'] : min;
			}
			color = market_index_info['bstp_nmix_prdy_vrss'] > 0 ? "#bb3322" : market_index_info['bstp_nmix_prdy_vrss'] == 0 ? "grey" : "#3344cc";
			vrss = market_index_info['bstp_nmix_prdy_vrss'] > 0 ? " ▲ " : market_index_info['bstp_nmix_prdy_vrss'] == 0 ? "-" : " ▼ ";
			break;
		default:
			for (var i = 0; i < market_index_data.length; i++)
			{
				table_data.push([market_index_data[i]['stck_bsop_date'],Number(market_index_data[i]['ovrs_nmix_prpr'])]);
			}			
			for (var i = 0 ; i < table_data.length; i++)
			{
				max = max < market_index_data[i]['ovrs_nmix_prpr'] ? market_index_data[i]['ovrs_nmix_prpr'] : max;
				min = min > market_index_data[i]['ovrs_nmix_prpr'] ? market_index_data[i]['ovrs_nmix_prpr'] : min;
			}
			
			color = market_index_info['ovrs_nmix_prdy_vrss'] > 0 ? "#bb3322" : market_index_info['ovrs_nmix_prdy_vrss'] == 0 ? "grey" : "#3344cc";
			vrss = market_index_info['ovrs_nmix_prdy_vrss'] > 0 ? " ▲ " : market_index_info['ovrs_nmix_prdy_vrss'] == 0 ? "-" : " ▼ ";
			break;
	}
	
	var data = {
			0 : {
				describe : "현재치",
				value :(market_index_info['bstp_nmix_prpr'] == null ? market_index_info['ovrs_nmix_prpr'] : market_index_info['bstp_nmix_prpr'])
			},
			1 : {
				describe : "연중 최고치",
				value :  max
			},
			2 : {
				describe : "연중 최저치",
				value :  min
			},
			3 : {
				describe : '1일 거래량 <span style = "font-size : 0.8em">(천주)</span>',
				value :  market_index_info['acml_vol'] 
			}
		};
	
		if (market_index == "KOSPI" || market_index == "KOSPI200" || market_index == "KOSDAQ") 
		{
			var length =  Object.keys(data).length;
			data[length] = {
				describe : '전일 거래량 <span style = "font-size : 0.8em">(천주)</span>',
				value : market_index_info['prdy_vol'] 
			};
			data[length + 1] = {
				describe : '1일 거래대금 <span style = "font-size : 0.8em">(백만)</span>',
				value : market_index_info['acml_tr_pbmn'] 
			};
			data[length + 2] = {
				describe : '전일 거래대금 <span style = "font-size : 0.8em">(백만)</span>',
				value : market_index_info['prdy_tr_pbmn'] 
			};
			
		}
		else
		{
			var length =  Object.keys(data).length;
			data[length] = {
				describe : '',
				value : '' 
			};
		}
	

		var keys = Object.keys(data);

		html += "<table><tbody>"
		html += '<tr>'
		html += `<th>${data[0]["describe"]}</th>`
		html += `<td></td>`
		d = Number(data[0]["value"]);
		html += `<td class = "number info_${0}">${!isNaN(d) && d != "" ? d.toLocaleString() : data[0]["value"]}</td>`
		html += `<td class = "number info_${0}" style = "color : ${ color }"> ${vrss} ${market_index_info['ovrs_nmix_prdy_vrss'] != null ? market_index_info['ovrs_nmix_prdy_vrss'] : market_index_info['bstp_nmix_prdy_vrss']}</td>`
		html += '</tr>'
		html += "</tbody></table>"
	
		for (i = 1; i < keys.length; i++)
		{
			html += "<table><tbody>"
			html += '<tr>'
			html += `<th>${data[i]["describe"]}</th>`
			html += `<td></td>`
			d = Number(data[i]["value"]);
			html += `<td class = "number info_${i}" >${!isNaN(d) && d != "" ? d.toLocaleString() : data[i]["value"]}</td>`
			html += '</tr>'
			html += "</tbody></table>"
		}

		html += "</div>"
	
	html += '</div>';
	
	$('.stock_1').html(html);
	
	DrawChartMarketIndex(table_data, market_index);
}

function DrawChartMarketIndex(table_data, market_index)
{
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
		animation : {
			duration : 500,
			startup : true,
			easing : 'out'
		},
		width : 900,
		height : 400,
		lineWidth : 5
	}
	
	table_data = table_data.reverse();
	
	var row = [];
	var keys = Object.keys(table_data);

	options['colors'] = []
	options['colors'].push(table_data[0][1] > table_data[keys.length-1][1] ? '#3344bb' : '#bb3322');

	for (i = 0; i < keys.length; i++)
	{
		row.push([table_data[i][0], 1]);
	}
	table.addColumn('string', 'Date');
	table.addColumn('number', 'Price');
	table.addRows(row);

	var chart = new google.visualization.LineChart(document.getElementById('info_chart'));
	chart.draw(table, options);
	setTimeout (() => {

		for (i = 0; i < keys.length; i++)
		{
			table.setValue(i, 1, Number(table_data[i][1]));
		}
		chart.draw(table, options);
	}, 200)
}
