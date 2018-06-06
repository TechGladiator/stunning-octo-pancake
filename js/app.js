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
			error: undefined,
		},
		before: function (file, inputElem) {
			// executed before parsing each file begins;
			// what you return here controls the flow
			console.log("Parsing file...", file);
		},
		error: function (err, file, inputElem, reason) {
			// executed if an error occurs while loading the file,
			// or if before callback aborted for some reason
		},
		complete: function () {
			// executed after all files are complete
			console.log('Done with all files');
		}
	});
});