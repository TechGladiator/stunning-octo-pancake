// global variables
const $ = require('jquery');
const mainTitle = $('title').html();
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
const wrapper1 = `
<div class="text-center">
	<button type="button" class="btn btn-dark" id="uploadCSV">Upload CSV File</button>
	<button type="button" class="btn btn-dark" id="searchData">Search</button>
</div>
`;
const wrapper2 = `
<div class="input-group mr-auto ml-auto mb-3">
	<div class="custom-file">
		<input type="file" class="custom-file-input" id="inputGroupFile02">
		<label class="custom-file-label" for="inputGroupFile02">Drag &amp; Drop or click here to browse for your file</label>
	</div>
	<div class="input-group-append" id="upload">
		<span class="input-group-text">Upload</span>
	</div>
	<div class="input-group-append" id="goBack">
    <span class="input-group-text">Go Back</span>
	</div>
</div>
<div class="text-center">
	<input type="checkbox" id="headerCheck" checked aria-label="Checkbox if header is included">
<label for="headerCheck">Check here if a header is included as the first line of the file</label>
</div>
`;
const wrapper3 = `
<div class="input-group mb-3">
	<input type="text" class="form-control" id="searchImports">
	<div class="input-group-append">
		<span class="input-group-text" id="searchDB">Search</span>
		<span class="input-group-text" id="goBack">Go Back</span>
	</div>
</div>
`;
let code;
let editable;
let end;
let errorCount = 0;
let fieldData;
let fieldDate = true;
let fieldErrors;
let fieldNames;
let fieldState = true;
let fieldZip = true;
let fileName;
let firstError;
let firstRun = true;
let fullResults;
let headerCheck = true;
let lat;
let long;
let message;
let name = true;
let pageSwitch = false;
let row;
let rowCount = 0;
let start;

// Modal

function modal(moId, moBody, moFooter) {
	$('body').append(`
  <div class="modal fade" id="${moId}" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="${moId}Label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${moId}Label">${moId}</h5>
          <button type="button" class="close" id="${moId}Close1" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer" id="modalFooter"></div>
      </div>
    </div>
	</div>
	`);
	$(`#${moId}`).modal('show');
	$('#modalBody').html(`<h5 class="text-center">${moBody}</h5>`);
	let okButton = `<button type="button" class="btn btn-primary" id="${moId}Close2">Ok</button>`;
	if (moFooter) {
		$('#modalFooter').html(`${moFooter}${okButton}`);
	} else {
		$('#modalFooter').html(okButton);
	}
	modalDispose(moId, 'Close1');
	modalDispose(moId, 'Close2');
}

function modalDispose(moId, close, func) {
	$(`#${moId}${close}`).click(() => {
		$(`#${moId}`).modal('hide');
		$(`#${moId}`).on('hidden.bs.modal', () => {
			$('.modal').remove();
			$('.modal-backdrop').remove();
			if (func) func();
		});
	});
}

// fix errors

function returnToList() {
  $('#mapData').html('Return to list');
  $('#mapData').click(() => {
    errorCount = 0;
    buildTable();
  });
}

function toggleEditable(row) {
  editable = $('#csvTable');
  if (!editable[0].isContentEditable) {
    editable[0].contentEditable = 'true';
    $('#editData').html('Save Edits');
    $('.border-dark').removeClass('invisible');
    if (mapped) {
      $('tbody').removeClass('latlong');
    }
  }
  else {
    updateFields(row);
    buildTable(row);
    if (mapped && errorCount > 0) {
      returnToList();
    }
  }
}

function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      if (k != names[i] && fieldData[row][k] == '') {
        console.log(`${k} != ${names[i]}`);
        console.log('deleted empty field: ', k);
        delete fieldData[row][k];
      }
      if (Object.values(fieldData[row]).length < fieldNames.length) {
        console.log('fieldData is less then fieldNames');
        if (fieldData[row][`${names[i + 1]}`] != undefined) {
          fieldData[row][`${names[i + 1]}`] = fieldData[row][`${names[i + 1]}`];
        } else {
          fieldData[row][`${names[i + 1]}`] = '';
        }
      }
      i++;
    }
  }
}

function removeFirstErrorMessage(row) {
  $(`.modal`).on('hidden.bs.modal', () => {
    if (Object.values(fieldData[row]).length == fieldNames.length) {
      fieldErrors.shift(0);
      console.log(fieldErrors);
      errorCount--;
      firstError = fieldErrors[0];
      console.log('     Errors:', errorCount);
      console.log('First Error:', firstError);
    }
  });
}

