function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    buildTable(row);
  });
}