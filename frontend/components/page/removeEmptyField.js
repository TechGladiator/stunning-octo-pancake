let { fieldData, fieldNames } = require("./globalLets");
const { names } = require("./globalConsts");

function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      if (k !== names[i] && fieldData[row][k] === "") {
        delete fieldData[row][k];
      }
      if (Object.values(fieldData[row]).length < fieldNames.length) {
        if (fieldData[row][`${names[i + 1]}`] !== undefined) {
          fieldData[row][`${names[i + 1]}`] = fieldData[row][`${names[i + 1]}`];
        } else {
          fieldData[row][`${names[i + 1]}`] = "";
        }
      }
      i += 1;
    }
  }
}
exports.removeEmptyField = removeEmptyField;
