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
  if ($('#headerCheck').prop('checked')) {
    for (let i = 0; i < fieldNames.length; i++) {
      fieldNames[i] = $(`#header${i}`).html();
    }
  }
  let j = 0;
  if (row != undefined) {
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        fieldData[row][k] = $(`#row${row}Field${j}`).html();
        console.log('Update Successful');
        j++;
      }
    }
  } else {
    console.log('update something');
    let i = 0;
    fieldData.forEach(e => {
      let j = 0;
      for (let k in e) {
        if (e.hasOwnProperty(k)) {
          console.log(`e[k] = ${e[k]} or `, e[k]);
          console.log(`fieldData${[i]}.${k} was = ${e[k]}`);
          e[k] = $(`#row${i}Field${j}`).html();
          console.log(`fieldData${[i]}.${k} is now = ${e[k]}`);
        }
        j++;
      }
      i++;
    });
  }
  console.log('    Updated Data: ', fieldData);
}

function toggleFileBrowser() {
  if (fileBrowser) {
    $('#jumboHeader').html('Edit CSV Data');
    $('.wrapper').addClass('invisible');
    fileBrowser = false;
  } else {
    $('#jumboHeader').html('Upload CSV Data');
    $('.wrapper').removeClass('invisible');
    fileBrowser = true;
  }
}

function cancelCSV() {
  fileBrowser = false;
  toggleFileBrowser();
  fullResults = {};
  fieldNames = {};
  fieldData = {};
  fieldErrors = {};
  console.log('    Results:', fullResults);
	$('.csv').html('');
}

function buttonGroupClicks(row) {
  $('#editData').click(() => {
    toggleFileBrowser();
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
    cancelCSV();
  });
}

function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
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
    removeEmptyField(row);
    removeFirstErrorMessage(row);
    buildTable(row);
    buttonGroupClicks(row);
  });
}
