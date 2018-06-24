function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    buildTable(row, buttonGroup);
    $('#editData').click(() => {
      console.log('you clicked Edit Data');
      const editable = $('#headings, #dataEntered');
      console.log('editable = ', editable);
      if (!editable[0].isContentEditable) {
        editable[0].contentEditable = 'true';
        editable[1].contentEditable = 'true';
      } else {
        editable[0].contentEditable = 'false';
        editable[1].contentEditable = 'false';
      }
    });
    $('#cancelCSV').click(() => {
      console.log('you clicked Cancel CSV Processing');
    });
  });
}