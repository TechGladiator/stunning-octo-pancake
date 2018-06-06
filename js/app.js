var inputType = "string";
var stepped = 0,
	rowCount = 0,
	errorCount = 0,
	fileName,
	firstError;
var start, end;
var firstRun = true;
var maxUnparseLength = 10000;

function printStats(msg) {
	if (msg)
		console.log(msg);
	console.log("       Time:", (end - start || "(Unknown; your browser does not support the Performance API)"), "ms");
	console.log("  Row count:", rowCount);
	if (stepped)
		console.log("    Stepped:", stepped);
	console.log("     Errors:", errorCount);
	if (errorCount)
		console.log("First error:", firstError);
}

function buildConfig() {
	return {
		delimiter: $('#delimiter').val(),
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		error: errorFn,
		download: inputType == "remote"
	};
}

function stepFn(results, parser) {
	stepped++;
	if (results) {
		if (results.data)
			rowCount += results.data.length;
		if (results.errors) {
			errorCount += results.errors.length;
			firstError = firstError || results.errors[0];
		}
	}
}

function completeFn(results) {
	end = now();

	if (results && results.errors) {
		if (results.errors) {
			errorCount = results.errors.length;
			firstError = results.errors[0];
		}
		if (results.data && results.data.length > 0)
			rowCount = results.data.length;
	}

	printStats("Parse complete");
	console.log("    Results:", results);

	// icky hack
	setTimeout(enableButton, 100);
}

function errorFn(err, file) {
	end = now();
	console.log("ERROR:", err, file);
	enableButton();
}

function enableButton() {
	$('#upload').prop('disabled', false);
}

function now() {
	return typeof window.performance !== 'undefined' ?
		window.performance.now() :
		0;
}

$(function () {
	// Demo invoked
	$('#upload').click(function () {
		if ($(this).prop('disabled') == "true")
			return;

		stepped = 0;
		rowCount = 0;
		errorCount = 0;
		firstError = undefined;

		var config = buildConfig();
		var input = $('#inputGroupFile02').val();

		if (inputType == "remote")
			input = $('#url').val();
		else if (inputType == "json")
			input = $('#json').val();

		// Allow only one parse at a time
		$(this).prop('disabled', true);

		if (!firstRun)
			console.log("--------------------------------------------------");
		else
			firstRun = false;

		if (!$('#inputGroupFile02')[0].files.length) {
			alert("Please choose at least one file to parse.");
			return enableButton();
		}

		$('#inputGroupFile02').parse({
			config: config,
			before: function (file, inputElem) {
				start = now();
				console.log("Parsing file...", file);
			},
			error: function (err, file) {
				console.log("ERROR:", err, file);
				firstError = firstError || err;
				errorCount++;
			},
			complete: function () {
				end = now();
				printStats("Done with all files");
			}
		});
	});
});

// replace input placeholder with file name
$('#inputGroupFile02').on('change', function () {
	fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
	$(this).next('.custom-file-label').addClass("selected").html(fileName);
})