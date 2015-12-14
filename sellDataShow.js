/* global $ */
/* global requirejs */

var getRequest = function (url, param) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			type: param.type,
			url: url,
			data: param.data || {},
			beforeSend: function (req) {
				req.setRequestHeader('auth', "TTTT");
			},
			success: function (data) {
				resolve(data);
			},
			error: reject,
		});
	});
};

var getAndShow = function () {
	getRequest('/api/selldata', { type: 'get' }).then(
		function (aStr) {
			var array = JSON.parse(aStr);
			var reqLst = [];
			var valueLst = [];
			array.map(function (item) {
				reqLst.push(getRequest('/api/selldata', { type: 'get', data: { colName: item } }));
			});
			Promise.all(reqLst).then(function (datas) {
				var detailDatas = [];
				var ndatas = datas.map(function (dataStr) {
					var data = JSON.parse(dataStr);
					var obj = {};
					var detailLst = [];
					var retLst = [];
					data.map(function (item) {
						obj[item[2]] = obj[item[2]] || 0;
						obj[item[2]] += parseFloat(item[1]);
						detailLst.push({
							name: item[0] + '市',
							value: item[1]
						});
					});
					for (var key in obj) {
						retLst.push({
							name: key,
							value: obj[key],
						});
						valueLst.push(obj[key]);
					}
					detailDatas.push(detailLst);
					return retLst;
				});
				valueLst.sort(function (a, b) {
					return a - b;
				});
				var span = Math.floor(valueLst.length / 5);
				var splitList = [valueLst[span], valueLst[span * 2], valueLst[span * 3], valueLst[span * 4]];
				updateChart(array, ndatas, splitList, detailDatas);
			});
		}
		);
};

$(document).ready(
	function () {
		if (typeof Promise === 'undefined') {
            require(['es6-promise-2.0.0.min'], function (es6) {
                Promise = es6.Promise;
				getAndShow();
            });
        } else {
			getAndShow();
		}
	}
	);

var updateChart = function (timeData, showDatas, range, detailDatas) {
	requirejs(['echarts/echarts', 'echarts/chart/map'], function (echarts) {
		// 基于准备好的dom，初始化echarts图表
		var myChart = echarts.init(document.getElementById('main'));
		var option = {
			timeline: {
				x: '0%',
				y: '85%',
				x2: '15%',
				data: timeData.map(function (s) { return '2014-' + s + '-01'; }),
				label: {
					formatter: function (s) {
						return s.slice(5, 7);
					}
				},
				autoPlay: true,
				playInterval: 3000
			},
			options: [
				{
					title: {
						'text': 'Sell Data for ' + timeData[0],
						'subtext': 'Data from the server side'
					},
					tooltip: { 'trigger': 'item' },
					animation: false,
					toolbox: {
						'show': true,
						'feature': {
							'restore': { 'show': true },
							'saveAsImage': { 'show': true }
						}
					},
					dataRange: {
						splitList: (function () {
							return [{ start: range[3] },
								{ start: range[2], end: range[3] },
								{ start: range[1], end: range[2] },
								{ start: range[0], end: range[1] },
								{ end: range[0] }
							];
						})(),
						text: ['High', 'Low'],           // 文本，默认为数值文本
						x: 'left',
						y: '50%',
						color: ['orangered', 'yellow', 'lightskyblue']
					},
					series: [
						{
							'name': 'SellData',
							'type': 'map',
							selectedMode: 'single',
							mapLocation: {
								x: '0%',
								y: 'top',
								height: '85%',
							},
							itemStyle: {
								emphasis: {
									color: '#e800a4'
								}
							},
							'data': showDatas[0]
						},
						{
							'show': 'false',
							'name': 'Total',
							'type': 'map',
							mapType: '上海',
							mapLocation: {
								x: '80%',
								y: '35%',
								height: '30%',
							},
							itemStyle: {
								emphasis: {
									color: '#e800a4'
								}
							},
							'data': detailDatas[0]
						}
					]
				}
			],
		};
		for (var i = 1; i < timeData.length; i++) {
			option.options.push({
				title: { text: 'Sell Data for ' + timeData[i] },
				series: [{
					data: showDatas[i],
				},
					{
						data: detailDatas[i]
					}],
			});
		}
		console.log(option);
		myChart.setOption(option, true);

		var ecConfig = require('echarts/config');
		myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param) {
			var selectedProvince = param.target;

			for (var o in option.options) {
				option.options[o].series[1].mapType = selectedProvince;
			}
			myChart.setOption(option);
		});
	});
};