function removeEmptyField(row) {
  let i = 0;
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      if (k != names[i] && fieldData[row][k] == "") {
        console.log(`${k} != ${names[i]}`);
        console.log("deleted empty field: ", k);
        delete fieldData[row][k];
      }
      if (Object.values(fieldData[row]).length < fieldNames.length) {
        console.log("fieldData is less then fieldNames");
        if (fieldData[row][`${names[i + 1]}`] != undefined) {
          fieldData[row][`${names[i + 1]}`] = fieldData[row][`${names[i + 1]}`];
        } else {
          fieldData[row][`${names[i + 1]}`] = "";
        }
      }
      i++;
    }
  }
}
exports.removeEmptyField = removeEmptyField;
