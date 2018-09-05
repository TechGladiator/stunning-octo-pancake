const { modal } = require("./modal");
const { setHeader } = require("./setHeader");
let { fieldData, fieldNames } = require("./globalLets");
const { names } = require("./globalConsts");
const $ = require("jquery");
const { printRecords } = require("./temp");

function getRecords(id, importName) {
  $.ajax({
    url: `/imports/${id}/records/`,
    type: "get",
    success: res => {
      if (res.length > 0) {
        setHeader(importName);
        names.push("Lat", "Long");
        fieldNames = names;
        fieldData = res;
        printRecords();
      } else {
        modal("404", "Not Found");
      }
    },
    error: err => {
      modal(err.status, err.statusText);
    }
  });
}
exports.getRecords = getRecords;
