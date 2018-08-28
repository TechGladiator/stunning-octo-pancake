const { updateKeyValuePairs } = require("./updateKeyValuePairs");

const { fixButton } = require("./fixButton");
const { fixRow } = require("./fixRow");
const { modalDispose } = require("./modalDispose");
const { modal } = require("./modal");
const $ = require('jquery');
const { buildTable, validateFieldNames } = require("./app");

function printRecords(msg) {
  let buttonName;
  let fix;
  if (msg) {
    console.log(msg);
    console.log('  Row count:', rowCount);
    console.log('     Errors:', errorCount);
  }
  if (fieldNames && fieldNames.length != names.length) {
    console.log('header length is wrong');
    let codeWord;
    if (fieldNames.length < names.length) {
      codeWord = 'Few';
    }
    else {
      codeWord = 'Many';
    }
    code = `Too${codeWord}Fields`;
    message = `Too ${codeWord.toLowerCase()} fields: expected ${names.length} fields but parsed ${fieldNames.length}`;
    modal(code, `${message} in "${fileName}", Row: 0. Header length errors must be corrected within file before further processing to prevent data loss.`);
    return;
  }
  else if (!headerCheck) {
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
          updateKeyValuePairs(i);
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
  }
  else {
    buildTable();
  }
}
exports.printRecords = printRecords;
