// global variables
let end;
let errorCount = 0;
let fileName;
let firstError;
let firstRun = true;
let name = false;
let rowCount = 0;
let start;

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

function validateFieldNames(fieldName) {

	const names = [ 'Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date' ];

	if (fieldName.length != names.length) {
		if (fieldName.length > names.length) {
			console.log('You have too many field headers');
		} else {
			console.log('You don\'t have enough field headers');
		}
	} else {
		console.log('field header count is good')
	}
	
	for (let i = 0; i < names.length; i++) {
		if(fieldName == names[i]) {
			console.log(`${fieldName} is valid`);
			name = true;
		}
	}

	if (!name) {
		console.log(`${fieldName} is invalid`);
	}
}

function completeFn(results) {
	end = now();

	if (results && results.errors) {
		if (results.errors) {
			errorCount = results.errors.length;
			firstError = results.errors[0];
		}
		if (results.data && results.data.length > 0) rowCount = results.data.length;
	}

	printStats('Parse complete');
	console.log('    Results:', results);

	const fieldNames = results.meta.fields;
	const fieldData = results.data;

	let columnHeads = '';
	let fields = '';

	function getFieldNames() {
		for (let i = 0; i < fieldNames.length; i++) {
			validateFieldNames(fieldNames[i]);
			columnHeads += `<th scope="col">${fieldNames[i]}</th>`;
		}
	}

	function validateState(field) {

		fieldState = false;

		const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

		for (let i = 0; i < states.length; i++) {
			if(field.State.toUpperCase() == states[i]) {
				console.log(`${field.State} is valid`);
				fieldState = true;
			}
		}

		if (!fieldState) {
			console.log(`${field.State} is invalid`);
		}
	}
	
	function getFieldData() {
		for (let i = 0; i < fieldData.length; i++) {
			const e = fieldData[i];
			validateState(e);
			fields += `
				<tr>
					<th scope="row">${i + 1}</th>
			`;
			for (const k in e) {
				if (e.hasOwnProperty(k)) {
					const f = e[k];
					fields += `<td>${f}</td>`;
				}
			}
			fields += `</tr>`;
		}
	}

	if (errorCount == 0) {
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

$(() => {
	// Demo invoked
	$('#upload').click(function () {

		rowCount = 0;
		errorCount = 0;
		firstError = undefined;

		const config = buildConfig();
		const input = $('#inputGroupFile02').val();

		if (!firstRun) console.log("--------------------------------------------------");
		else firstRun = false;

		if (!$('#inputGroupFile02')[0].files.length) {
			$('#errorAlert').modal('show');
			$('#modalBody').html(`<h5 class="text-center">Please choose at least one file to parse.</h5>`);
		}

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
					if (!firstError.row[0]) {
						row = JSON.stringify(firstError.row + 2);
					} else {
						row = JSON.stringify(firstError.row + 1);
					}
					$('#errorAlert').modal('show');
					$('#modalBody').html(`<h5 class="text-center">${errorMsg.replace(/['"]+/g, '')} ${fileName} Row: ${row}</h5>`);
				}
			}
		});


	});
});

// replace input placeholder with file name
$('#inputGroupFile02').on('change', function () {
	fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
	$(this).next('.custom-file-label').addClass('selected').html(fileName);
});