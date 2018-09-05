const { setPage } = require("./setPage");
const { main } = require("./main");
let {
  errorCount,
  firstError,
  rowCount,
  fileName,
  headerCheck,
  pageSwitch
} = require("./globalLets");
const { wrapper2 } = require("./globalConsts");
const $ = require("jquery");
const { modal, completeFn, errorFn } = require("./temp");
const papa = require("papaparse");

function parseFile() {
  pageSwitch = false;
  setPage("Upload CSV File", wrapper2, "#goBack", main);
  $("#headerCheck").click(() => {
    if ($("#headerCheck").prop("checked")) {
      headerCheck = true;
    } else {
      headerCheck = false;
    }
  });
  // replace input placeholder with file name
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
  $("#upload").click(() => {
    rowCount = 0;
    errorCount = 0;
    firstError = undefined;
    if (!$("#inputGroupFile02")[0].files.length) {
      modal("noFileChosen", "Please choose at least one file to parse.");
      return;
    }
    const file = document.getElementById("inputGroupFile02").files[0];
    papa.parse(file, {
      // base config to use for each file
      delimiter: "",
      header: headerCheck,
      dynamicTyping: false,
      skipEmptyLines: true,
      preview: 0,
      step: undefined,
      encoding: "",
      worker: false,
      comments: false,
      complete: completeFn,
      error: errorFn
    });
  });
}
exports.parseFile = parseFile;
