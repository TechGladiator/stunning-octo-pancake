const { printRecords } = require("./printRecords");

const { fixButton } = require("./fixButton");

const { toggleEditable } = require("./toggleEditable");

const { returnToList } = require("./returnToList");

const { modalDispose } = require("./modalDispose");

const { modal } = require("./modal");

const { globalLet } = require("./globalLet");

const { globalConst } = require("./globalConst");

const $ = require('jquery');
const { names, wrapper2, wrapper1, mainTitle, wrapper3 } = globalConst();
let { errorCount, editable, mapped, fieldData, fieldNames, fieldErrors, firstError, rowCount, code, message, fileName, headerCheck, name, row, fullResults, pageSwitch, firstRun, fieldState, fieldZip, fieldDate, markers, geocoder, infowindow, map, lat, long } = globalLet();

function errorFn(err, file) {
  console.log('ERROR:', err, file);
}

function completeFn(results) {
  fullResults = results;
  fieldNames = fullResults.meta.fields;
  fieldData = fullResults.data;
  fieldErrors = fullResults.errors;
  if (fullResults && fieldErrors) {
    if (fieldErrors) {
      errorCount = fieldErrors.length;
      firstError = fieldErrors[0];
    }
    if (fieldData && fieldData.length > 0) {
      rowCount = fieldData.length;
    }
  }
  printRecords('Parse complete');
  console.log('    Results:', fullResults);
}

// Enable application to parse file
function parseFile() {
  pageSwitch = false;

  setPage('Upload CSV File', wrapper2, '#goBack', main);

  $('#headerCheck').click(() => {
    if ($('#headerCheck').prop('checked')) {
      headerCheck = true;
      console.log('check box is checked = ', headerCheck);
    } else {
      headerCheck = false;
      console.log('check box is checked = ', headerCheck);
    }
  });

  // replace input placeholder with file name
  $('#inputGroupFile02').on('change', function () {
    fileName = $(this).val();
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
    if (fileName != '') {
      $(this).next('.custom-file-label').addClass('selected').html(fileName);
      $('.csv').html('');
    } else {
      $(this).next('.custom-file-label').addClass('selected').html('Drag & Drop or click here to browse for your file');
      $('.csv').html('');
    }
  });

  $('#upload').click(() => {
    rowCount = 0;
    errorCount = 0;
    firstError = undefined;
    if (!firstRun) {
      console.log('--------------------------------------------------');
    } else {
      firstRun = false;
    }
    if (!$('#inputGroupFile02')[0].files.length) {
      modal("noFileChosen", "Please choose at least one file to parse.");
      return;
    }
    const file = document.getElementById('inputGroupFile02').files[0];
    // use jquery to select files
    const papa = require('papaparse');
    papa.parse(file, {
      // base config to use for each file
      delimiter: "",
      header: headerCheck,
      dynamicTyping: false,
      skipEmptyLines: true,
      preview: 0,
      step: undefined,
      encoding: "",
      worker: false,
      comments: false,
      complete: completeFn,
      error: errorFn
    });
  });
}

function getFieldNames(fn) {
  if (headerCheck) {
    let i = 0;
    fn += `
    <th class="border border-dark invisible">Delete Record</th>
    <th scope="col">#</th>
    `;
    fieldNames.forEach(e => {
      validateFieldNames(e);
      if (name) {
        fn += `<th id="header${i}">${e}</th>`;
      } else {
        fn += `<th class="table-danger" id="header${i}">${e}</th>`;
      }
      i++;
    });
  }
  return fn;
}

function getFieldData(fd, row, fullAddress, addressList) {
  if (errorCount) {
    let j = 0;
    fd += `
            <th class="deleteRow table-danger text-center align-middle border border-dark invisible" id="deleteRow${row}" onclick="deleteRow(${row})">X</th>
            <th scope="row">${row + 1}</th>
          `;
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        const e = fieldData[row][k];
        validateState(e);
        validateZip(e);
        validateDate(e);
        fd += `<td id="row${row}Field${j}">${e}</td>`;
        j++;
      }
    }
  } else {
    let r = 0;
    fieldData.forEach(e => {
      let j = 0;
      validateState(e);
      validateZip(e);
      validateDate(e);
      ({ fd, j, fullAddress } = buildFields(fd, r, e, j, fullAddress));
      addressList.push(fullAddress);
      fullAddress = '';
      fd += `</tr>`;
      r++;
    });
  }
  return { fd, fullAddress };
}

