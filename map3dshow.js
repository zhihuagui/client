
require.config({
packages: [
    {
        name: 'qtek',
        location: 'qtek/src',
        main: 'qtek.amd'
    },
    {
        name: 'echarts',
        location: 'echarts-2.2.7/src',
        main: 'echarts'
    },
    {
        name: 'zrender',
        location: 'zrender-2.1.0/src',
        main: 'zrender'
    },
    {
        name: 'echarts-x',
        location: 'echarts-x-master/src',
        main: 'echarts-x'
    }
]
});

$(document).ready(
	function(){
        var resizeMainDiv = function(){
            $('#main').height($(window).height()-100).width($(window).width()-100);
        };
        resizeMainDiv();
	    requirejs(['echarts/echarts',
			   'echarts/chart/map',
			   'echarts/chart/bar',
			   'echarts-x/echarts-x',
			   'echarts-x/chart/map3d'], function (ec) {
            var myChart = ec.init($('#main')[0]);
            mainFun(myChart);
            $(window).resize(function(){
                resizeMainDiv();
                myChart.resize();
            });
        });
    }
);

var mainFun = function(myChart){

myChart.showLoading();

$.ajax({
    url: './data/population.json',
    success: function (data) {
        var max = -Infinity;
        data = data.map(function (item) {
            max = Math.max(item[2], max);
            return {
                geoCoord: item.slice(0, 2),
                value: item[2]
            }
        });
        data.forEach(function (item) {
            item.barHeight = item.value / max * 50 + 0.1
        });

        myChart.setOption({
            title : {
                text: 'Gridded Population of the World (2000)',
                subtext: 'Data from Socioeconomic Data and Applications Center',
                sublink : 'http://sedac.ciesin.columbia.edu/data/set/gpw-v3-population-density/data-download#close',
                x:'center',
                y:'top',
                textStyle: {
                    color: 'white'
                }
            },
            tooltip: {
                formatter: '{b}'
            },
            dataRange: {
                min: 0,
                max: max,
                text:['High','Low'],
                realtime: false,
                calculable : true,
                color: ['red','yellow','lightskyblue']
            },
            series: [{
                type: 'map3d',
                mapType: 'world',
                baseLayer: {
                    backgroundColor: 'rgba(0, 150, 200, 0.5)'
                },
                data: [{}],
                hoverable: false,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            color: 'rgba(0, 150, 200, 0.8)'
                        },
                        borderColor: '#777'
                    }
                },
                markBar: {
                    barSize: 0.6,
                    data: data
                }
            }]
        });

        myChart.hideLoading();
    }
});
}