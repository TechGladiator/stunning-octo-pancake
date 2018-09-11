const $ = require("jquery");

function setHeader(header, wrapper) {
  $("title").html(header);
  $("#jumboHeader").html(header);
  $(".wrapper").html(wrapper);
  $("#map").html("");
  $(".csv").html("");
}
exports.setHeader = setHeader;
