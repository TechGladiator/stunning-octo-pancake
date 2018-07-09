let geocoder;
let map;

function initialize() {
  $('#map').css({
    'width': '62.5%',
    'height': '400px',
    'margin': 'auto'
  });
  geocoder = new google.maps.Geocoder();
  const latlng = new google.maps.LatLng(38.928610, -98.579458);
  const mapOptions = {
    zoom: 4,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function codeAddress(fullAddress, fieldData) {
  geocoder.geocode({
    'address': fullAddress
  }, (results, status) => {
    if (status == 'OK') {
      latitude = results[0].geometry.viewport.f.f;
      longitude = results[0].geometry.viewport.b.b;
      console.log('    Latitude and Longitude:', `${latitude}, ${longitude}`);
      fieldData.Latitude = latitude;
      fieldData.Longitude = longitude;
      map.setCenter(results[0].geometry.location);
      const marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });
    } else {
      modal(status, `Geocode was not successful for the following reason: ${status}: ${fullAddress}`);
    }
  });
}

function geoIterate(fullAddress) {
  let counter = fullAddress.length;
  let i = 0;
  let intervalId;
  function start() {
    if (counter == 0) {
      clearInterval(intervalId);
    } else {
      codeAddress(fullAddress[i], fieldData[i]);
      console.log(fullAddress[i]);
      console.log(fieldData[i]);
    }
    counter--;
    i++;
    buildTable();
  }
  intervalId = setInterval(start, 500);
  showLatLong();
}

function showLatLong() {
  names.push('Latitude', 'Longitude');
  fieldNames.push('Latitude', 'Longitude');
  console.log(fieldNames);
  console.log(fieldData);
}