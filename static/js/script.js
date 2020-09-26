var map;
var sidebar = document.getElementById("box");
sidebar.style.display = "None";

var coords = [40.7128, -74.0060];

let features = [];

let rankings = {};

let selected_location = null;

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
        mapTypeId: 'roadmap',
        mapTypeControlOptions: { mapTypeIds: [] },
        streetViewControl: false
    });

    var input = document.getElementById('address_search');
    var options = {
        bounds: {
            north: coords[0] + .4,
            south: coords[0] - .4,
            west: coords[1] - .4,
            east: coords[1] + .4,
        },
        types: ['address']
    };

    let autocomplete = new google.maps.places.Autocomplete(input, options);
    // autocomplete.setFields(["address_component"]);
    let handle_address = () => {
        const place = autocomplete.getPlace();

        if (selected_location != null) {
            selected_location.setMap(null);
        }

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        selected_location = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: 'Selected Location'
          });

        // selected_location.setMap(map);

        map.setCenter(place.geometry.location);
    };
    document.getElementById("find_address_button", handle_address);
    autocomplete.addListener("place_changed", handle_address);

    document.getElementById("mark_current_location").addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                if (selected_location != null) {
                    selected_location.setMap(null);
                }

                let latLong = { lat: position.coords.latitude, lng: position.coords.longitude };

                selected_location = new google.maps.Marker({
                    position: new google.maps.LatLng(latLong) ,
                    map: map,
                    title: 'Selected Location'
                  });

                map.setCenter(new google.maps.LatLng(latLong));

                let match = -1;
                for (let i = 0; i < features.length; i++) {
                    // console.log(features[i].getGeometry().getType());
                    features[i].getGeometry().getArray().forEach(polygon => {
                        // console.log(polygon.getType());
                        // console.log(Object.getOwnPropertyNames(polygon));
                        // console.log(polygon.getGeometry());
                        // console.log(polygon.getVisible());
                        if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(latLong), polygon)) {
                            match = i;
                            display_data(features[i].j.precinct);
                            return;
                        }
                    });
                }
            });
        } else {
            window.alert("GPS is not available!");
            return;
        }
    });

    fetch('api/get_rankings').then(response => response.json())
        .then(data => {
            data.rankings.forEach(precinct_dat => {
                rankings[precinct_dat[0]] = precinct_dat[1];
            });
        });

    var script = document.createElement('script');
    map.data.loadGeoJson('static/data/precincts.geojson', {}, feature_arr => {
        // console.log(feature_arr);
        feature_arr.forEach(feature => {
            features.push(feature);
        });
    });
    map.data.setStyle(feature => {
        let precinct = feature.j.precinct;

        let percent = (rankings[precinct] - 1) / 76;
        let r = [255, 0, 0];
        let g = [0, 255, 0];
        let interpolated = [];
        for (let i = 0; i < r.length; i++) {
            interpolated[i] = Math.round(r[i] * (1 - percent) + g[i] * percent);
        }
        let fill_color = '#' + interpolated[0].toString(16).padStart(2, '0') + interpolated[1].toString(16).padStart(2, '0') + interpolated[2].toString(16).padStart(2, '0');
        return {
            strokeWeight: 1,
            fillColor: fill_color
        };
    });
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
            document.getElementById("ranking").textContent = "Ranking: (1 is worst, 77 is best): " + data.ranking;
            document.getElementById("num_officers").textContent = "# officers with complaints in precinct: " + data.unique_officers;
            //make 1 red, 77 green?


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
