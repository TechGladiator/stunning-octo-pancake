function globalLet() {
  let code;
  let editable;
  let errorCount = 0;
  let fieldData;
  let fieldDate = true;
  let fieldErrors;
  let fieldNames;
  let fieldState = true;
  let fieldZip = true;
  let fileName;
  let firstError;
  let firstRun = true;
  let fullResults;
  let geocoder;
  let headerCheck = true;
  let infowindow;
  let lat;
  let long;
  let map;
  let mapped = false;
  let markers = [];
  let message;
  let name = true;
  let pageSwitch = false;
  let row;
  let rowCount = 0;
  return {
    errorCount,
    editable,
    mapped,
    fieldData,
    fieldNames,
    fieldErrors,
    firstError,
    rowCount,
    code,
    message,
    fileName,
    headerCheck,
    name,
    row,
    fullResults,
    pageSwitch,
    firstRun,
    fieldState,
    fieldZip,
    fieldDate,
    markers,
    geocoder,
    infowindow,
    map,
    lat,
    long
  };
}
exports.globalLet = globalLet;
