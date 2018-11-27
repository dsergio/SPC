$(document).ready(function() {

	getLocation();

	$(document).on("click", "#stop_get_routes", getStopRoutes);

});

function getStopRoutes()
{
	console.log("Show Routes Pressed");
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setPositionValues);
		
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function setPositionValues(position) 
{
	window.latitude = position.coords.latitude;
	window.longitude = position.coords.longitude;
}