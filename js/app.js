// global variables
const buttonGroup = `
	<div class="btn-group d-flex justify-content-center mb-3" role="group" aria-label="continue repair">
		<button type="button" class="btn btn-secondary" id="showData">Show Data</button>
		<button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
		<button type="button" class="btn btn-secondary" id="cancelCSV">Cancel CSV Processing</button>
	</div>
`;
let columnHeads = '';
let end;
let errorCount = 0;
let fieldData;
let fieldDate = true;
let fieldCount;
let fieldNames;
let fields = '';
let fieldState = false;
let fieldZip = true;
let fileName;
let firstError;
let firstRun = true;
let fullResults;
let lengthHigh = false;
let lengthLow = false;
let name = false;
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
let rowCount = 0;
let rowField;
let rowId;
let start;

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

function printStats(msg) {
	if (msg) console.log(msg);
	console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
	console.log('  Row count:', rowCount);
	console.log('     Errors:', errorCount);
	if (errorCount) console.log('First error:', firstError);
}

// tracks parsing time
function now() {
	return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
}

function modalDispose(moId, close, func) {
	$(`#${moId}${close}`).click(() => {
		$(`#${moId}`).modal('hide');
		$(`#${moId}`).on('hidden.bs.modal', () => {
			$(`.modal`).remove();
			if (func) func();
		});
	});
}

function modal(moId, moBody, moFooter) {
	$('body').append(`
  <div class="modal fade" id="${moId}" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="${moId}Label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${moId}Label">CSV File Error</h5>
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

function fixError(code, errorRow) {
	columnHeads = '';
	fields = '';
	let er;
	let errors = true;
	if (errorRow) {
		console.log('errorRow = ', errorRow);
		console.log('rowField = ', rowField);
		er = errorRow;
	} else if (rowField != undefined) {
		console.log('rowField = ', rowField);
		er = rowField;
	} else {
		er = fieldNames;
	}
	modalDispose(code, 'Fix', () => {
		for (let i = 0; i < er.length; i++) {
			const e = fieldNames[i];
			console.log(`Header ${i}: `, e);
			hideFileBrowser();
			buildTable(errors);
			if (e == '') {
				emptyHeaderAlert(i);
			}
		}
	});
}

function showFileBrowser() {
	$('#jumboHeader').html('Upload CSV Data');
	$('.wrapper').removeClass('invisible');
	$('.csv').html('');
}

function emptyHeaderAlert(i) {
	let code = 'emptyHeadersAlert';
	let cancel = `<button type="button" class="btn btn-secondary" id="${code}Close3">Cancel</button>`;
	modal(`${code}`, `Empty headers found. Would you like to remove them?`, cancel);
	removeEmptyHeaders(code, i);
}

function removeEmptyHeaders(code, i) {
	$(`#${code}`).on('shown.bs.modal', () => {
		modalDispose(code, 'Close2', () => {
			fieldNames.pop(i);
			console.log('Field Headers: ', fieldNames);
		});
		modalDispose(code, 'Close3');
	});
}

function validateRowLength(fieldRow) {
	let e;
	let rowLength = 1;
	for (let i = 0; i < rowLength; i++) {
		if (fieldRow == fieldNames) {
			e = fieldNames;
		} else {
			e = Object.values(fieldRow[i]);
			rowLength = fieldRow.length;
		}
		console.log(`Row ${i}: `, e);
		console.log(`Row ${i} Length: `, e.length);
		console.log('Expected Length: ', names.length);
		lengthHigh = false;
		lengthLow = false;
		if (e.length > names.length) {
			lengthHigh = true;
			console.log(`Row ${i} is too long.`);
			checkIfFieldNames(i);
			break;
		} else if (e.length < names.length) {
			lengthLow = true;
			console.log(`Row ${i} is too short.`);
			checkIfFieldNames(i);
			break;
		}
	}

	function checkIfFieldNames(i) {
		if (e != fieldNames) {
			rowField = fieldData[i];
			console.log('rowField = ', rowField);
			rowId = i;
			console.log('rowId = ', rowId);
		}
	}
}

function validateFieldNames(fieldName, validate) {
	name = false;
	for (let i = 0; i < names.length; i++) {
		if (fieldName == names[i]) {
			name = true;
		}
	}
	if (!name) {
		console.log(`Header "${fieldName}" is invalid`);
		if (validate) {
			modal('errorAlert', `Header "${fieldName}" is invalid`);
		}
	}
}

