const { returnToList } = require("./returnToList");
const $ = require("jquery");
const { updateFields, buildTable } = require("./app");

function toggleEditable(row) {
  editable = $("#csvTable");
  if (!editable[0].isContentEditable) {
    editable[0].contentEditable = "true";
    $("#editData").html("Save Edits");
    $(".border-dark").removeClass("invisible");
    if (mapped) {
      $("tbody").removeClass("latlong");
    }
  } else {
    updateFields(row);
    buildTable(row);
    if (mapped && errorCount > 0) {
      returnToList();
    }
  }
}
exports.toggleEditable = toggleEditable;
