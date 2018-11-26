
$(document).ready(function() {

	getLocation();

	$(document).on("click", "#stop_get_busses", getUpcomingBusses);

	// $(document).on("click", "#nearby_bus_stops_refresh", function() {
	// 	nearbyBusStopsMap();
	// });

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

function initializeMap(lat, lon) {

	var platform = new H.service.Platform({
		'app_id': 'Yeq4hP2BMZTubVgdhqxl',
		'app_code': 'i4q4Cfeb1GzBxgZYQmyRgw',
		useHTTPS: true
	});

	// Obtain the default map types from the platform object:
	var defaultLayers = platform.createDefaultLayers();

	// Instantiate (and display) a map object:
	var map = new H.Map(
		document.getElementById('nearby_bus_stops_map'),
		defaultLayers.normal.map,
		{
		zoom: 10,
		center: { lat: lat, lng: lon }
	});
}


function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPositionValues);
		
	} else {
		console.log("Geolocation is not supported by this browser.");
	}


}

function setPositionValues(position) {
	window.latitude = position.coords.latitude;
	window.longitude = position.coords.longitude;

	//nearbyBusStopsMap();
}

function setStopsSelect() {

	console.log("Latitude: " + latitude + " Longitude: " + longitude); 
	// initializeMap(latitude, longitude);	

	// var radius = $("#select_radius_chooser option:selected").attr("data-id");

	$.get("https://transit.land/api/v1/stops?lon=" + longitude + "&lat=" + latitude + "&r=" + radius + "&rand=" + (new Date()).getTime(), function(data) {
		
		// console.log(data);

		// var str = "<h3>Stops in your area</h3>";
		// var stops_str = "";
		// str += "<p>latitude: " + latitude + ", longitude: " + longitude + ", within 5km. </p>";
		// str += "<ul class='list-group'>";
		// for (var i in data['stops']) {
		// 	str += "<li class='list-group-item'>" + data['stops'][i]['name'] + " - " + data['stops'][i]['tags']['stop_desc'] + "</li>";
		// 	stops_str += "<option data-id = '" + data['stops'][i]['onestop_id'] +"'>" + data['stops'][i]['name'] + " - " + data['stops'][i]['tags']['stop_desc'] + "</option>";
		// }
		// str += "</ul>";

		// $("#nearby_bus_stops_list").html(str);
		$("#select_stop").html(stops_str)
	});
}
