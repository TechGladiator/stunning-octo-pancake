const { toggleEditable } = require("./toggleEditable");
const { modal } = require("./modal");
const $ = require('jquery');
const { buildTable } = require("./app");
function deleteRow(row) {
  fieldData.splice(row, 1);
  if (errorCount > 0) {
    errorCount--;
  }
  if ($(`#row${row}Field11recordid`).html()) {
    let id = $(`#row${row}Field11recordid`).html();
    $.ajax({
      url: '/imports/records/' + id,
      type: 'delete',
      success: (res) => {
        modal('Deleted', res);
      }
    });
  }
  buildTable();
  toggleEditable();
}