function buildFields(fd, r, e, j, fullAddress) {
  let fieldClick;

  if (mapped) {
    fieldClick = `onclick="geocodeLatLng(${r})"`
  } else {
    fieldClick = '';
  }

  fd += `
            <tr>
              <th class="deleteRow table-danger text-center align-middle border border-dark invisible" id="deleteRow${r}" onclick="deleteRow(${r})">X</th>
              <th scope="row" id="row${r}" ${fieldClick}>${r + 1}</th>
            `;
  for (let k in e) {
    if (e.hasOwnProperty(k)) {
      const f = e[k];
      if (f == e.State && !fieldState || f == e.Zip && !fieldZip || f == e['Creation Date'] && !fieldDate) {
        fd += `<td class="table-danger" id="row${r}Field${j}${k.replace(/\s+/g, '')}">${f}</td>`;
      } else {
        if (k == j) {
          k = '';
        }
        if (k == 'id' || k == 'import_id') {
          fd += '';
          j--;
        } else {
          fd += `<td id="row${r}Field${j}${k.replace(/\s+/g, '')}" ${fieldClick}>${f}</td>`;
        }
        if (k == 'Name' || k == 'Address' || k == 'City' || k == 'State' || k == 'Zip') {
          fullAddress += ` ${f}`;
        }
      }
      j++;
    }
  }
  return { fd, j, fullAddress };
}

function updateFields(row) {
  if (headerCheck) {
    for (let i = 0; i < fieldNames.length; i++) {
      fieldNames[i] = $(`#header${i}`).html();
      validateFieldNames(fieldNames[i]);
      if (name) {
        $(`#header${i}`).removeClass('table-danger');
      } else {
        $(`#header${i}`).addClass('table-danger');
      }
    }
  }
  let j = 0;
  if (row != undefined) {
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        fieldData[row][k] = $(`#row${row}Field${j}`).html();
        validateField(fieldData[row], k, row, j);
        j++;
      }
    }
  } else {
    let i = 0;
    fieldData.forEach(e => {
      let j = 0;
      for (const k in e) {
        if (e.hasOwnProperty(k) && k != 'recordid') {
          e[k] = $(`#row${i}Field${j}${names[j].replace(/\s+/g, '')}`).html();
          validateField(e, k, i, j);
        }
        j++;
      }
      i++;
    });
  }
  console.log('    Updated Data: ', fieldData);
}
exports.updateFields = updateFields;

function newCSV() {
  fullResults = {};
  fieldNames = {};
  fieldData = {};
  fieldErrors = {};
  fileName = undefined;
  headerCheck = true;
  mapped = false;
  markers = [];
  console.log('    Results:', fullResults);
  $('#map').html('');
  $('#map').removeAttr('style');
  $('.csv').removeClass('p-5');
  $('#jumboHeader').addClass('mb-5');
  geoClear();
  parseFile();
}

// build table

function buildTable(row) {
  let fn = '';
  let fd = '';
  let fullAddress = '';
  let addressList = [];

  $('.csv').addClass('p-5');
  
  fn = getFieldNames(fn);

  ({ fd, fullAddress } = getFieldData(fd, row, fullAddress, addressList));

  // force correction of header names
  if (row == 'header') {
    fd = '';
  }

  $('#jumboHeader').removeClass('mb-5');
  $('#jumboHeader').html(fileName);
  $('title').html(fileName);
  $('.wrapper').html('');

  $('.csv').html(`
                    <div class="btn-group d-flex justify-content-center mb-3" role="group" aria-label="button group">
                      <button type="button" class="btn btn-secondary" id="editData">Edit Data</button>
                      <button type="button" class="btn btn-secondary invisible" id="saveRecords">Save Records</button>
                      <button type="button" class="btn btn-secondary" id="mapData">Map Imported Data</button>
                      <button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
                      <button type="button" class="btn btn-secondary" id="search">New Search</button>
                      <button type="button" class="btn btn-secondary" id="newCSV">Import New CSV File</button>
                    </div>
                    <div class="card">
                      <div class="card-body">
                        <table id="csvTable" class="table table-bordered">
                          <thead>
                            <tr class="headerRow">
                              ${fn}
                            </tr>
                          </thead>
                          <tbody>
                            ${fd}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  `);

  if (mapped) {
    $('tbody').addClass('latlong');
    $('#saveRecords').removeClass('invisible');
    $('title').html(`${$('#jumboHeader').html()} Mapped`);
  }

  if (firstError == undefined) {
    $('#repairNext').addClass('invisible');
  } else {
    $('#mapData').addClass('invisible');
  }

  $('#editData').click(() => {
    toggleEditable(row);
  });
  $('#saveRecords').click(() => {
    saveRecords();
  });
  $('#mapData').click(() => {
    if (!mapped) {
      initialize();
    }
    geoIterate(addressList);
  });
  $('#repairNext').click(() => {
    updateFields(row);
    printRecords();
  });
  $('#search').click(() => {
    newCSV();
    pageSwitch = true;
    main();
  });
  $('#newCSV').click(newCSV);
}
exports.buildTable = buildTable;

// validate

// Validate field names
function validateFieldNames(fieldName) {
	for (let i = 0; i < names.length; i++) {
		if (fieldName == names[i]) {
			name = true;
			return;
		} else {
			name = false;
		}
	}
}
exports.validateFieldNames = validateFieldNames;

