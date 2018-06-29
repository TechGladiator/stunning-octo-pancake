// Users navigate to web site and upload a CSV file

function printStats(msg) {
  const fix = `<button type="button" class="btn btn-danger" id="${code}Fix">Fix</button>`;
  if (msg) {
    console.log(msg);
    console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
    console.log('  Row count:', rowCount);
    console.log('     Errors:', errorCount);
  }
  if (fieldNames && fieldNames.length != names.length) {
    console.log('header length is wrong');
    let codeWord;
    if (fieldNames.length < names.length) {
      codeWord = 'Few';
    } else {
      codeWord = 'Many';
    }
    code = `Too${codeWord}Fields`;
    message = `Too ${codeWord.toLowerCase()} fields: expected ${names.length} fields but parsed ${fieldNames.length}`;
    modal(code, `${message} in "${fileName}", Row: 0`, fix);
    return;
  }
  if (errorCount) {
    console.log('First error:', firstError);
    code = firstError.code;
    message = firstError.message;
    row = firstError.row;
    modal(code, `${message} in "${fileName}", Row: ${row + 1}`, fix);
    modalDispose(code, 'Fix', fixRow(code, 'Fix', row));
  } else {
    buildTable();
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
  fullResults = results;
  fieldNames = fullResults.meta.fields;
  fieldData = fullResults.data;
  fieldErrors = fullResults.errors;
  if (fullResults && fieldErrors) {
    if (fieldErrors) {
      errorCount = fieldErrors.length;
      firstError = fieldErrors[0];
    }
    if (fieldData && fieldData.length > 0) {
      rowCount = fieldData.length;
    }
  }
  printStats('Parse complete');
  console.log('    Results:', fullResults);
}

// Enable application to parse file
function parseFile() {

  $('#jumboHeader').addClass('mb-5');
  $('#jumboHeader').html('Upload CSV File');
  $('.wrapper').html(`${wrapper}`);
  $('.csv').html('');

  $('#headerCheck').click(() => {
    if ($('#headerCheck').prop('checked')) {
      headerCheck = true;
      console.log('check box is checked = ', headerCheck);
    } else {
      headerCheck = false;
      console.log('check box is checked = ', headerCheck);
    }
  });

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

  $('#upload').click(() => {
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
      return;
    }
    // use jquery to select files
    $('#inputGroupFile02').parse({
      config: {
        // base config to use for each file
        delimiter: "",
        header: headerCheck,
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
      before(file) {
        // executed before parsing each file begins;
        // what you return here controls the flow
        start = now();
        console.log('Parsing file...', file);
      },
      error(err, file) {
        // executed if an error occurs while loading the file,
        // or if before callback aborted for some reason
        console.log('ERROR:', err, file);
        firstError = firstError || err;
        errorCount++;
      },
      complete() {
        // executed after all files are complete
        end = now();
      }
    });
  });
}

function getFieldNames(fn) {
  if (headerCheck) {
    let i = 0;
    fn += `<th scope="col">#</th>`;
    fieldNames.forEach(e => {
      validateFieldNames(e);
      if (name) {
        fn += `<th id="header${i}">${e}</th>`;
      } else {
        fn += `<th class="table-danger" id="header${i}">${e}</th>`;
      }
      i++;
    });
  }
  return fn;
}

function updateFields(row, headerLengthWrong) {
  if (headerCheck) {
    for (let i = 0; i < fieldNames.length; i++) {
      fieldNames[i] = $(`#header${i}`).html();
      validateFieldNames(fieldNames[i]);
      if (name) {
        $(`#header${i}`).removeClass('table-danger');
      } else {
        $(`#header${i}`).addClass('table-danger');
      }
    }
  }
  if (headerLengthWrong) {
    return;
  }
  let j = 0;
  if (row != undefined) {
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        fieldData[row][k] = $(`#row${row}Field${j}`).html();
        validateField(fieldData[row], k, row, j);
        j++;
      }
    }
  } else {
    let i = 0;
    fieldData.forEach(e => {
      let j = 0;
      for (const k in e) {
        if (e.hasOwnProperty(k)) {
          e[k] = $(`#row${i}Field${j}`).html();
          validateField(e, k, i, j);
        }
        j++;
      }
      i++;
    });
  }
  console.log('    Updated Data: ', fieldData);
}

function cancelCSV() {
  fullResults = {};
  fieldNames = {};
  fieldData = {};
  fieldErrors = {};
  console.log('    Results:', fullResults);
  parseFile();
}