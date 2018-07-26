let geocoder;
let infowindow;
let map;
let mapped = false;
let markers = [];

function ShowAllMarkers(showAllControlDiv, map) {
  const controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show all markers';
  showAllControlDiv.appendChild(controlUI);

  const controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Show All Markers';
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', setMarkerBounds);
}

function initialize() {
  $('#map').css({
    'width': '75%',
    'height': '400px',
    'margin': 'auto'
  });
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow({
    maxWidth: 400
  });
  const latlng = new google.maps.LatLng(38.928610, -98.579458);
  const mapOptions = {
    zoom: 4,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  mapped = true;

  const showAllControlDiv = document.createElement('div');
  const showAllMarkers = new ShowAllMarkers(showAllControlDiv, map);

  showAllControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(showAllControlDiv);
}

function codeAddress(fullAddress, fieldData, intervalId, r) {
  geocoder.geocode({
    'address': fullAddress
  }, (results, status) => {
    if (status == 'OK') {
      lat = results[0].geometry.location.lat();
      long = results[0].geometry.location.lng();
      for (const k in fieldData) {
        if (fieldData.hasOwnProperty(k)) {
          const f = fieldData[k];
          const addressComponents = results[0].address_components;
          switch (f) {
            case fieldData.Address:
              let address = '';
              for (let i = 0; i < addressComponents.length; i++) {
                const e = addressComponents[i];
                if (e.types[0] == 'street_number') {
                  address += e.short_name;
                } else if (e.types[0] == 'route') {
                  address += ` ${e.short_name}`;
                  if (fieldData.Address != address) {
                    fieldData.Address = address;
                  }
                  break;
                }
              }
              buildTable();
              break;
            case fieldData.City:
              for (let i = 0; i < addressComponents.length; i++) {
                const e = addressComponents[i];
                if (e.types[0] == 'locality' && fieldData.City != e.long_name) {
                  fieldData.City = e.long_name;
                }
              }
              buildTable();
              break;
            case fieldData.State:
              for (let i = 0; i < addressComponents.length; i++) {
                const e = addressComponents[i];
                if (e.types[0] == 'administrative_area_level_1' && fieldData.State != e.short_name) {
                  fieldData.State = e.short_name;
                }
              }
              buildTable();
              break;
            case fieldData.Zip:
              for (let i = 0; i < addressComponents.length; i++) {
                const e = addressComponents[i];
                if (e.types[0] == 'postal_code' && fieldData.Zip != e.short_name) {
                  fieldData.Zip = e.short_name;
                }
              }
              buildTable();
              break;
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
      markers.push(marker);
      marker.addListener('click', () => {
        map.setZoom(15);
        map.setCenter(results[0].geometry.location);
        showInfoWin(r, marker);
      });
    } else {
      fixGeocodeFail(intervalId, status, fullAddress, r);
    }
  });
}

function fixGeocodeFail(intervalId, status, fullAddress, r) {
  clearInterval(intervalId);
  let buttonName = 'Fix';
  let fix = fixButton(status, buttonName);
  modal(status, `Geocode was not successful for the following reason: ${status}: ${fullAddress}`, fix);
  modalDispose(status, buttonName, () => {
    errorCount = 1;
    buildTable(r);
    returnToList();
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
        markers.push(marker);
        marker.addListener('click', () => {
          map.setZoom(15);
          showInfoWin(r, marker);
          map.setCenter(results[0].geometry.location);
        });
        showInfoWin(r, marker);
        map.setCenter(results[0].geometry.location);
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
      setMarkerBounds();
    } else if (markers.length < fieldData.length) {
      console.log('this record hasn\'t been geocoded');
      codeAddress(fullAddress[i], fieldData[i], intervalId, i);
    } else {
      console.log('skip record already geocoded');
    }
    counter--;
    i++;
    buildTable();
  }
  intervalId = setInterval(start, 500);
  showLatLong();
  console.log('    Field Data:', fieldData);
}

function setMarkerBounds() {
  let bounds = new google.maps.LatLngBounds();
  for (let i = 0; i < markers.length; i++) {
    const e = markers[i];
    bounds.extend(e.getPosition());
  }
  map.setCenter(bounds.getCenter());
  google.maps.event.addListenerOnce(map, 'zoom_changed', (e) => {
    if (map.getZoom() > 15) {
      map.setZoom(15);
    }
  });
  map.fitBounds(bounds);
}

function showLatLong() {
  if (fieldNames && names.length < 11 && fieldNames.length < 11) {
    names.push('Lat', 'Long');
    fieldNames.push('Lat', 'Long');
  }
}

function geoClear() {
  while (names.length > 9) {
    names.pop();
  }
}