function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    removeEmptyField(row);
    removeFirstErrorMessage(row);
    buildTable(row);
  });
}

function deleteRow(row) {
  fieldData.splice(row, 1);
  if (errorCount > 0) {
    errorCount--;
  }
  if ($(`#row${row}Field11recordid`).html()) {
    let id = $(`#row${row}Field11recordid`).html()
    $.ajax({
      url: '/api/imports/records/' + id,
      type: 'delete',
      success: (res) => {
        modal('Deleted', res);
      }
    });
  }
  buildTable();
  toggleEditable();
}

function fixButton(code, buttonName) {
  return `<button type="button" class="btn btn-danger" id="${code}${buttonName}">${buttonName}</button>`;
}

// parse csv file

function printStats(msg) {
  let buttonName;
  let fix;
  if (msg) {
    console.log(msg);
    console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
    console.log('  Row count:', rowCount);
    console.log('     Errors:', errorCount);
  }
  if (fieldNames && fieldNames.length != names.length) {
    console.log('header length is wrong');
    let codeWord;
    if (fieldNames.length < names.length) {
      codeWord = 'Few';
    } else {
      codeWord = 'Many';
    }
    code = `Too${codeWord}Fields`;
    message = `Too ${codeWord.toLowerCase()} fields: expected ${names.length} fields but parsed ${fieldNames.length}`;
    modal(code, `${message} in "${fileName}", Row: 0. Header length errors must be corrected within file before further processing to prevent data loss.`);
    return;
  } else if (!headerCheck) {
    buildTable();
    return;
  }
  for (let i = 0; i < fieldNames.length; i++) {
    validateFieldNames(fieldNames[i]);
    if (!name) {
      console.log(fieldNames[i], ' is invalid');
      buttonName = 'Cancel';
      code = 'invalidHeader';
      fix = fixButton(code, buttonName);
      modal(code, `${fieldNames[i]} is an invalid header name. Replace with correct header: ${names[i]}?`, fix);
      modalDispose(code, buttonName);
      $(`#${code}Close2`).click(() => {
        $(`#${code}`).on('hidden.bs.modal', () => {
          let oldKey = fieldNames[i];
          fieldNames[i] = names[i];
          let newKey = fieldNames[i];
          console.log('Field Name was: ', oldKey);
          console.log('Field Name is now: ', newKey);
          fieldData.forEach((e) => {
            for (const k in e) {
              if (k == oldKey) {
                e[newKey] = e[oldKey];
                delete e[oldKey];
              } else if (k == 'Address 2') {
                e['Address2'] = e['Address 2'];
                delete e['Address 2'];
                e['Address 2'] = e['Address2'];
                delete e['Address2'];
              } else if (k == '__parsed_extra') {
                e['parsed_extra'] = e['__parsed_extra'];
                delete e['__parsed_extra'];
              }
            }
          });
          printStats('Key updated');
        });
      });
      return;
    }
  }
  if (errorCount) {
    console.log('First error:', firstError);
    buttonName = 'Fix';
    code = firstError.code;
    fix = fixButton(code, buttonName);
    message = firstError.message;
    row = firstError.row;
    modal(code, `${message} in "${fileName}", Row: ${row + 1}`, fix);
    modalDispose(code, buttonName, fixRow(code, buttonName, row));
  } else {
    buildTable();
  }
}

// track parsing time
function now() {
  return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
}

function errorFn(err, file) {
  end = now();
  console.log('ERROR:', err, file);
}

function completeFn(results) {
  end = now();
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
  printStats('Parse complete');
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
    // use jquery to select files
    $('#inputGroupFile02').parse({
      config: {
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
        error: errorFn,
      },
      before(file) {
        // executed before parsing each file begins;
        // what you return here controls the flow
        start = now();
        console.log('Parsing file...', file);
      },
      error(err, file) {
        // executed if an error occurs while loading the file,
        // or if before callback aborted for some reason
        console.log('ERROR:', err, file);
        firstError = firstError || err;
        errorCount++;
      },
      complete() {
        // executed after all files are complete
        end = now();
      }
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
        if (k == 'recordid') {
          fd += `<td id="row${r}Field${j}${k}" class="invisible">${f}</td>`;
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
    printStats();
  });
  $('#search').click(() => {
    newCSV();
    pageSwitch = true;
    main();
  });
  $('#newCSV').click(newCSV);
}

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
			temp = `${row.Zip.substring(i, i+1)}`;
			if (digits.indexOf(temp) == '-1') {
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

