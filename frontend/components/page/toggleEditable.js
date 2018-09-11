const $ = require("jquery");
const { getRecords } = require("./getRecords");
const { modal } = require("./modal");
const { returnToList } = require("./returnToList");
const { errorCount, fieldData, mapped, names } = require("./globalLets");
const { updateFields, buildTable, newCSV } = require("./temp");
let { editable } = require("./globalLets");

function toggleEditable(row) {
  editable = $("#csvTable");
  if (!editable[0].isContentEditable) {
    editable[0].contentEditable = "true";
    $("#editData").html("Save Edits");
    $(".border-dark").removeClass("invisible");
    if (mapped) {
      $("tbody").removeClass("latlong");
    }
    if (fieldData[0].id) {
      $("#newRecord").removeClass("invisible");
    }
  } else {
    let r = 0;
    while (r < fieldData.length) {
      r += 1;
    }
    if ($(`#row${r}Field0Name`).html() !== "") {
      const newRow = {};
      for (let i = 0; i < names.length; i += 1) {
        const e = names[i];
        if (e === "Lat" || e === "Long") {
          newRow[`${e}`] = "0.0";
        } else {
          newRow[`${e}`] = $(
            `#row${r}Field${i}${e.replace(/\s+/g, "")}`
          ).html();
        }
      }
      $.ajax({
        url: `/imports/${$("#row0Field12import_id").html()}/records/`,
        type: "post",
        data: JSON.stringify(newRow),
        dataType: "json",
        contentType: "application/json",
        success: res => {
          newCSV();
          getRecords(res.id, res.import_name);
        },
        error: err => {
          modal(err.status, err.statusText);
        }
      });
    }

    updateFields(row);
    buildTable(row);
    if (mapped && errorCount > 0) {
      returnToList();
    }
  }
}
exports.toggleEditable = toggleEditable;
