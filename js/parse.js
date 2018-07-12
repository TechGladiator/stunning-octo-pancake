function fixButton(code, buttonName) {
  return `<button type="button" class="btn btn-danger" id="${code}${buttonName}">${buttonName}</button>`;
}

function printStats(msg) {
  let buttonName;
  let fix;
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
    modal(code, `${message} in "${fileName}", Row: 0. Header length errors must be corrected within file before further processing to prevent data loss.`);
    return;
  } else if (!headerCheck) {
    buildTable();
    return;
  }
  for (let i = 0; i < fieldNames.length; i++) {
    validateFieldNames(fieldNames[i]);
    if (!name) {
      console.log(fieldNames[i], ' is invalid');
      buttonName = 'Cancel';
      code = 'invalidHeader';
      fix = fixButton(code, buttonName);
      modal(code, `${fieldNames[i]} is an invalid header name. Replace with correct header: ${names[i]}?`, fix);
      modalDispose(code, buttonName);
      $(`#${code}Close2`).click(() => {
        $(`#${code}`).on('hidden.bs.modal', () => {
          let oldKey = fieldNames[i];
          fieldNames[i] = names[i];
          let newKey = fieldNames[i];
          console.log('Field Name was: ', oldKey);
          console.log('Field Name is now: ', newKey);
          fieldData.forEach((e) => {
            for (const k in e) {
              if (k == oldKey) {
                e[newKey] = e[oldKey];
                delete e[oldKey];
              } else if (k == 'Address 2') {
                e['Address2'] = e['Address 2'];
                delete e['Address 2'];
                e['Address 2'] = e['Address2'];
                delete e['Address2'];
              } else if (k == '__parsed_extra') {
                e['parsed_extra'] = e['__parsed_extra'];
                delete e['__parsed_extra'];
              }
            }
          });
          printStats('Key updated');
        });
      });
      return;
    }
  }
  if (errorCount) {
    console.log('First error:', firstError);
    buttonName = 'Fix';
    code = firstError.code;
    fix = fixButton(code, buttonName);
    message = firstError.message;
    row = firstError.row;
    modal(code, `${message} in "${fileName}", Row: ${row + 1}`, fix);
    modalDispose(code, buttonName, fixRow(code, buttonName, row));
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
    fn += `
    <th class="border border-dark invisible">Delete Record</th>
    <th scope="col">#</th>
    `;
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

function updateFields(row) {
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
          e[k] = $(`#row${i}Field${j}${names[j].replace(/\s+/g, '')}`).html();
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
  $('#map').html('');
  $('#map').removeAttr('style');
  $('.csv').removeClass('p-5');
  geoClear();
  parseFile();
}