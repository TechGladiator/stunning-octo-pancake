const $ = require("jquery");
const { getRecords } = require("./getRecords");
const { modal } = require("./modal");

function searchImports(searchString) {
  $.ajax({
    url: `/imports/search?term=${$(searchString).val()}`,
    type: "get",
    success: res => {
      $(".csv").html(
        '<div id="import-list" class="d-flex justify-content-center mb-3" role="group" aria-label="button group"></div>'
      );
      res.forEach(e => {
        $("#import-list").append(
          `<button type="button" class="btn btn-dark m-1" id="get-records-${
            e.id
          }">${e.import_name}</button>`
        );
        $(`#get-records-${e.id}`).click(() => {
          getRecords(e.id, e.import_name);
        });
      });
    },
    error: err => {
      modal(err.status, err.statusText);
    }
  });
}
exports.searchImports = searchImports;
