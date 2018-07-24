function main() {
  $('#jumboHeader').html('Upload or View Data');
  $('.wrapper').html(`${wrapper1}`);
  $('.csv').html('');
  $('#uploadCSV').click(parseFile);
  $('#retrieveData').click(() => {
    $('#jumboHeader').html('Look Up Data');
    $('.wrapper').html(`${wrapper3}`);
    $('.csv').html('');
    $('#goBack').click(main);
    $('#lookUpImportName').click(() => {
      $('#jumboHeader').html('Enter Import Name');
      $('.wrapper').html(`${wrapper4}`);
      $('.csv').html('');
    });
  });
}

main();