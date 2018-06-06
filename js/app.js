// replace input placeholder with file name
$('#inputGroupFile02').on('change', function () {
	let fileName = $(this).val();
	fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
	$(this).next('.custom-file-label').addClass("selected").html(fileName);
})

// click handler for #upload
$('#upload').click(function () {
	console.log('clicked');

	// select files using jQuery
	$('input[type=file]').parse({
		config: {
			// base config to use for each file
			delimiter: "", // auto-detect
			newline: "", // auto-detect
			quoteChar: '"',
			escapeChar: '"',
			header: false,
			trimHeader: false,
			dynamicTyping: false,
			preview: 0,
			encoding: "",
			worker: false,
			comments: false,
			step: undefined,
			complete: undefined,
			error: undefined,
			download: false,
			skipEmptyLines: false,
			chunk: undefined,
			fastMode: undefined,
			beforeFirstChunk: undefined,
			withCredentials: undefined,
			transform: undefined
		},
		before: function (file, inputElem) {
			// executed before parsing each file begins;
			// what you return here controls the flow
		},
		error: function (err, file, inputElem, reason) {
			// executed if an error occurs while loading the file,
			// or if before callback aborted for some reason
		},
		complete: function () {
			// executed after all files are complete
		}
	});
});