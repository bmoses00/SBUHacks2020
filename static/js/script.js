var map;
var sidebar = document.getElementById("box");
sidebar.style.display = "None";

var coords = [40.7128, -74.0060];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        minZoom: 10,
        restriction: {
            latLngBounds: {
                north: coords[0] + .4,
                south: coords[0] - .4,
                west: coords[1] - .4,
                east: coords[1] + .4,
            },
            strictBounds: false,
        },
        strictBounds: false,
        center: new google.maps.LatLng(coords[0], coords[1]),
        mapTypeId: 'terrain',
        mapTypeControlOptions: { mapTypeIds: [] },
        streetViewControl: false
    });

    var script = document.createElement('script');
    var dat = map.data.loadGeoJson('static/data/precincts.geojson');
    document.getElementsByTagName('head')[0].appendChild(script);

    var infowindow = null;
    var marker = null;

    map.data.addListener('mouseover', function (event) {
        let totalLatLong = [0, 0];
        let points = 0;
        event.feature.getGeometry().forEachLatLng(element => {
            totalLatLong[0] += element.lat();
            totalLatLong[1] += element.lng();
            points++;
        });
        totalLatLong[0] /= points;
        totalLatLong[1] /= points;

        let precinct = event.feature.j.precinct;
        if (infowindow != null) infowindow.close();
        infowindow = new google.maps.InfoWindow({
            content: "Precinct " + precinct,
        });

        if (marker != null) marker.setMap(null);
        marker = new google.maps.Marker({
            position: new google.maps.LatLng({ lat: totalLatLong[0], lng: totalLatLong[1] }),
            map: map,
            title: 'marker'
        });
        marker.setVisible(false);

        infowindow.open(map, marker);
    });
    map.data.addListener('mouseout', function (event) {
        if (infowindow != null) infowindow.close();
        if (marker != null) marker.setMap(null);
    });
    map.data.addListener('click', function (event) {
        display_data(event.feature.j.precinct);
    });
    map.addListener('click', function (event) {
        sidebar.style.display = "None";
    });

}

function display_data(precinct) {
    sidebar.style.display = "";
    document.getElementById("precinct_title").innerHTML = "Precinct " + precinct;

    fetch('api/get_data_by_precinct?precinct=' + precinct)
        .then(response => response.json())
        .then(data => {
            // console.log(data);

            document.getElementById("total_complaints").textContent = "Total Complaints: " + data.total_complaints;
            document.getElementById("ranking").textContent = "Ranking: (out of 77, lower is worse): " + data.ranking;
            document.getElementById("num_officers").textContent = "# officers with complaints in precinct: " + data.unique_officers;


        });

}

window.eqfeed_callback = function (results) {
    for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
    }
};
