$(document).ready(function() {

	$(document).on("click", "#stop_get_busses", getUpcomingBusses);
});

function getUpcomingBusses() {

	var onestop_id = $("#select_stop option:selected").attr("data-id");

	$.get("https://transit.land/api/v1/onestop_id/" + onestop_id + "?rand=" + (new Date()).getTime(), function(data) {
		
		console.log(data, data['routes_serving_stop']);

		var str = "<h3>Busses by stop</h3>";
		str += "<ul class='list-group'>";
		for (var i in data['routes_serving_stop']) {
			str += "<li class='list-group-item'>" + data['routes_serving_stop'][i]['operator_name'];
			str += " - " + data['routes_serving_stop'][i]['route_name'];
			str += "<ul data-type = 'route_id' data-id = '" +  data['routes_serving_stop'][i]['route_onestop_id'] +  "'>";
			str += "</ul>";
			str += "</li>";
		}
		str += "</ul>";
		$("#upcoming_busses_list").html(str);

	});
	getStopSchedule();
}

function getStopSchedule() {

	var stop_id = $("#select_stop option:selected").attr("data-id");

	console.log("stop_id:", stop_id);

	$.get("https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + stop_id + "&rand=" + (new Date()).getTime(), function(data) {

		console.log("schedules_stop ", data);

		for (var i in data['schedule_stop_pairs']) {
			
			var str = "";
			str += "<li class='list-group-item'>";
			str += data['schedule_stop_pairs'][i]['origin_arrival_time'];
			str += "</li>";

			
			
			$("[data-type='route_id'][data-id='" + data['schedule_stop_pairs'][i]['route_onestop_id'] + "']").append(str);
		}
		
	});
	
}
