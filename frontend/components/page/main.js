let { pageSwitch } = require("./globalLets");
const { wrapper1, mainTitle, wrapper3 } = require("./globalConsts");
const $ = require("jquery");
const { setPage, parseFile, searchImports } = require("./modal");

function main() {
  if (!pageSwitch) {
    pageSwitch = true;
    setPage(
      "Upload or Search",
      wrapper1,
      "#uploadCSV",
      parseFile,
      "#searchData",
      main
    );
    $("title").html(mainTitle);
  } else {
    pageSwitch = false;
    setPage(
      "Search By Import Name",
      wrapper3,
      "#goBack",
      main,
      "#searchDB",
      () => {
        searchImports("#searchImports");
      }
    );
  }
}
exports.main = main;