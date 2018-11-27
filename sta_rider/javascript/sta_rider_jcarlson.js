$(document).ready(function() {

	getLocation();
	
	$(document).on("click", "#stop_get_routes", getRoutesServicing);
	
	$(document).on("click", "#nearby_bus_stops_refresh", function() {
		nearbyBusStopsMap();
	});
});


function getRoutesServicing()
{
	
	var onestop_id = $("#select_location option:selected").attr("data-id");

	$.get("https://transit.land/api/v1/onestop_id/" + onestop_id + "?rand=" + (new Date()).getTime(), function(data) {
		
		console.log(data, data['routes_serving_stop']);

		var str = "<h3>Routes Serviced By \""+data['name']+"\"</h3>";
		str += "<ul class='list-group'>";
		for (var i in data['routes_serving_stop']) {
			str += "<li class='list-group-item'>" + data['routes_serving_stop'][i]['operator_name'];
			str += " - " + data['routes_serving_stop'][i]['route_name'];
			str += "<ul data-type = 'route_id' data-id = '" +  data['routes_serving_stop'][i]['route_onestop_id'] +  "'>";
			str += "</ul>";
			str += "</li>";
		}
		str += "</ul>";
		$("#routes_list").html(str);

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

	nearbyBusStopsMap();
}

function nearbyBusStopsMap() {

	console.log("Latitude: " + latitude + " Longitude: " + longitude); 

	$.get("https://transit.land/api/v1/stops?lon=" + longitude + "&lat=" + latitude + "&r=5000", function(data) {
		
		console.log(data);

		var str = "<h3>Stops in your area</h3>";
		var stops_str = "";
		str += "<p>latitude: " + latitude + ", longitude: " + longitude + ", within 5km. </p>";
		str += "<ul class='list-group'>";
		for (var i in data['stops']) {
			str += "<li class='list-group-item'>" + data['stops'][i]['name'] + " - " + data['stops'][i]['tags']['stop_desc'] + "</li>";
			stops_str += "<option data-id = '" + data['stops'][i]['onestop_id'] +"'>" + data['stops'][i]['name'] + " - " + data['stops'][i]['tags']['stop_desc'] + "</option>";
		}
		str += "</ul>"

		$("#nearby_bus_stops_list").html(str);
		$("#select_stop").html(stops_str);
		$("#select_location").html(stops_str);
	});
}