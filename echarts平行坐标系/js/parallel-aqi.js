$(function () {
	loadData();
});

function loadData() {
	var dom = document.getElementById("container");
	var myChart = echarts.init(dom);
	var app = {};
	option = null;

	var ws = new WebSocket("ws://localhost:8088/parallel");

	ws.onopen = () => {
		console.log("已建立链接...");
	};

	ws.onmessage = (r) => {
		let obj = JSON.parse(r.data);
		debugger
		// var dataWKS = obj.dataWKS;
		console.log(obj.dataWKS);
		var dataSVR = obj.dataSVR;
		var dataFEP = obj.dataFEP;

		var dataWKS = [[5,42,24,44,0.76,40,16],
		[6,82,58,90,1.77,68,33],
		[7,74,49,77,1.46,48,27]];
		var schema = [{
				name: 'date',
				index: 0,
				text: '日期'
			},
			{
				name: 'mysql',
				index: 1,
				text: 'mysql'
			},
			{
				name: 'redis',
				index: 2,
				text: 'rdis'
			},
			{
				name: 'wincc',
				index: 3,
				text: 'wincc'
			},
			{
				name: 'oracle',
				index: 4,
				text: 'oracle'
			},
			{
				name: 'system',
				index: 5,
				text: 'system'
			},
			{
				name: 'addition',
				index: 6,
				text: 'addition'
			}
			/* ,
						{
							name: '内存使用率',
							index: 7,
							text: '内存使用率'
						} */
		];

		var lineStyle = {
			normal: {
				width: 1,
				opacity: 0.5
			}
		};

		option = {
			backgroundColor: '#333',
			legend: {
				bottom: 30, //距离容器的bottom 30px
				data: ['工作站', '服务器', 'FEP'],
				itemGap: 20, //图例每项之间的间隔，横向或纵向
				textStyle: {
					color: '#fff', //图例的文字颜色
					fontSize: 14 //图例的文字大小
				}
			},
			tooltip: {
				padding: 10,
				backgroundColor: '#222',
				borderColor: '#777',
				borderWidth: 1,
				formatter: function (obj) {
					var value = obj[0].value;
					return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
						obj[0].seriesName + ' ' + value[0] + '日期：' +
						value[7] +
						'</div>' +
						schema[1].text + '：' + value[1] + '<br>' +
						schema[2].text + '：' + value[2] + '<br>' +
						schema[3].text + '：' + value[3] + '<br>' +
						schema[4].text + '：' + value[4] + '<br>' +
						schema[5].text + '：' + value[5] + '<br>' +
						schema[6].text + '：' + value[6] + '<br>';
				}
			},
			// dataZoom: {
			//     show: true,
			//     orient: 'vertical',
			//     parallelAxisIndex: [0]
			// },
			parallelAxis: [{
					dim: 0,
					name: schema[0].text,
					inverse: true,
					max: 31,
					nameLocation: 'start'
				},
				{
					dim: 1,
					name: schema[1].text
				},
				{
					dim: 2,
					name: schema[2].text
				},
				{
					dim: 3,
					name: schema[3].text
				},
				{
					dim: 4,
					name: schema[4].text
				},
				{
					dim: 5,
					name: schema[5].text
				},
				{
					dim: 6,
					name: schema[6].text
				}
				/* ,
								{
									dim: 7,
									name: schema[7].text,
									type: 'category',
									data: ['优', '良', '轻度', '中度', '重度', '严重']
								} */
			],
			visualMap: {
				show: true,
				min: 0,
				max: 150,
				dimension: 2,
				inRange: {
					color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
					// colorAlpha: [0, 1]
				}
			},
			parallel: {
				left: '5%',
				right: '18%',
				bottom: 100,
				parallelAxisDefault: {
					type: 'value',
					name: 'AQI指数',
					nameLocation: 'end',
					nameGap: 20,
					nameTextStyle: {
						color: '#fff',
						fontSize: 12
					},
					axisLine: {
						lineStyle: {
							color: '#aaa'
						}
					},
					axisTick: {
						lineStyle: {
							color: '#777'
						}
					},
					splitLine: {
						show: false
					},
					axisLabel: {
						color: '#fff'
					}
				}
			},
			series: [{
					name: '工作站',
					type: 'parallel',
					lineStyle: lineStyle,
					data: dataWKS
				},
				{
					name: '服务器',
					type: 'parallel',
					lineStyle: lineStyle,
					data: dataSVR
				},
				{
					name: 'FEP',
					type: 'parallel',
					lineStyle: lineStyle,
					data: dataFEP
				}
			]
		};;
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}

	};
}