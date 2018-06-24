// global variables
var inputType = "string";
var stepped = 0,
  rowCount = 0,
  errorCount = 0,
  firstError;
var start, end;
var firstRun = true;
var maxUnparseLength = 10000;

// Users navigate to web site and upload a CSV file
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

// track parsing time
function now() {
  return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
}

function errorFn(err, file) {
  end = now();
  console.log('ERROR:', err, file);
}

function completeFn(results) {
  end = now();

  if (results && results.errors) {
    if (results.errors) {
      errorCount = results.errors.length;
      firstError = results.errors[0];
    }
    if (results.data && results.data.length > 0) {
      rowCount = results.data.length;
    }
  }

  printStats('Parse complete');
  console.log('    Results:', results);
}

// Enable application to parse file
// use jquery to select files
$('#inputGroupFile02').parse({
  config: {
    // base config to use for each file
    delimiter: "", // auto-detect
    header: $('#headerCheck').prop('checked'),
    dynamicTyping: false,
    skipEmptyLines: false,
    preview: 0,
    step: undefined,
    encoding: "",
    worker: false,
    comments: false,
    complete: completeFn,
    error: errorFn,
  },
  before: function (file) {
    // executed before parsing each file begins;
    // what you return here controls the flow
    start = now();
    console.log('Parsing file...', file);
  },
  error: function (err, file) {
    // executed if an error occurs while loading the file,
    // or if before callback aborted for some reason
    console.log('ERROR:', err, file);
    firstError = firstError || err,
    errorCount++;
  },
  complete: function () {
    // executed after all files are complete
    end = now();
    printStats('Done with all files');
  }
});

// Application first validates the number of columns in the CSV

// Confirm correct number of columns are present based on header row

// Prompt user with missing columns

// Require all columns to be present

// Use an alert modal to prompt user to correct

// Implement Bootstrap modal

// Application displays all successful records

// Append the parsed and validated data to HTML document body as a table

// Validate data type formats in each record

// Flag records that do not meet data type formats

// Implement JavaScript methods for data validation

// Highlight specific fields of records with data entry issues

// Guide user in cleaning records

// Correct errant fields or remove the record 

// i.e. “District of Columbia” instead of “DC” in the state field should be flagged and user forced to correct field, delete the record, or cancel entire process

// Once corrected, check again to ensure data type formats are met and flagged accordingly 

// Alternatives: 

// Wizard based process to do field clean up on records with problems only

// Highlight records with issues and establish a repair-next button that jumps to each record with an issue 

// Clear records that have been corrected as user goes

// Once all records are cleaned or removed, user is presented with an option to name and save the data set

// Display the name of the imported data set on the grid header or top of page