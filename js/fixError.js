function makeEditable() {
  const editable = $('#headings, #dataEntered');
  console.log('editable = ', editable);
  if (!editable[0].isContentEditable) {
    editable[0].contentEditable = 'true';
    editable[1].contentEditable = 'true';
    $('#editData').html('Save Edits');
  }
  else {
    editable[0].contentEditable = 'false';
    editable[1].contentEditable = 'false';
    $('#editData').html('Edit Data');
  }
}

function updateFields(row) {
  for (let i = 0; i < fieldNames.length; i++) {
    fieldNames[i] = $(`#header${i}`).html();
    console.log(fieldNames[i]);
  }
  let j = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      fieldData[row][k] = $(`#field${j}`).html();
      console.log(fieldData[row][k]);
      j++;
    }
  }
}

function hideFileBrowser() {
  $('#jumboHeader').html('Edit CSV Data');
	$('.wrapper').addClass('invisible');
}

function showFileBrowser() {
  $('#jumboHeader').html('Upload CSV Data');
	$('.wrapper').removeClass('invisible');
	$('.csv').html('');
}

function buttonGroupClicks(row) {
  $('#editData').click(() => {
    makeEditable();
    updateFields(row);
  });
  $('#repairNext').click(() => {
    printStats();
    if (firstError == undefined) {
      modal('noErrors', 'All rows have the correct number of fields');
    }
  });
  $('#cancelCSV').click(() => {
    fullResults = {};
    fieldNames = {};
    fieldData = {};
    fieldErrors = {};
    console.log('    Results:', fullResults);
    showFileBrowser();
  });
}

function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      console.log(`${k} : ${fieldData[row][k]}`);
      if (k != 'Address 2' && fieldData[row][k] == '') {
        console.log('k != \'Address 2\'');
        console.log('delete');
        delete fieldData[row][k];
      }
      if (Object.values(fieldData[row]).length < fieldNames.length) {
        console.log('fieldData is less then fieldNames');
        fieldData[row][`filler${i}`] = '';
        i++;
      }
    }
  }
}

function removeFirstErrorMessage(row) {
  $(`.modal`).on('hidden.bs.modal', () => {
    if (Object.values(fieldData[row]).length == fieldNames.length) {
      fieldErrors.shift(0);
      console.log(fieldErrors);
      errorCount--;
      firstError = fieldErrors[0];
      console.log('     Errors:', errorCount);
      console.log('First Error:', firstError);
    }
  });
}

function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    hideFileBrowser();
    removeEmptyField(row);
    removeFirstErrorMessage(row);
    buildTable(row);
    buttonGroupClicks(row);
  });
}