// Validate data type formats in each record
function validateState(row) {
	const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MP', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
	if (row.State) {
		for (let i = 0; i < states.length; i++) {
			if (row.State == states[i]) {
        fieldState = true;
        return;
			} else {
        fieldState = false;
      }
		}
	}
}

function validateZip(row) {
  fieldZip = true;
	const digits = '0123456789';
	if (row.Zip) {
		if (row.Zip.length != 5) {
			fieldZip = false;
		}
		for (let i = 0; i < row.Zip.length; i++) {
			const zipDigit = `${row.Zip.substring(i, i+1)}`;
			if (digits.indexOf(zipDigit) == '-1') {
				fieldZip = false;
			}
		}
	}
}

function validateDate(row) {
	fieldDate = true;
	const regEx = /^\d{4}-\d{2}-\d{2}$/;

	if (row['Creation Date']) {
		if (!row['Creation Date'].match(regEx)) { // Invalid format
			fieldDate = false;
		}

		const d = new Date(row['Creation Date']);

		if (!d.getTime() && d.getTime() !== 0 && fieldDate) { // Invalid date
			fieldDate = false;
			console.log(`${row['Creation Date']} is an invalid date`);
		}
	}
}

function validateField(e, k, i, j) {
  validateState(e);
  validateZip(e);
  validateDate(e);
  if (e[k] == e.State && !fieldState || e[k] == e.Zip && !fieldZip || e[k] == e['Creation Date'] && !fieldDate) {
    $(`#row${i}Field${j}`).addClass('table-danger');
  } else {
    $(`#row${i}Field${j}`).removeClass('table-danger');
  }
}

// geocode

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

// main

function setHeader(header, wrapper) {
  $('title').html(header);
  $('#jumboHeader').html(header);
  $('.wrapper').html(wrapper);
  $('#map').html('');
  $('.csv').html('');
}

function setPage(header, wrapper, elId0, func0, elId1, func1, elId2, func2) {
  setHeader(header, wrapper);
  $(elId0).click(func0);
  $(elId1).click(func1);
  $(elId2).click((params) => {
    func2(params);
  })
}

function searchRecords(id) {
  $.ajax({
    url: '/imports/' + id +'/records/',
    type: 'get',
    success: (res) => {
      console.log(res);
      if (res.length > 0) {
        setHeader(id);
        names.push('Lat', 'Long');
        fieldNames = names;
        fieldData = res;
        printRecords();
      } else {
        modal('404', 'Not Found');
      }
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function postData(importName) {
  const importData = { importName, fieldData };
  $.ajax({
    url: '/imports/',
    type: 'post',
    data: JSON.stringify(importData),
    dataType: 'json',
    contentType: 'application/json',
    success: (res) => {
      modal(res.status, res.message || res.error);
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function searchImports(searchString) {
  let searchTerm;
  if ($(searchString).val()) {
    searchTerm = $(searchString).val();
  } else {
    searchTerm = searchString;
  }
  $.ajax({
    url: '/imports/' + searchTerm,
    type: 'get',
    success: (res) => {
      if (res.status) {
        modal(res.status, res.message);
      } else {
        let importId;
        let resHTML = '<div class="d-flex justify-content-center mb-3" role="group" aria-label="button group">';
        res.forEach(e => {
          console.log(e.import_name);
          resHTML += `<button type="button" class="btn btn-dark m-1" id="search-records">${e.import_name}</button>`;
          importId = e.id;
        });
        resHTML += '</div>';
        $('.csv').html(resHTML);
        $('#search-records').click(() => {
          searchRecords(importId);
        });
      }
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function main() {
  if (!pageSwitch) {
    pageSwitch = true;
    setPage('Upload or Search', wrapper1, '#uploadCSV', parseFile, '#searchData', main);
    $('title').html(mainTitle);
  } else {
    pageSwitch = false;
    setPage('Search By Import Name', wrapper3, '#goBack', main, '#searchDB', () => {
      searchImports('#searchImports');
    });
  }
}

function saveRecords() {
  let code = 'Save';
  let button = 'Cancel';
  let cancel = `<button type="button" class="btn btn-danger" id="${code}${button}">${button}</button>`;
  modal(code, 'Name this imported data', cancel);
  $('#modalBody').append(`<input class="form-control" id="saveImportName" type="text" placeholder="Import Name" value="${fileName || $('#jumboHeader').html()}">`);
  let saveName = document.getElementById('saveImportName');
  let importName = saveName.value;
  function getSaveName() {
    importName = saveName.value;
  }
  saveName.onchange = getSaveName;
  $(`#${code}Close2`).html(code);
  modalDispose(code, button);
  modalDispose(code, 'Close2', () => {
    postData(importName);
  });
}

main();