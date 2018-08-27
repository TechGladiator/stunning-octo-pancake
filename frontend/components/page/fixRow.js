const { removeFirstErrorMessage } = require("./removeFirstErrorMessage");
const { removeEmptyField } = require("./removeEmptyField");
const $ = require('jquery');
const { buildTable } = require("./app");
function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    removeEmptyField(row);
    removeFirstErrorMessage(row);
    buildTable(row);
  });
}
exports.fixRow = fixRow;