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

function buttonGroupClicks(row) {
  $('#editData').click(() => {
    makeEditable();
    updateFields(row);
  });
  $('#repairNext').click(() => {
    console.log('you clicked Repair Next Error');
  });
  $('#cancelCSV').click(() => {
    console.log('you clicked Cancel CSV Processing');
  });
}

function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        console.log(`${k} : ${fieldData[row][k]}`);
        if (k != 'Address 2' && fieldData[row][k] == '') {
          console.log('k != \'Address 2\'');
          console.log('delete');
          delete fieldData[row][k];
        }
      }
    }
    $(`.modal`).on('hidden.bs.modal', () => {
      if (Object.values(fieldData[row]).length == fieldNames.length) {
        fieldErrors.shift(0);
        console.log(fieldErrors);
        errorCount--;
        firstError = fieldErrors[0];
        console.log('First Error:', firstError);
      }
    });
    buildTable(row, buttonGroup);
    buttonGroupClicks(row);
  });
}