function validateState(field) {
	fieldState = false;
	const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

	if (field.State) {
		for (let i = 0; i < states.length; i++) {
			if (field.State.toUpperCase() == states[i]) {
				fieldState = true;
			}
		}
	}
	if (!fieldState && !undefined) {
		console.log(`${field.State} is invalid`);
		modal('errorAlert', `${field.State} is an invalid State abbreviation`);
	}
}

function validateZip(field) {
	fieldZip = true;
	const digits = '0123456789';

	if (field.Zip) {
		if (field.Zip.length != 5) {
			modal('errorAlert', `${field.Zip} is not a valid 5 digit Zip Code`);
			fieldZip = false;
		}
		for (let i = 0; i < field.Zip.length; i++) {
			temp = `${field.Zip.substring(i, i+1)}`;
			if (digits.indexOf(temp) == '-1') {
				fieldZip = false;
			}
		}
	}
	if (!fieldZip && !undefined) {
		console.log(`${field.Zip} is invalid`);
		modal('errorAlert', `${field.Zip} is not a valid 5 digit Zip Code`);
	}
}

function validateDate(field) {
	fieldDate = true;
	const regEx = /^\d{4}-\d{2}-\d{2}$/;

	if (field['Creation Date']) {
		if (!field['Creation Date'].match(regEx)) { // Invalid format
			fieldDate = false;
			console.log(`${field['Creation Date']} is an invalid date format`);
			modal('errorAlert', `${field['Creation Date']} is an invalid date format`);
		}

		const d = new Date(field['Creation Date']);

		if (!d.getTime() && d.getTime() !== 0 && fieldDate) { // Invalid date
			fieldDate = false;
			console.log(`${field['Creation Date']} is an invalid date`);
			modal('errorAlert', `${field['Creation Date']} is an invalid date`);
		}
	}
}

function getFieldNames(validate) {
	columnHeads = '';
	for (let i = 0; i < fieldNames.length; i++) {
		validateFieldNames(fieldNames[i], validate);
		if (!name) {
			editFieldNames(i);
		} else {
			columnHeads += `<th scope="col">${fieldNames[i]}</th>`;
		}
	}
}

function editFieldNames(i) {
	hideFileBrowser();
	let colId = i + 1;
	columnHeads += `<th scope="col" class="table-danger" id="${colId}" contenteditable="true" onclick="editHeaderContent(${colId}, ${i})">${fieldNames[i]}</th>`;
}

function hideFileBrowser() {
	$('#jumboHeader').html('Edit CSV Data');
	$('.wrapper').addClass('invisible');
}

function editHeaderContent(colId, i) {
	console.log($(`#${colId}`).html());
	console.log(i);
	console.log('Field Headers: ', fieldNames);
	if (fieldNames[i] == '') {
		fieldNames.pop(i);
		$('.csv').html('');
		getFieldNames();
		buildTable(true);
	}
	$(`#${colId}`).keydown((e) => {
		const code = e.which;
		if (code == 13) e.preventDefault();
		if (code == 13) {
			fieldNames[i] = $(`#${colId}`).html();
			$('.csv').html('');
			getFieldNames();
			buildTable(true);
		}
	});
}

function getFieldData() {
	fields = '';
	for (let i = 0; i < fieldData.length; i++) {
		const e = fieldData[i];
		validateState(e);
		validateZip(e);
		validateDate(e);
		fields += `
			<tr>
				<th scope="row">${i + 1}</th>
		`;
		for (const k in e) {
			if (e.hasOwnProperty(k)) {
				const f = e[k];
				if (f == e.State && !fieldState || f == e.Zip && !fieldZip || f == e['Creation Date'] && !fieldDate) {
					fields += `<td class="table-danger">${f}</td>`
				} else {
					fields += `<td>${f}</td>`;
				}
			}
		}
		fields += `</tr>`;
	}
}

function buttonGroupClicks(errors) {
	$('#showData').click(() => {
		getFieldNames(validate = false);
		buildTable(errors);
	});
	$('#repairNext').click(() => {
		// modal(errors, 'Under Construction');
		console.log(`errorCount was: ${errorCount}`);
		errorCount--;
		console.log(`errorCount is now: ${errorCount}`);
		console.log(`Number of Rows: ${fieldData.length}`);
		
		validateRowLength(fieldData);
		errorCap(fullResults, rowField, rowId);
		printStats();
		console.log('    Results:', fullResults);
		if (errorCount == 0) {
			getFieldNames(validate = true);
			getFieldData();
			buildTable();
		}
		
		// processResults(fieldData, rowField, rowId);
		if (firstError) {
			errorModal(rowField);
		}
	});
	$('#cancelCSV').click(() => {
		fullResults = {};
		console.log('    Results:', fullResults);
		$('.modal').remove();
		showFileBrowser();
	});
}

