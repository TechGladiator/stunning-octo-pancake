const { toggleEditable } = require("./toggleEditable");
const { modal } = require("./modal");
let { errorCount, fieldData } = require("./globalLet");
const $ = require("jquery");
const { buildTable } = require("./app");

function deleteRow(row) {
  fieldData.splice(row, 1);
  if (errorCount > 0) {
    errorCount -= 1;
  }
  if ($(`#row${row}Field11record_id`).html()) {
    let recordId = $(`#row${row}Field11record_id`).html();
    let importId = $(`#row${row}Field12import_id`).html();
    $.ajax({
      url: `/imports/${importId}/records/${recordId}`,
      type: 'delete',
      success: (res) => {
        modal('Deleted', `Deleted Record.`);
      }
    });
  }
  buildTable();
  toggleEditable();
}
