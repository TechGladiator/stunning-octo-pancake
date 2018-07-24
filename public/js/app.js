function main() {
  $('#jumboHeader').html('Upload or View Data');
  $('.wrapper').html(`${wrapper1}`);
  $('.csv').html('');
  $('#uploadCSV').click(parseFile);
}

main();