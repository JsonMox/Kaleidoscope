$(function(){
	var vm = new Vue({
		el: '#container',
		data: {
			items:[{
				title : '客流统计',
				sectionIn : 0,
				sectionOut: 0,
				totalIn : 0,
				totalOut: 0,
				region : 0,
				stayLow : 0,
				stayHig : 0,
				chart : [{chart_id : "section",
						 type : "day",
						 field : ""
						},
						{chart_id : "toltal",
						 type : "day",
						 field : ""
						},
						{chart_id : "Xsection",
						 type : "day",
						 field : ""
						},
						{chart_id : "Xtoltal",
						 type : "day",
						 field : ""
						}
				]
			}]
		}
	});	
	
	var rashTime = ""; //时间容器
	var watch;//获取当前时间
	var result;//strsplit函数的返回值
	var data = [];
	
	var lineValueObject1 = new Object();
	var lineValueObject2 = new Object();
	
	var ws = new WebSocket("ws://localhost:8088/passengerFlow");
	
	ws.onopen = function(){
		console.log('已创建连接');
		catch_time(); //获取时间
		ws.send(watch);
	};
	ws.onmessage = function(r){	
		var o = JSON.parse(r.data);
		vm.$data.items = o.items;
		var s_time = new Date();
		var c_time = new Date();
		
		s_time = o.items[0].e_time;//后台服务器传来时间
		strsplit(s_time);
		s_time = result; 
		if (rashTime == "") {
			rashTime = s_time;
		}
		if (rashTime < s_time) {
			window.location.reload();
		}	
		o.items.forEach(function(charts) {
			charts.chart.forEach(function(item) {
				var chartId = item.chart_id;
				var chart_title = item.id;
				var line1_name;
				var line2_name;
				var lineValueTemp1 = [];
				var lineValueTemp2 = [];
				var time1 = "00:00:00";
				var time2 = "00:50:00";
				
				var chart = $SIASUN.initLineChart( chartId, { title:{ text:chart_title } });
				
				if(item.field1 instanceof Array){
					item.field1.forEach(function(field) {
						var tempOftime = field.timer.split(" ")[1];
						var trans;
						if( time1 <= tempOftime && tempOftime <= time2 ){
							trans = { des : field.des, namer : field.timer, valuer : "0" };
						}else{
							trans = { des : field.des, namer : field.timer, valuer : field.value };
						}
						line1_name = trans.des;
						var obj = { name : trans.namer,  value : [ trans.namer, trans.valuer ] };

						lineValueTemp1.push( obj );
						if( lineValueObject1.hasOwnProperty(chartId) ){
								lineValueObject1[ chartId ].push( obj );
						}else{
							lineValueObject1[ chartId ] = lineValueTemp1;
						}

					})
				}else{
					var tempOftime = item.field1.timer.split(" ")[1];
					var trans;
					if( time1 <= tempOftime && tempOftime <= time2 ){
						trans = { des : item.field1.des, namer : item.field1.timer, valuer : "0" };
					}else{
						trans = { des : item.field1.des, namer : item.field1.timer, valuer : item.field1.value};
					}
					line1_name = trans.des;
					var obj = { name : trans.namer,  value : [ trans.namer, trans.valuer ] };

					lineValueTemp1.push( obj );
					if( lineValueObject1.hasOwnProperty(chartId) ){
							lineValueObject1[ chartId ].push( obj );
					}else{
						lineValueObject1[ chartId ] = lineValueTemp1;
					}
				}

				if (item.field2 instanceof Array){
					item.field2.forEach(function(field) {
						var tempOftime = field.timer.split(" ")[1];
						var trans;
						if( time1 < tempOftime && tempOftime < time2 ){
							trans = { des : field.des, namer : field.timer, valuer : "0" };
						}else{
							trans = { des : field.des, namer : field.timer, valuer : field.value };
						}
						line2_name = trans.des;
						var obj = { name : trans.namer,  value : [ trans.namer, trans.valuer ] };

						lineValueTemp2.push( obj );
						if( lineValueObject2.hasOwnProperty(chartId) ){
								lineValueObject2[ chartId ].push( obj );
						}else{
							lineValueObject2[ chartId ] = lineValueTemp2;
						}
					})
				} else {
					var tempOftime = item.field2.timer.split(" ")[1];
					var trans;
					if( time1 < tempOftime && tempOftime < time2 ){
						trans = { des : item.field2.des, namer : item.field2.timer, valuer : "0" };
					}else{
						trans = { des : item.field2.des, namer : item.field2.timer, valuer : item.field2.value};
					}
					line2_name = trans.des;
					var obj = { name : trans.namer,  value : [ trans.namer, trans.valuer ] };

					lineValueTemp2.push( obj );
					if ( lineValueObject2.hasOwnProperty(chartId) ){
							lineValueObject2[ chartId ].push( obj );
					} else {
						lineValueObject2[ chartId ] = lineValueTemp2;
					}
				}
				
				chart.setOption({
					legend: {
						data : [ line1_name, line2_name ],
					},
					series:[{
						name : line1_name,
						data : lineValueObject1[chartId]
					},
					{
						name : line2_name,
						data : lineValueObject2[chartId]
					}]
				});
				window.onresize = function (){
					chart.resize();
				}
			})
		})
	};
	var ser = new Vue({
		el: "#app",
		data: {
			counter: 0
		},
		methods: {
			limtSet: function() {
				var rush = "true";
				var wsd = new WebSocket("ws://localhost:8088/passengerFlow");
				wsd.onopen = function() {
					wsd.send(rush);
				}
			}
		}
	}) 
	//获取当前时间函数
	function catch_time() {		
		var date=new Date();	//年    
		var year=date.getFullYear();    //月    
		var month=date.getMonth()+1;    //日    
		var day=date.getDate();    //时    
		var hh=date.getHours();    //分    
		var mm=date.getMinutes();    //秒    
		var ss=date.getSeconds();    
		watch = year+"."+month+"."+day+" "+hh+":"+mm+":"+ss;
		return(watch);
	}
	//字符串截取函数
	function strsplit(str) {
		var a = str.split(" ");
		var b = a[0];
		var c = b.split(".");
		result = c[2];
		return(result);
	}
	//延时函数
	function sleep(n) {
		var start = new Date().getTime();
		while (true){
			 if (new Date().getTime() - start > n) {
				break;
			}
		}
	}
});