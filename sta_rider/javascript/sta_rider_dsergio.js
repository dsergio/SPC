$(document).ready(function() {

	$(document).on("click", "#stop_get_busses", getUpcomingBusses);
});

function getUpcomingBusses() {

	var onestop_id = $("#select_stop option:selected").attr("data-id");

	$.get("https://transit.land/api/v1/onestop_id/" + onestop_id + "?rand=" + (new Date()).getTime(), function(data) {
		
		console.log(data, data['routes_serving_stop']);

		var str = "<h3>Busses by stop</h3>";
		str += "<p>Current time: " + (new Date()).toLocaleTimeString() + "</p>";
		str += "<p>+/- 3 hours</p>";
		str += "<ul class='list-group' data-type = 'routes_list'>";
		for (var i in data['routes_serving_stop']) {
			str += "<li class='list-group-item'>" + data['routes_serving_stop'][i]['operator_name'];
			str += " - " + data['routes_serving_stop'][i]['route_name'];
			str += "<ul data-type = 'route_id' data-id = '" +  data['routes_serving_stop'][i]['route_onestop_id'] +  "'";
			str += "  data-stop-id = '" +  data['onestop_id'] + "'>";
			str += "</ul>";
			str += "</li>";
		}
		str += "</ul>";
		$("#upcoming_busses_list").html(str);

		getStopSchedule();

	});
	
}

function getStopSchedule() {

	

	$("ul[data-type='routes_list'] > li").each(function() {

		var route_id;
		var stop_id;

		route_id = $(this).find("ul[data-type='route_id']").attr("data-id");
		stop_id = $(this).find("ul[data-type='route_id']").attr("data-stop-id");

		console.log("stop_id:", stop_id);

		var seconds = 60 * 60 * 3;

		$.get("https://transit.land/api/v1/schedule_stop_pairs?origin_onestop_id=" + stop_id + "&origin_departure_between=now-" + seconds + ",now+" + seconds + "&sort_key=origin_arrival_time&per_page=10&route_onestop_id=" + route_id + "&rand=" + (new Date()).getTime(), function(data) {

			console.log("schedules_stop ", data);

			var d = new Date();
			var currentHour = d.getHours();
			var currentMinunte = d.getMinutes();

			for (var i in data['schedule_stop_pairs']) {
				
				var arrivalStr = data['schedule_stop_pairs'][i]['origin_arrival_time'];
				var trip_headsign = data['schedule_stop_pairs'][i]['trip_headsign'];

				var service_days_of_week = data['schedule_stop_pairs'][i]['service_days_of_week'];
				
				//console.log(arrivalStr, arrivalStr.split(":")[0], (currentHour < arrivalStr.split(":")[0]))

				// if ((currentHour < arrivalStr.split(":")[0]) ||
				// 	((currentHour == arrivalStr.split(":")[0] && (currentMinunte < arrivalStr.split(":")[1])))
				// 	) {
				if (true) {

					var str = "";
					str += "<li class='list-group-item'>";

					str += arrivalStr + " " + trip_headsign;
					str += "<br />";
					str += (service_days_of_week[0] ? "Mon " : " ");
					str += (service_days_of_week[1] ? "Tue " : " ");
					str += (service_days_of_week[2] ? "Wed " : " ");
					str += (service_days_of_week[3] ? "Thu " : " ");
					str += (service_days_of_week[4] ? "Fri " : " ");
					str += (service_days_of_week[5] ? "Sat " : " ");
					str += (service_days_of_week[6	] ? "Sun " : " ");
					str += " (";
					str += data['schedule_stop_pairs'][i]['service_start_date'] + " to " + data['schedule_stop_pairs'][i]['service_end_date'];

					str += ")</li>";
					$("[data-type='route_id'][data-id='" + data['schedule_stop_pairs'][i]['route_onestop_id'] + "']").append(str);
				}
			}
		});
	});
}
