const $ = require("jquery");

function modalDispose(moId, close, func) {
  $(`#${moId}${close}`).click(() => {
    $(`#${moId}`).modal("hide");
    $(`#${moId}`).on("hidden.bs.modal", () => {
      $(".modal").remove();
      $(".modal-backdrop").remove();
      if (func) func();
    });
  });
}
exports.modalDispose = modalDispose;
