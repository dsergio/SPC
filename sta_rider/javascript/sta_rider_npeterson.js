$(document).ready(() => {
    getGeoLocation(renderMap)
});

function getGeoLocation(cb) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(cb);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
}

function renderMap(pos) {
    let latitude = pos.coords.latitude;
    let longitude = pos.coords.longitude;

    let platform = new H.service.Platform({
        'app_id' : 'edMnWzctOIflY41WjRu1',
        'app_code' : 'eFf6pqVnd_nrEIOwhYPaPQ',
        useHTTPS: true
    });

    let defaultLayers = platform.createDefaultLayers();

    window.stopMap = new H.Map(
        document.getElementById('nearby_bus_stops_map'),
        defaultLayers.normal.map,
        {
            zoom: 14,
            center: { lat: latitude, lng: longitude }
        }
    );

    let mapEvents = new H.mapevents.MapEvents(stopMap);
    let behavior = new H.mapevents.Behavior(mapEvents);
    behavior.disable(H.mapevents.Behavior.WHEELZOOM);

    window.stopMapUI = H.ui.UI.createDefault(stopMap, defaultLayers);
    stopMapUI.getControl('mapsettings').setVisibility(false);

    window.mapGroup = new H.map.Group();
    stopMap.addObject(mapGroup);

    mapGroup.addEventListener('tap', (evt) => {
        for(let bubble of stopMapUI.getBubbles()) {
            bubble.close();
        }

        let bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
            content: evt.target.getData()
        });

        stopMapUI.addBubble(bubble);
    });

    $.get("https://transit.land/api/v1/stops?lon=" + longitude + "&lat=" + latitude + "&r=5000", loadMarkers);
}

function loadMarkers(data) {
    for(let stop of data.stops) {
        let coordinate = { lat: stop.geometry.coordinates[1], lng: stop.geometry.coordinates[0] };
        let marker = new H.map.Marker(coordinate);
        marker.setData(stop.tags['stop_desc']);
        mapGroup.addObject(marker);
    }

    if(data.meta.next) {
        $.get(data.meta.next, loadMarkers);
    }
}

