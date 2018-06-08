let end;
let errorCount = 0;
let fileName;
let firstError;
let firstRun = true;
let rowCount = 0;
let start;

function printStats(msg) {
	if (msg) console.log(msg);
	console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
	console.log('  Row count:', rowCount);
	console.log('     Errors:', errorCount);
	if (errorCount) console.log('First error:', firstError);
}

function now() {
	return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
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
	if (errorCount == 0) {
		$('.csv').html(`
			<div class="card">
			<div class="card-body">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Name</th>
							<th scope="col">Address</th>
							<th scope="col">Address 2</th>
							<th scope="col">City</th>
							<th scope="col">State</th>
							<th scope="col">Zip</th>
							<th scope="col">Purpose</th>
							<th scope="col">Property Owner</th>
							<th scope="col">Creation Date</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>National Zoological Park</td>
							<td>3001 Connecticut Avenue NW</td>
							<td>Suite 1001</td>
							<td>Washington</td>
							<td>DC</td>
							<td>20008</td>
							<td>Data Center</td>
							<td>Smithsonian</td>
							<td>2018-04-10</td>
						</tr>
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
			before: function before(file, inputElem) {
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
					let row = JSON.stringify(firstError.row + 2);
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