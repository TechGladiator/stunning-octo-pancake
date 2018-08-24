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
