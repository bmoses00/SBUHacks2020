var map;

var coords = [40.7128, -74.0060]

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
    center: new google.maps.LatLng(coords[0], coords[1]),
    mapTypeId: 'terrain'
  });

  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = map.data.loadGeoJson('static/data/precincts.geojson');
  document.getElementsByTagName('head')[0].appendChild(script);

  var infowindow = null;
  var marker = null;

  map.data.addListener('mouseover', function(event) {

    let precinct = event.feature.j.precinct;
    if (infowindow != null) infowindow.close();
    infowindow = new google.maps.InfoWindow({
      content: "Precinct:" + precinct,
    });

    if (marker != null) marker.setMap(null);
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      title: 'marker'
    });
    marker.setVisible(false);

    infowindow.open(map, marker);
  });
  map.data.addListener('mouseout', function(event) {
      if (infowindow != null) infowindow.close();
      if (marker != null) marker.setMap(null);
  });
  map.data.addListener('click', function(event) {
      console.log('hi');
  });

}

// Loop through the results array and place a marker for eachmap.data.loadGeoJson('data.json')// set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}
