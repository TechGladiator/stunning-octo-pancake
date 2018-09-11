let { fileName } = require("./globalLets");
const $ = require("jquery");

function showFilename() {
  $("#inputGroupFile02").on("change", () => {
    fileName = $(this).val();
    fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
    if (fileName !== "") {
      $(this)
        .next(".custom-file-label")
        .addClass("selected")
        .html(fileName);
      $(".csv").html("");
    } else {
      $(this)
        .next(".custom-file-label")
        .addClass("selected")
        .html("Drag & Drop or click here to browse for your file");
      $(".csv").html("");
    }
  });
}
exports.showFilename = showFilename;
