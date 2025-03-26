ShowInfo = async (x, type = "", d="d") => {
	//검색 창 끔
	ContextSwitch('.stock_info')	
	//내용 초기화
	$('.stock_info').html('');
	var html = '';
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
				describe : "표면이율",
				value :  Math.round(object[0]["basicInfo"]["srfc_inrt"] * 10) / 10 + ' %'
			},
			2 : {
				describe : "신용등급",
				value : object[0]["basicInfo"]["kis_crdt_grad_text"]
			},
			3 : {
				describe : "발행가",
				value : object[0]["basicInfo"]["issu_amt"]
			},
			4 : {
				describe : "액면가",
				value : object[0]["basicInfo"]["papr"]
			},
			5 : {
				describe : "이자 선후급 유형",
				value : object[0]["basicInfo"]["int_anap_dvsn_cd"]
			},
			6 : {
				describe : "액면가",
				value : object[0]["basicInfo"]["papr"]
			},
			7 : {
				describe : "상장일자",
				value : `${(object[0]["basicInfo"]["lstg_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')}`
			},
			8 : {
				describe : "만기일자",
				value : (object[0]["basicInfo"]["expd_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			9 : {
				describe : "직전 이자지급일자",
				value : object[0]["basicInfo"]["rgbf_int_dfrm_dt"] == 0 ? " - " : (object[0]["basicInfo"]["rgbf_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			10 : {
				describe : "차기 이자지급일자",
				value : object[0]["basicInfo"]["nxtm_int_dfrm_dt"] == 0 ? " - " : (object[0]["basicInfo"]["nxtm_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			},
			11 : {
				describe : "최초 이자지급일자",
				value : object[0]["basicInfo"]["frst_int_dfrm_dt"] == 0 ? " - " :  (object[0]["basicInfo"]["frst_int_dfrm_dt"] + "").replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
			}
		};

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

	$('.stock_info').html(html);
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
				`https://lawsuit3310.run.goorm.io/Stock/DailyPrice?ticker=${x}&type=${d}`]
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
		var original = (object[object.length-1]).reverse();
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
		options['colors'].push(original[0]['stck_hgpr'] > original[keys.length-1]['stck_hgpr'] ? '#3344bb' : '#bb3322');
		
		for (i = 0; i < keys.length; i++)
		{
			row.push([original[i]['stck_bsop_date'], Number(original[i]['stck_hgpr']) ]);
		}
		table.addColumn('string', 'Date');
		table.addColumn('number', 'Price');
		table.addRows(row);

		var chart = new google.visualization.LineChart(document.getElementById('info_chart'));
		chart.draw(table, options);
	});
}

async function ChangeChart(x, type, d)
{
	DrawChartInfo(await GetDataInfo(x, type, d));
}