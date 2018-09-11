const { modal } = require("./modal");

function errorFn(err, file) {
  modal("ERROR", `${err}, ${file}`);
}
exports.errorFn = errorFn;
