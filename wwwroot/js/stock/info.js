function ShowPage(index, group)
{
	$(group).css("left",`-${index * 100}%`);
}

ShowInfo = async (x, type = "", d="d") => {
	//검색 창 끔
	ContextSwitch('.stock_info_group')
	ShowPage(0, '.stock_info_group')
	//내용 초기화
	$('.stock_info').html('');
	$('.footer').html('');
	
	var html = '';
	var html_footer = '';
	var object = await GetDataInfo(x, type, d);
	
	//종목 == 주식 or ETF
	if(object[0]['prdt_type_cd'] == 300)
	{
		var l = 1.2 - 0.05425 * object[0]["prdt_abrv_name"].length;
			l = l < 0.7 ? 0.7 : l;
		
		html = '<div class = "info_wrapper">';
		html = `<div class = "title"><span style = " font-size : ${l}em">${object[0]["prdt_abrv_name"]}</span><span class = "industry">${object[1]["bstp_kor_isnm"]}</span></div>`;
		
		html += '<div ID = "info_chart" class = "info_chart"></div>'
		html += `<div class = "chart_selector"><span onclick = "ChangeChart('${x}','${type}','d')" >2주</span>`+
			`<span onclick = "ChangeChart('${x}','${type}','w')" >3달</span><span onclick = "ChangeChart('${x}','${type}','m')" >1년</span>` +
			`<span onclick = "ChangeChart('${x}','${type}','y')" >5년</span></div>`
		
		html += "<table><tbody>"
		html += '<tr>'
		html += `<th>주가</th>`
		html += `<td class = "number">${Number(object[0]["thdt_clpr"]).toLocaleString()}</td>`
		html += `<td style= "color : ${(object[1]["prdy_vrss"]) > 0 ? '#bb3322' : (object[1]["prdy_vrss"]) == 0 ? 'grey' : '#3344bb' }" > ${(object[1]["prdy_vrss"]) > 0 ? '▲' : (object[1]["prdy_vrss"]) == 0 ? '- ' : '▼' } ${ Number(Math.abs(object[1]["prdy_vrss"])).toLocaleString()}</td>`
		html += '</tr>'
		html += "</tbody></table>"
		
		switch (object[0]['scty_grp_id_cd'])
		{
			case "ST":
				var data = {
					0 : {
						describe : "1년 최고가",
						value :  object[1]["w52_hgpr"]
					},
					1 : {
						describe : "1년 최저가",
						value :  object[1]["w52_lwpr"]
					},
					2 : {
						describe : "시가 총액",
						value : (object[0]["thdt_clpr"] * object[0]["lstg_stqt"]).toLocaleString() + " 원"
					},
					3 : {
						describe : "PER",
						value :  object[1]["per"]+ " 배"
					},
					4 : {
						describe : "PBR",
						value :  object[1]["pbr"]+ " 배"
					},
					5 : {
						describe : "ROE",
						value :  object[2][0] == null ? '-' : object[2][0]["roe_val"] + " %"
					},
					6 : {
						describe : "BPS",
						value :  Math.round(object[1]["bps"]).toLocaleString() + " 원"
					},
					7 : {
						describe : "EPS",
						value :  Math.round(object[1]["eps"]).toLocaleString() + " 원"
					},
					8 : {
						describe : "자산",
						value : object[3][0] == null ? '-' : Math.round(object[3][0]["total_aset"]).toLocaleString() + " 억"
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

				html += "</div>"
				break;
				
			case "EF":
				var data = {
					0 : {
						describe : "연중 최고가",
						value :  object[1]["stck_dryy_hgpr"]
					},
					1 : {
						describe : "연중 최저가",
						value :  object[1]["stck_dryy_lwpr"]
					},
					2 : {
						describe : "시가 총액",
						value : (object[0]["thdt_clpr"] * object[0]["lstg_stqt"]).toLocaleString() + " 원"
					},
					3 : {
						describe : "NAV",
						value : (object[1]["nav"]).toLocaleString() + " 원"
					},
					4 : {
						describe : "괴리율",
						value : (object[1]["dprt"]).toLocaleString() + " %"
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
					html += `<td class = "number info_${i}">${!isNaN(d) ? d.toLocaleString() : data[i]["value"]}</td>`
					html += '</tr>'
					html += "</tbody></table>"
				}

				html += "</div>"
				break;

		}
	}
	//종목 == 채권
	if(object[0]['prdt_type_cd'] == 302)
	{
		var l = 1.2 - 0.05425 * object[0]["basicInfo"]["prdt_abrv_name"].length;
			l = l < 0.7 ? 0.7 : l;
		
		var ind = '';
		switch(Number(object[0]["status"]["bond_int_dfrm_mthd_cd"]))
		{
			case 1:
				ind = '할인채';
				break;
			case 2:
				ind = '복리채';
				break;
			case 3:
			case 4:
			case 5:
				ind = '이표채';
				break;
			case 6:
				ind = '단리채';
				break;
			case 7:
				ind = '분할채';
				break;
			default:
				break;
		}
		
		html = '<div class = "info_wrapper">';	
		html = `<div class = "title"><span style = " font-size : ${l}em">${object[0]["basicInfo"]["prdt_abrv_name"]}</span><span class = "industry">${ind}</span></div>`;
	
		var data =
		{
			0 : {
				describe : "현재가",
				value :  (object[1]["bond_oprc"]).toLocaleString() + ' 원 ' +  `<span style= "color : ${(object[1]["bond_prdy_vrss"]) > 0 ? '#bb3322' : (object[1]["bond_prdy_vrss"]) == 0 ? 'grey' : '#3344bb' }" > `+
			` ${(object[1]["bond_prdy_vrss"]) > 0 ? ' ▲' : (object[1]["bond_prdy_vrss"]) == 0 ? ' - ' : ' ▼' } ${ Number(Math.abs(object[1]["bond_prdy_vrss"])).toLocaleString()}</span>`
			},
			1 : {
				describe : "만기",
				value :  new Date((object[0]["basicInfo"]["expd_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')).getFullYear() -
				new Date((object[0]["basicInfo"]["lstg_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')).getFullYear() + ' 년'
			},
			2 : {
				describe : "표면이율",
				value :  Math.round(object[0]["basicInfo"]["srfc_inrt"] * 10) / 10 + ' %'
			},
			3 : {
				describe : "신용등급",
				value : object[0]["basicInfo"]["kis_crdt_grad_text"]
			},
			4 : {
				describe : "발행가",
				value : object[0]["basicInfo"]["issu_amt"]
			},
			5 : {
				describe : "액면가",
				value : object[0]["basicInfo"]["papr"]
			},
			6 : {
				describe : "이자 선후급 유형",
				value : object[0]["basicInfo"]["int_anap_dvsn_cd"]
			},
			7 : {
				describe : "액면가",
				value : object[0]["basicInfo"]["papr"]
			},
			8 : {
				describe : "상장일자",
				value : `${(object[0]["basicInfo"]["lstg_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}`
			},
			9 : {
				describe : "만기일자",
				value : (object[0]["basicInfo"]["expd_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			10 : {
				describe : "직전 이자지급일자",
				value : object[0]["basicInfo"]["rgbf_int_dfrm_dt"] == 0 ? " - " : (object[0]["basicInfo"]["rgbf_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			11 : {
				describe : "차기 이자지급일자",
				value : object[0]["basicInfo"]["nxtm_int_dfrm_dt"] == 0 ? " - " : (object[0]["basicInfo"]["nxtm_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			12 : {
				describe : "최초 이자지급일자",
				value : object[0]["basicInfo"]["frst_int_dfrm_dt"] == 0 ? " - " :  (object[0]["basicInfo"]["frst_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			13 : {
				describe : "이자 (회당)",
				value : Math.round(object[0]["basicInfo"]["papr"] * object[0]["basicInfo"]["srfc_inrt"] / 100 / ( 12 / object[0]["basicInfo"]["int_dfrm_mcnt"]) * 10)/10 + " 원" 
			},
			14 : {
				describe : "",
				value : ""
			}
		};

		console.log( object[0]["basicInfo"]["int_dfrm_mcnt"])
		console.log( object[0]["basicInfo"])
		
		var keys = Object.keys(data);

		for (var i = 0; i < keys.length; i++)
		{
			html += "<table><tbody>"
			html += '<tr>'
			html += `<th>${data[i]["describe"]}</th>`
			html += `<td></td>`
			d = Number(data[i]["value"]);
			html += `<td class = "number info_${i}">${!isNaN(d) ? d.toLocaleString() : data[i]["value"]}</td>`
			html += '</tr>'
			html += "</tbody></table>"
		}

		html += "</div>"
	}
	
	html_footer+=`<div class = "span_wrapper" id = "span_0"><span>종목정보</span></div>`
	html_footer+=`<div class = "span_wrapper" id = "span_1"><span>차트</span></div>`
	html_footer+=`<div class = "span_wrapper" id = "span_2"><span>재무재표</span></div>`
	html_footer+=`<div class = "span_wrapper" id = "span_3"><span>현재 보유고</span></div>`
	html_footer+=`<div class = "span_wrapper" id = "span_4"><span>관련 기사</span></div>`

	$('.stock_info').html(html);
	$('.footer').html(html_footer);
	$('.footer').addClass('active');
	
	SetupCharts(object);
	
	
	$('#span_0').on('click', () => {
		ShowPage(0, '.stock_info_group')
	});
	$('#span_1').on('click', () => {
		ShowPage(1, '.stock_info_group')
	});
	$('#span_2').on('click', () => {
		ShowPage(2, '.stock_info_group')
	});
	$('#span_3').on('click', () => {
		ShowPage(3, '.stock_info_group')
	});
	$('#span_4').on('click', () => {
		ShowPage(4, '.stock_info_group')
	});
	
	DrawChartInfo(object);

};

async function GetDataInfo(x, type, d )
{
	const Http = new XMLHttpRequest();
	
	var url = new Array();
	var result = new Array();
	var object = new Array();
	
	if ((typeof x) == 'string' )
	{
		url =  [`https://lawsuit3310.run.goorm.io/Stock/Info?ticker=${x}&type=${type}`,
				`https://lawsuit3310.run.goorm.io/Stock/Price?ticker=${x}&type=${type}`,
				`https://lawsuit3310.run.goorm.io/Stock/FinancialRatio?ticker=${x}`,
				`https://lawsuit3310.run.goorm.io/Stock/BalanceSheet?ticker=${x}`,
				`https://lawsuit3310.run.goorm.io/Stock/DailyPrice?ticker=${x}&type=${d}`,
				`https://lawsuit3310.run.goorm.io/Stock/IncomeStatement?ticker=${x}`]
		
		//정보, 가격, 재무 비율, 대차대조표, 날짜별 가격, 손익 계산서 
	}
	else
	{
		url =  [`https://lawsuit3310.run.goorm.io/Stock/Info?ticker=${x['Ticker']}`,
				`https://lawsuit3310.run.goorm.io/Stock/Price?ticker=${x['Ticker']}`,
				`https://lawsuit3310.run.goorm.io/Stock/FinancialRatio?ticker=${x['Ticker']}`,
				`https://lawsuit3310.run.goorm.io/Stock/BalanceSheet?ticker=${x['Ticker']}`,
			   `https://lawsuit3310.run.goorm.io/Stock/DailyPrice?ticker=${x['Ticker']}`]
	}
	
	for (var i = 0 ; i < url.length; i++)
	{
		res = await fetch(url[i]);
		json = await res.json();
		result.push(json);
	}

	for (i = 0 ; i < result.length; i++)
	{
		obj = result[i]["output"];
		if(obj != null)
			object.push(obj);
		else
		{
			obj = result[i]["output2"];
			if(obj != null)
			object.push(obj);
		}
	}
	
	return object;
}

function DrawChartInfo (object)
{
	var char_div = document.getElementById('info_chart');
	if (char_div == null)
		return;
	
	google.charts.load('current', {'packages':['corechart']});
 	google.charts.setOnLoadCallback( async () =>
	{		
		var original = (object[object.length-2]).reverse();
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

		var row = [];
		var keys = Object.keys(original);
		
		options['colors'] = []
		options['colors'].push(original[0]['stck_hgpr'] > original[keys.length-1]['stck_hgpr'] ? '#3344bb' : '#bb3322');
		
		for (i = 0; i < keys.length; i++)
		{
			row.push([original[i]['stck_bsop_date'],1]);
		}
		table.addColumn('string', 'Date');
		table.addColumn('number', 'Price');
		table.addRows(row);

		var chart = new google.visualization.LineChart(document.getElementById('info_chart'));
		chart.draw(table, options);
		setTimeout (() => {
			
			for (i = 0; i < keys.length; i++)
			{
				table.setValue(i, 1, Number(original[i]['stck_hgpr']));
			}
			chart.draw(table, options);
			console.log(true);
		}, 200)
	});
}

async function ChangeChart(x, type, d)
{
	DrawChartInfo(await GetDataInfo(x, type, d));
}

function SetupCharts(object)
{
	var options = {
			colors : ['#706D54','#A08963','#C9B194'],
			chartArea: {width: '80%', height: '75%'},
		 	titlePosition: 'in', axisTitlesPosition: 'in',
			backgroundColor :  'none',
			displayRangeSelector : false,
			displayZoomButtons : false,
			hAxis : {
				showTextEvery: '1',
				textPosition : 'out',
				textStyle : {
					color : '#ccc'
				},
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
				position : 'top',
				alignment : 'end',
				textStyle : {
					color : '#ccc',
					fontSize : 32
				}
			},
			reverseCategories : true,
			width : 900,
			height : 400,
			lineWidth : 5,
		
		};
	
	$('.stock_charts').html("");
	var html = ""
	
	if(object[0]['prdt_type_cd'] == 300)
	{
		switch (object[0]['scty_grp_id_cd'])
		{
			case "ST":
				html += '<div class = "chart_wrapper"><div id = "stock_chart_1"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_2"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_3"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_4"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_5"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_6"></div></div>';
				html += '<div class = "chart_wrapper"><div id = "stock_chart_7"></div></div>';

				$('.stock_charts').html(html);

				//object[5] sale_account bsop_prti thtr_ntin

				var IncomeStatement = Object.keys(object[5]);
				var data_chart_1 = [["기준년월","매출","영업 이익","당기 순이익"]];
				var data_chart_2 = [["기준년월","매출 증가율 (%)"]];
				var data_chart_3 = [["기준년월","순이익 증가율 (%)"]];
				var data_chart_4 = [["기준년월","유보 비율"]];
				var data_chart_5 = [["기준년월","부채 비율"]];
				var data_chart_6 = [["기준년월","자산", "부채"]];

				for (var i = 0 ; i < IncomeStatement.length - 1; i++)
				{
					data_chart_1.push([object[5][i]["stac_yymm"], Number(object[5][i]["sale_account"]),
									   Number(object[5][i]["bsop_prti"]), Number(object[5][i]["thtr_ntin"] )]);
					data_chart_2.push([object[5][i]["stac_yymm"],Number(object[2][i]["grs"])]);
					data_chart_3.push([object[5][i]["stac_yymm"],Number(object[2][i]["ntin_inrt"])]);
					data_chart_4.push([object[5][i]["stac_yymm"],Number(object[2][i]["rsrv_rate"])]);
					data_chart_5.push([object[5][i]["stac_yymm"],Number(object[2][i]["lblt_rate"])]);
					data_chart_6.push([object[5][i]["stac_yymm"],Number(object[3][i]["total_aset"]),Number(object[3][i]["total_lblt"])]);
					if (i == 5) break;
				}

				console.log(object[2])

				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(()=>{
					var table_chart_1 = new google.visualization.arrayToDataTable(data_chart_1);
					var table_chart_2 = new google.visualization.arrayToDataTable(data_chart_2);
					var table_chart_3 = new google.visualization.arrayToDataTable(data_chart_3);
					var table_chart_4 = new google.visualization.arrayToDataTable(data_chart_4);
					var table_chart_5 = new google.visualization.arrayToDataTable(data_chart_5);
					var table_chart_6 = new google.visualization.arrayToDataTable(data_chart_6);

					var view_chart_1 = new google.visualization.DataView(table_chart_1);
					view_chart_1.setColumns([0,1,2,3]);
					var view_chart_6 = new google.visualization.DataView(table_chart_6);
					view_chart_6.setColumns([0,1,2]);

					var chart_1 = new google.visualization.ColumnChart(document.getElementById("stock_chart_1"));
					var chart_2 = new google.visualization.LineChart(document.getElementById("stock_chart_2"));
					var chart_3 = new google.visualization.LineChart(document.getElementById("stock_chart_3"));
					var chart_4 = new google.visualization.LineChart(document.getElementById("stock_chart_4"));
					var chart_5 = new google.visualization.LineChart(document.getElementById("stock_chart_5"));
					var chart_6 = new google.visualization.ColumnChart(document.getElementById("stock_chart_6"));

					chart_1.draw(view_chart_1, options);

					options['pointsVisible'] = true;
					options['pointSize'] = 10;

					chart_2.draw(table_chart_2, options);
					chart_3.draw(table_chart_3, options);
					chart_4.draw(table_chart_4, options);
					chart_5.draw(table_chart_5, options);

					options['pointsVisible'] = false;
					
					chart_6.draw(view_chart_6, options);
				});	
				break;
		}
		
	}
	
	
}