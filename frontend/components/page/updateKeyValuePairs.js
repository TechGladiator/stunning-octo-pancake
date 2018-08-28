let { fieldData, fieldNames } = require("./globalLet");
const { names } = require("./globalConst");
const { printRecords } = require("./printRecords");

function updateKeyValuePairs(i) {
  const oldKey = fieldNames[i];
  fieldNames[i] = names[i];
  const newKey = fieldNames[i];
  fieldData.forEach(e => {
    for (const k in e) {
      if (k === oldKey) {
        e[newKey] = e[oldKey];
        delete e[oldKey];
      } else if (k === "Address 2") {
        e.Address2 = e["Address 2"];
        delete e["Address 2"];
        e["Address 2"] = e.Address2;
        delete e.Address2;
      } else if (k === "__parsed_extra") {
        e.parsed_extra = e.__parsed_extra;
        delete e.__parsed_extra;
      }
    }
  });
  printRecords("Key updated");
}
exports.updateKeyValuePairs = updateKeyValuePairs;
