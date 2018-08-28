let {
  errorCount,
  fieldData,
  fieldNames,
  fieldErrors,
  firstError
} = require("./globalLet");
const $ = require("jquery");

function removeFirstErrorMessage(row) {
  $(`.modal`).on("hidden.bs.modal", () => {
    if (Object.values(fieldData[row]).length === fieldNames.length) {
      fieldErrors.shift(0);
      errorCount -= 1;
      firstError = fieldErrors[0];
    }
  });
}
exports.removeFirstErrorMessage = removeFirstErrorMessage;
