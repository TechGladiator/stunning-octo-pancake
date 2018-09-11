const { fieldData, fieldNames } = require("./globalLets");
const { names } = require("./globalConsts");
const { printRecords } = require("./printRecords");

function updateKeyValues(i) {
  const oldKey = fieldNames[i];
  fieldNames[i] = names[i];
  const newKey = fieldNames[i];
  fieldData.forEach(e => {
    Object.keys(e).forEach(key => {
      if (key === oldKey) {
        e[newKey] = e[oldKey];
        delete e[oldKey];
      } else if (key === "Address 2") {
        e.Address2 = e["Address 2"];
        delete e["Address 2"];
        e["Address 2"] = e.Address2;
        delete e.Address2;
      } else if (key === "__parsed_extra") {
        e.parsed_extra = e.__parsed_extra;
        delete e.__parsed_extra;
      }
    });
  });
  printRecords("Key updated");
}
exports.updateKeyValues = updateKeyValues;
