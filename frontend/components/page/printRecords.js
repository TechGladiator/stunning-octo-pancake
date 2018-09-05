const { updateKeyValues } = require("./updateKeyValues");
const { fixButton } = require("./fixButton");
const { fixRow } = require("./fixRow");
const { modalDispose } = require("./modalDispose");
const { modal } = require("./modal");
const {
  errorCount,
  fieldNames,
  firstError,
  rowCount,
  fileName,
  headerCheck,
  name
} = require("./globalLets");
let { code, message, row } = require("./globalLets");
const { names } = require("./globalConsts");
const { buildTable, validateFieldNames } = require("./temp");

function printRecords(msg) {
  let buttonName;
  let fix;
  if (msg) {
    modal(
      "",
      `${msg}
               Row count: ${rowCount}
                  Errors: ${errorCount}`
    );
  }
  if (fieldNames && fieldNames.length !== names.length) {
    let codeWord;
    if (fieldNames.length < names.length) {
      codeWord = "Few";
    } else {
      codeWord = "Many";
    }
    code = `Too${codeWord}Fields`;
    message = `Too ${codeWord.toLowerCase()} fields: expected ${
      names.length
    } fields but parsed ${fieldNames.length}`;
    modal(
      code,
      `${message} in "${fileName}", Row: 0. Header length errors must be corrected within file before further processing to prevent data loss.`
    );
    return;
  } else if (!headerCheck) {
    buildTable();
    return;
  }
  for (let i = 0; i < fieldNames.length; i += 1) {
    validateFieldNames(fieldNames[i]);
    if (!name) {
      buttonName = "Cancel";
      code = "invalidHeader";
      fix = fixButton(code, buttonName);
      modal(
        code,
        `${
          fieldNames[i]
        } is an invalid header name. Replace with correct header: ${names[i]}?`,
        fix
      );
      modalDispose(code, buttonName);
      modalDispose(code, "Close2", updateKeyValues(i));
      return;
    }
  }
  if (errorCount) {
    buttonName = "Fix";
    fix = fixButton(code, buttonName);
    ({ code, message, row } = firstError);
    modal(code, `${message} in "${fileName}", Row: ${row + 1}`, fix);
    modalDispose(code, buttonName, fixRow(code, buttonName, row));
  } else {
    buildTable();
  }
}
exports.printRecords = printRecords;
