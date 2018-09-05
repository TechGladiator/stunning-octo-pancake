function fixButton(code, buttonName) {
  return `<button type="button" class="btn btn-danger" id="${code}${buttonName}">${buttonName}</button>`;
}
exports.fixButton = fixButton;
