function toggleEditable() {
  editable = $('#csvTable');
  if (!editable[0].isContentEditable) {
    editable[0].contentEditable = 'true';
    $('#editData').html('Save Edits');
    $('.border-dark').removeClass('invisible');
    if (mapped) {
      $('tbody').removeClass('latlong');
    }
  }
  else {
    editable[0].contentEditable = 'false';
    $('#editData').html('Edit Data');
    $('.border-dark').addClass('invisible');
    if (mapped) {
      $('tbody').addClass('latlong');
    }
  }
}

function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      if (k != 'Address 2' && fieldData[row][k] == '') {
        console.log(`${k} != 'Address 2'`);
        console.log('deleted empty field: ', k);
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
  });
}

function deleteRow(row) {
  console.log(fieldData.splice(row, 1));
  buildTable();
  toggleEditable();
}