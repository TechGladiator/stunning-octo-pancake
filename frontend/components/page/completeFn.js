let {
  errorCount,
  fieldData,
  fieldNames,
  fieldErrors,
  firstError,
  rowCount,
  fullResults
} = require("./globalLets");
const { printRecords } = require("./printRecords");

function completeFn(results) {
  fullResults = results;
  fieldNames = fullResults.meta.fields;
  fieldData = fullResults.data;
  fieldErrors = fullResults.errors;
  if (fullResults && fieldErrors) {
    if (fieldErrors) {
      errorCount = fieldErrors.length;
      [firstError] = fieldErrors;
    }
    if (fieldData && fieldData.length > 0) {
      rowCount = fieldData.length;
    }
  }
  printRecords("Parse complete");
}
exports.completeFn = completeFn;
