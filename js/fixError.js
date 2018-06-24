function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    console.log('Row: ', row);
    console.log(fieldData[row]);
  });
}