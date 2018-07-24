function main() {
  $('#jumboHeader').addClass('mb-5');
  $('#jumboHeader').html('Upload or View Data');
  $('.wrapper').html(`${wrapper1}`);
  $('.csv').html('');
  $('#uploadCSV').click(parseFile);
}

main();