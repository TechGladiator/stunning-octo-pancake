let geocoder;
let infowindow;
let map;

function initialize() {
  $('#map').css({
    'width': '43.75%',
    'height': '400px',
    'margin': 'auto'
  });
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow;
  const latlng = new google.maps.LatLng(38.928610, -98.579458);
  const mapOptions = {
    zoom: 4,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function codeAddress(fullAddress, fieldData, intervalId) {
  geocoder.geocode({
    'address': fullAddress
  }, (results, status) => {
    console.log(results);
    if (status == 'OK') {
      lat = results[0].geometry.location.lat();
      long = results[0].geometry.location.lng();
      console.log('    Lat and Long:', lat, long);
      for (const k in fieldData) {
        if (fieldData.hasOwnProperty(k)) {
          const f = fieldData[k];
          const addressComponents = results[0].address_components;
          switch (f) {
            case fieldData.Address:
              if (f == '') {
                fieldData.Address = `${addressComponents[0].short_name} ${addressComponents[1].short_name}`;
                buildTable();
              }
              break;
            case fieldData.City:
              if (f == '') {
                fieldData.City = addressComponents[3].short_name;
                buildTable();
              }
              break;
            case fieldData.State:
              if (f == '') {
                fieldData.State = addressComponents[4].short_name;
                buildTable();
              }
              break;
            case fieldData.Zip:
              if (f == '') {
                fieldData.Zip = addressComponents[6].short_name;
                buildTable();
              }
            default:
              buildTable();
          }
        }
      }
      fieldData.Lat = lat;
      fieldData.Long = long;
      map.setCenter(results[0].geometry.location);
      const marker = new google.maps.Marker({
        map,
        position: results[0].geometry.location
      });
    } else {
      modal(status, `Geocode was not successful for the following reason: ${status}: ${fullAddress}`);
      clearInterval(intervalId);
    }
  });
}

function geocodeLatLng(r) {
  const input0 = $(`#row${r}Field9Lat`).html();
  const input1 = $(`#row${r}Field10Long`).html();
  const latlng = {
    lat: parseFloat(input0),
    lng: parseFloat(input1)
  };
  geocoder.geocode({'location': latlng}, (results, status) => {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(15);
        const marker = new google.maps.Marker({
          position: latlng,
          map
        });
        showInfoWin(r, marker);
      } else {
        modal('noResults', 'No results found');
      }
    } else {
      modal(status, `Geocoder failed due to: ${status}`);
    }
  });
}

function showInfoWin(r, marker) {
  infowindow.setContent(`
  <div id="content">
    <div id="siteNotice"></div>
    <h5 id="firstHeading" class="firstHeading">${$(`#row${r}Field0Name`).html()}</h5>
    <div id="bodyContent">
      ${$(`#row${r}Field1Address`).html()} ${$(`#row${r}Field2Address2`).html()} ${$(`#row${r}Field3City`).html()} ${$(`#row${r}Field4State`).html()} ${$(`#row${r}Field5Zip`).html()}
      <br>
      <b style="font-weight: 900">Purpose:</b> ${$(`#row${r}Field6Purpose`).html()} <b style="font-weight: 900">Property Owner:</b> ${$(`#row${r}Field7PropertyOwner`).html()} <b style="font-weight: 900">Creation Date:</b> ${$(`#row${r}Field8CreationDate`).html()}
    </div>
  </div>
  `);
  infowindow.open(map, marker);
}

function geoIterate(fullAddress) {
  let counter = fullAddress.length;
  let i = 0;
  let intervalId;
  function start() {
    if (counter == 0) {
      clearInterval(intervalId);
    } else {
      codeAddress(fullAddress[i], fieldData[i], intervalId);
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
  if (names.length < 11 && fieldNames.length < 11) {
    names.push('Lat', 'Long');
    fieldNames.push('Lat', 'Long');
  }
  console.log(fieldNames);
  console.log(fieldData);
}

function geoClear() {
  while (names.length > 9) {
    names.pop();
  }
  console.log(names);
}