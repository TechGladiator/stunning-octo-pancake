let geocoder;
let map;

function initialize() {
  geocoder = new google.maps.Geocoder();
  const latlng = new google.maps.LatLng(38.928610, -98.579458);
  const mapOptions = {
    zoom: 4,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function codeAddress(fullAddress) {
  geocoder.geocode({
    'address': fullAddress
  }, (results, status) => {
    if (status == 'OK') {
      console.log('    Latitude and Longitude:', `${results[0].geometry.viewport.f.f}, ${results[0].geometry.viewport.b.b}`);
      map.setCenter(results[0].geometry.location);
      const marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });
    } else {
      modal(status, `Geocode was not successful for the following reason: ${status}`);
    }
  });
}