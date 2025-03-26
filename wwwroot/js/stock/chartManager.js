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
		
		//KOSPI =====================================
		var market_index_1y = await GetChartDataSet('KOSPI');
	
		array = [];
		label_set = [];

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
		
		$('.content').css("height", "100%") 
		setTimeout( () =>
	   {
			$('.content').css("height", "auto");
			$('.content').css("min-height", "1920px");
		}, 1510)
	});
});