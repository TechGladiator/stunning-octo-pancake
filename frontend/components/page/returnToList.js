let { errorCount } = require("./globalLet");
const $ = require("jquery");
const { buildTable } = require("./temp");

function returnToList() {
  $("#mapData").html("Return to list");
  $("#mapData").click(() => {
    errorCount = 0;
    buildTable();
  });
}
exports.returnToList = returnToList;
