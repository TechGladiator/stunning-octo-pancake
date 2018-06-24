function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    buildTable(row, buttonGroup);
    $('#editData').click(() => {
      console.log('you clicked Edit Data');
    });
    $('#cancelCSV').click(() => {
      console.log('you clicked Cancel CSV Processing');
    });
  });
}