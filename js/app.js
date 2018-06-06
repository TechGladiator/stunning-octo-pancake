const inputType = "string";
const maxUnparseLength = 10000;
let errorCount = 0;
let firstRun = true;
let rowCount = 0;
let stepped = 0;
let firstError;
let start;
let end;

function now() {
	return typeof window.performance !== 'undefined' ?
		window.performance.now() :
		0;
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
		complete: undefined,
		error: undefined
	};
}

$(function () {

	// click handler for #upload
	$('#upload').click(function () {
		if ($(this).prop('disabled') == "true") return;

		stepped = 0;
		rowCount = 0;
		errorCount = 0;
		firstError = undefined;

		const config = buildConfig();
		let input = $('#input').val();

		if (inputType == "remote") input = $('#url').val();
		else if (inputType == "json") input = $('#json').val();

		// Allow only one parse at a time
		$(this).prop('disabled', true);

		if (!firstRun) console.log("--------------------------------------------------");
		else firstRun = false;

		if (inputType == "local") {
			if (!$('#files')[0].files.length) {
				alert("Please choose at least one file to parse.");
				return enableButton();
			}

			$('#files').parse({
				config,
				before: function before(file, inputElem) {
					start = now();
					console.log("Parsing file...", file);
				},
				error: function error(err, file) {
					console.log("ERROR:", err, file);
					firstError = firstError || err;
					errorCount++;
				},
				complete: function complete() {
					end = now();
					printStats("Done with all files");
				}
			});
		} else if (inputType == "json") {
			if (!input) {
				alert("Please enter a valid JSON string to convert to CSV.");
				return enableButton();
			}

			start = now();
			let csv = Papa.unparse(input, config);
			end = now();

			console.log("Unparse complete");
			console.log("Time:", end - start || "(Unknown; your browser does not support the Performance API)", "ms");

			if (csv.length > maxUnparseLength) {
				csv = csv.substr(0, maxUnparseLength);
				console.log("(Results truncated for brevity)");
			}

			console.log(csv);

			setTimeout(enableButton, 100); // hackity-hack
		} else if (inputType == "remote" && !input) {
			alert("Please enter the URL of a file to download and parse.");
			return enableButton();
		} else {
			start = now();
			const results = Papa.parse(input, config);
			console.log("Synchronous results:", results);
			if (config.worker || config.download) console.log("Running...");
		}
	});

});

// replace input placeholder with file name
$('#inputGroupFile02').on('change', function () {
	let fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
	$(this).next('.custom-file-label').addClass("selected").html(fileName);
})