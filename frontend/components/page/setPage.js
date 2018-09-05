const $ = require("jquery");
const { setHeader } = require("./setHeader");

function setPage(header, wrapper, elId0, func0, elId1, func1, elId2, func2) {
  setHeader(header, wrapper);
  $(elId0).click(func0);
  $(elId1).click(func1);
  $(elId2).click(params => {
    func2(params);
  });
}
exports.setPage = setPage;
