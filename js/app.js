// global variables
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
let lengthHigh = false;
let lengthLow = false;
let name = false;
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
let rowCount = 0;
let start;

// replace input placeholder with file name
$('#inputGroupFile02').on('change', function () {
	fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
	$(this).next('.custom-file-label').addClass('selected').html(fileName);
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

function modal(moBody, moFooter) {
	$('#errorAlert').modal('show');
	$('#modalBody').html(`<h5 class="text-center">${moBody}</h5>`);
	if (moFooter) {
		$('#modalFooter').html(`${moFooter}<button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>`);
	} else {
		$('#modalFooter').html(`<button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>`);
	}
}

function errorModal() {
	$('#errorAlert').modal('hide');
	buildTable();
}

function validateRowLength(fieldNames) {
	console.log(fieldNames.length);
	console.log(names.length);
	lengthHigh = false;
	lengthLow = false;
	if (fieldNames.length > names.length) {
		lengthHigh = true;
	} else if (fieldNames.length < names.length) {
		lengthLow = true;
	}
}

function validateFieldNames(fieldName) {
	name = false;
	for (let i = 0; i < names.length; i++) {
		if (fieldName == names[i]) {
			name = true;
		}
	}
	if (!name) {
		console.log(`${fieldName} is invalid`);
		modal(`Header ${fieldName} is invalid`);
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
		modal(`${field.State} is an invalid State abbreviation`);
	}
}

function validateZip(field) {
	fieldZip = true;
	const digits = '0123456789';

	if (field.Zip) {
		if (field.Zip.length != 5) {
			modal(`${field.Zip} is not a valid 5 digit Zip Code`);
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
		modal(`${field.Zip} is not a valid 5 digit Zip Code`);
	}
}

function validateDate(field) {
	fieldDate = true;
	const regEx = /^\d{4}-\d{2}-\d{2}$/;

	if (field['Creation Date']) {
		if (!field['Creation Date'].match(regEx)) { // Invalid format
			fieldDate = false;
			console.log(`${field['Creation Date']} is an invalid date format`);
			modal(`${field['Creation Date']} is an invalid date format`);
		}
		
		const d = new Date(field['Creation Date']);
		
		if (!d.getTime() && d.getTime() !== 0 && fieldDate) { // Invalid date
			fieldDate = false;
			console.log(`${field['Creation Date']} is an invalid date`);
			modal(`${field['Creation Date']} is an invalid date`);
		}
	}
}

function getFieldNames() {
	columnHeads = '';
	let colArray = [];
	for (let i = 0; i < fieldNames.length; i++) {
		validateFieldNames(fieldNames[i]);
		if (!name) {
			$('#jumboHeader').html('Edit CSV Data');
			$('.wrapper').addClass('invisible');
			let colId = i + 1;
			columnHeads += `<th scope="col" class="table-danger" id="${colId}" contenteditable="true">${fieldNames[i]}</th>`;
			let colIdSelector = `#${colId}`;
			console.log(colIdSelector);
			colArray.push($(colIdSelector).val());
		} else {
			columnHeads += `<th scope="col">${fieldNames[i]}</th>`;
		}
	}
	console.log(colArray);
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

function buildTable() {
	getFieldNames();
	getFieldData();
	$('.csv').html(`
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
	`);
}

function errorCap(results) {
	if (results && results.errors) {
		if (results.errors) {
			let code;
			let codeMsg;
			if (lengthHigh || lengthLow) {
				if (lengthHigh) {
					code = "TooManyFields";
					codeMsg = "Too Many Fields: ";
				}
				else if (lengthLow) {
					code = "TooFewFields";
					codeMsg = "Too Few Fields: ";
				}
				errorCount = results.errors.length + 1;
				firstError = {
					"type": "FieldMismatch",
					"code": code,
					"message": `${codeMsg}expected ${names.length} but parsed ${fieldNames.length}`,
					"row": 0
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

	fieldNames = results.meta.fields;
	fieldData = results.data;
	
	validateRowLength(fieldNames);
	
	errorCap(results);

	printStats('Parse complete');
	console.log('    Results:', results);

	if (errorCount == 0) {
		buildTable();
	} else {
		$('.csv').html('');
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
		skipEmptyLines: false,
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
	}
	else {
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
				let errorMsg = JSON.stringify(firstError.message);
				let row;
				row = getRowNumb(row);
				modal(`${errorMsg.replace(/['"]+/g, '')}: ${fileName}, Row: ${row}`, `<button type="button" class="btn btn-danger" onclick="errorModal()">Fix</button>`);
				if (fieldNames.length != 9) {
					console.log(fieldNames);
				}
			}
		}
	});
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
			modal('Please choose at least one file to parse');
		}
		parseFile(config);
	});
}

beginParsing();