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

function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    buildTable(row, buttonGroup);
    $('#editData').click(() => {
      console.log('you clicked Edit Data');
      makeEditable();
    });
    $('#repairNext').click(() => {
      console.log('you clicked Repair Next Error');
    });
    $('#cancelCSV').click(() => {
      console.log('you clicked Cancel CSV Processing');
    });
  });
}