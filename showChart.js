
$(document).ready(function(){
	var canvas = $('#MyChart');
	$('#barchartdiv').append(canvas);
	ctx = canvas[0].getContext('2d');
	canvas.attr({width:800, height:600, style:"width:400px; height:300px"});

	$.ajax({
		type: 'get',
		url: '/api/data',
		beforeSend: function(req){
			req.setRequestHeader('auth', "CSDSEW0");
		},
		success : function(data){
			var obj = JSON.parse(data);
			var nchart = new Chart(ctx).Bar(obj, {
				responsive: false
			});

		}
	});
});

var ChangeData = function(){
	$.ajax({
		type: 'get',
		url: '/api/newdata',
		beforeSend: function(req){
			req.setRequestHeader('auth', "CSDSEW0");
		},
		success : function(data){
			var obj = JSON.parse(data);
			var nchart = new Chart(ctx).Bar(obj, {
				responsive: false
			});

		}
	});
}