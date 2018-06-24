// global variables
var rowCount = 0,
  errorCount = 0,
  fieldData, fieldNames, firstError, fullResults;
var start, end;
var firstRun = true;

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
  if (msg)
    console.log(msg);
  console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
  console.log('  Row count:', rowCount);
  console.log('     Errors:', errorCount);
  if (errorCount) {
    console.log('First error:', firstError);
    modal(`${firstError.type}`, `First error: ${firstError.message}`);
  }
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
  fullResults = results;
  fieldNames = results.meta.fields;
  fieldData = results.data;
  printStats('Parse complete');
  console.log('    Results:', results);
}

// Enable application to parse file
$('#upload').click(function () {
  rowCount = 0;
  errorCount = 0;
  firstError = undefined;

  if (!firstRun) {
    console.log('--------------------------------------------------');
  } else {
    firstRun = false;
  }

  if (!$('#inputGroupFile02')[0].files.length) {
    modal("noFileChosen", "Please choose at least one file to parse.");
  }

  // use jquery to select files
  $('#inputGroupFile02').parse({
    config: {
      // base config to use for each file
      delimiter: "",
      header: $('#headerCheck').prop('checked'),
      dynamicTyping: false,
      skipEmptyLines: true,
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
      firstError = firstError || err;
      errorCount++;
    },
    complete: function () {
      // executed after all files are complete
      end = now();
      printStats('Done with all files');
    }
  });
});