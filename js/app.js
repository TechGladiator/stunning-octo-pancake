$('input[type=file]').parse({
	config: {
		// base config to use for each file
	},
	before: function(file, inputElem)
	{
		// executed before parsing each file begins;
		// what you return here controls the flow
	},
	error: function(err, file, inputElem, reason)
	{
		// executed if an error occurs while loading the file,
		// or if before callback aborted for some reason
	},
	complete: function()
	{
		// executed after all files are complete
	}
});