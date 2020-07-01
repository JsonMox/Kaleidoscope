var $SIASUN = (function () {
    var bootstrapTable_default = {
        method: 'get',
        striped: true,
        cache: false,
        pagination: true,
        sortable: false,
        sidePagination: "server",
        pageNumber: 1,
        pageSize: 10,
        pageList: [5, 10, 25, 50, 100],
        strictSearch: true,
        showColumns: false,
        minimumCountColumns: 2,
        clickToSelect: true,
        uniqueId: "ID",
        cardView: false,
        detailView: false,
        smartDisplay: false,
        queryParams: function (params) {
            return {
                pageSize: params.limit,
                pageNum: params.offset / params.limit + 1
            };
        }
    };
	var colors = ['#5793f3', '#d14a61', '#675bba'];
	var line_echarts_default = {
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				params = params[0];
				var date = new Date(params.name);
				return  "<p>" + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + "  " + 
						date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +"   " + 
					    params.value[1] + "人次" + "</p>";
			},
			axisPointer: {
				animation: false,
			}
		},
		color: colors,
		legend: {
        data:[]
		},
		xAxis: {
			type: 'time',
			axisPointer: {
				snap: true
			},
			splitLine: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%'],
			splitLine: {
				show: false
			},
			min: function (value) {
				return value.min;
			},
			max: function (value) {
				return value.max*1.3;
			}
		},
		series: [{
			name: '',
			type: 'line',
			showSymbol: true,
			hoverAnimation: true
		},
		{
			name:'',
			type:'line', 
			showSymbol:true,
			hoverAnimation: true
		}]
	};
	
	var board_echarts_default = {
		tooltip : {
			formatter: "{a} <br/>{b} : {c}%"
		},
		toolbox: {
			feature: {
				restore: {},
				saveAsImage: {}
			}
		},
		series : [{
            name: '速度',
            type: 'gauge',
            z: 3,
            min: 0,
            max: 220,
            splitNumber: 11,
            radius: '50%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222'
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic'
            },
            detail : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                formatter: function (value) {
                    value = (value + '').split('.');
                    value.length < 2 && (value.push('00'));
                    return ('00' + value[0]).slice(-2)
                        + '.' + (value[1] + '00').slice(0, 2);
                },
                fontWeight: 'bolder',
                borderRadius: 3,
                backgroundColor: '#444',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 100,
                color: '#eee',
                rich: {}
            }
        }]
	}

    function _initTable(id, settings) {
        var params = $.extend({}, bootstrapTable_default, settings);
        if (typeof params.url === 'undefined') {
            throw '初始化表格失败，请配置url参数！';
        }
        if (typeof params.columns === 'undefined') {
            throw '初始化表格失败，请配置columns参数！';
        }
        $('#' + id).bootstrapTable(params);
        $("body").on("click", "[data-table-action]", function (a) {
            a.preventDefault();
            var b = $(this).data("table-action");
            if ("excel" === b && $(this).closest(".dataTables_wrapper").find(".buttons-excel").trigger("click"), "csv" === b && $(this).closest(".dataTables_wrapper").find(".buttons-csv").trigger("click"), "print" === b && $(this).closest(".dataTables_wrapper").find(".buttons-print").trigger("click"), "fullscreen" === b) {
                var c = $(this).closest(".card");
                c.hasClass("card--fullscreen") ? (c.removeClass("card--fullscreen"), $("body").removeClass("data-table-toggled")) : (c.addClass("card--fullscreen"), $("body").addClass("data-table-toggled"))
            }
        })
    }
	
	function _initLineCharts(id, settings){
		var option = $.extend({},line_echarts_default,settings);
		if (typeof option.series === 'undefined') {
            throw '初始化图形失败，请配置series参数！';
        }
		var chart = echarts.init(document.getElementById(id));
		chart.setOption(option);
		
		return chart;
	}
	
	function _initBoardChart(id,settings){
		var option = $.extend({},board_echarts_default,settings);
		if (typeof option.series === 'undefined') {
            throw '初始化图形失败，请配置series参数！';
        }
		var chart = echarts.init(document.getElementById(id));
		chart.setOption(option);
		
		return chart;
	}

    function _notify(message, type) {
        $.notify({
            icon: "fa fa-check",
            title: "",
            message: message,
            url: ''
        }, {
            element: 'body',
            type: type,
            allow_dismiss: true,
            placement: {
                from: "top",
                align: "center"
            },
            offset: {
                x: 20,
                y: 20
            },
            spacing: 10,
            z_index: 3001,
            delay: 2500,
            timer: 1000,
            url_target: '_blank',
            mouse_over: false,
            animate: {
                enter: "animated fadeInDown",
                exit: "animated fadeOutUp"
            },
            template: '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message" style="font-weight: 600">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close"><span style="background-color: rgba(255,255,255,.2);line-height: 19px;height: 20px;width: 20px;border-radius: 50%;font-size: 1.1rem;display: block;" aria-hidden="true">×</span></button>' +
            '</div>'
        });
    }

    function _closeModal(modalId) {
        $("#" + modalId).find("button.btn-hide").attr("data-dismiss", "modal").trigger('click');
    }

    function _closeAndRestModal(modalId) {
        var $modal = $("#" + modalId);
        $modal.find("button.btn-hide").attr("data-dismiss", "modal").trigger('click');
        $modal.find("form")[0].reset();
    }

    function _confirm(settings, callback) {
        swal({
            text: settings.text,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: settings.confirmButtonText,
            cancelButtonText: "取消",
            allowOutsideClick: false,
            allowEscapeKey: false,
            animation: false
        }).then(callback);
    }
    
    return {
		initLineChart: function(id, setting) {
			return _initLineCharts(id, setting);
		},
		initBoardChart: function(id,setting) {
			return _initBoardChart(id, setting);
		},
        initTable: function (id, setting) {
            _initTable(id, setting);
        },
        refreshTable: function (id) {
            $('#' + id).bootstrapTable('refresh');
        },
        n_default: function (message) {
            _notify(message, "inverse");
        },
        n_info: function (message) {
            _notify(message, "info");
        },
        n_success: function (message) {
            _notify(message, "success");
        },
        n_warning: function (message) {
            _notify(message, "warning");
        },
        n_danger: function (message) {
            _notify(message, "danger");
        },
        closeModal: function (modalId) {
            _closeModal(modalId);
        },
        closeAndRestModal: function (modalId) {
            _closeAndRestModal(modalId);
        },
        confirm: function (settings, callback) {
            _confirm(settings, callback);
        }
    }
})($);