function addButtonGroup(errors) {
	if (errors) {
		return buttonGroup;
	} else {
		return '';
	}
}

function buildTable(errors) {
	let csvTable = '';
	if (columnHeads != '') {
		csvTable = `
			<div class="card">
				<div class="card-body">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th scope="col">#</th>
								${columnHeads}
							</tr>
						</thead>
						<tbody>
							${fields}
						</tbody>
					</table>
				</div>
			</div>
		`;
	}
	$('.csv').html(`
		${addButtonGroup(errors)}
		${csvTable}
	`);
	buttonGroupClicks(errors);
}

function errorCap(results, fieldRow, row) {
	if (results && results.errors) {
		if (results.errors) {
			let code;
			let codeMsg;
			if (lengthHigh || lengthLow) {
				if (lengthHigh) {
					code = "TooManyFields";
					codeMsg = "Too Many Fields: ";
				} else if (lengthLow) {
					code = "TooFewFields";
					codeMsg = "Too Few Fields: ";
				}
				if (!fieldRow) {
					errorCount = results.errors.length + 1;
					fieldRow = fieldNames;
					console.log('fieldRow = fieldNames: ', fieldRow);
				}
				firstError = {
					"type": "FieldMismatch",
					"code": code,
					"message": `${codeMsg}expected ${names.length} but parsed ${Object.values(fieldRow).length}`,
					"row": row || 0
				};
			} else {
				errorCount = results.errors.length;
				firstError = results.errors[0];
			}
		}
		if (results.data && results.data.length > 0)
			rowCount = results.data.length;
	}
}

function completeFn(results) {
	end = now();

	fullResults = results;
	fieldNames = fullResults.meta.fields;
	fieldData = fullResults.data;

	processResults();
}

function processResults() {
	validateRowLength(fieldNames);
	errorCap(fullResults);
	printStats('Parse complete');
	console.log('    Results:', fullResults);
	if (errorCount == 0) {
		getFieldNames(validate = true);
		getFieldData();
		buildTable();
	}
}

function errorFn(err, file) {
	end = now();
	console.log('ERROR:', err, file);
}

function buildConfig() {
	return {
		delimiter: '',
		header: true,
		dynamicTyping: false,
		skipEmptyLines: true,
		preview: 0,
		step: undefined,
		encoding: '',
		worker: false,
		comments: false,
		complete: completeFn,
		error: errorFn
	};
}

function getRowNumb(row) {
	if (firstError.row != 0 || !lengthHigh && !lengthLow) {
		row = JSON.stringify(firstError.row + 2);
	} else {
		row = JSON.stringify(firstError.row + 1);
	}
	return row;
}

function parseFile(config) {
	$('#inputGroupFile02').parse({
		config,
		before: function before(file) {
			start = now();
			console.log('Parsing file...', file);
		},
		error: function error(err, file) {
			console.log('ERROR:', err, file);
			firstError = firstError || err;
			errorCount++;
		},
		complete: function complete() {
			end = now();
			printStats("Done with all files");
			if (firstError) {
				errorModal();
			}
		}
	});
}

function errorModal(errorRow) {
	let code = firstError.code;
	let errorMsg = JSON.stringify(firstError.message);
	let row;
	row = getRowNumb(row);
	modal(`${code}`, `${errorMsg.replace(/['"]+/g, '')}: ${fileName}, Row: ${row}`, `<button type="button" class="btn btn-danger" id="${code}Fix">Fix</button>`);
	fixError(code, errorRow);
	if (fieldNames.length != names.length) {
		console.log('Field Headers: ', fieldNames);
	}
}

function beginParsing() {
	$('#upload').click(() => {
		rowCount = 0;
		errorCount = 0;
		firstError = undefined;
		const config = buildConfig();
		if (!firstRun)
			console.log("--------------------------------------------------");
		else
			firstRun = false;
		if (!$('#inputGroupFile02')[0].files.length) {
			modal('errorAlert', 'Please choose at least one file to parse');
		}
		parseFile(config);
	});
}

beginParsing();