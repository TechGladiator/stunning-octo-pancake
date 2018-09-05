const { showFilename } = require("./showFilename");

const { setPage } = require("./setPage");
const { main } = require("./main");
let {
  errorCount,
  firstError,
  rowCount,
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
  showFilename();
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
