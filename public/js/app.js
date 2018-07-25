function setPage(header, wrapper) {
  $('#jumboHeader').html(header);
  $('.wrapper').html(wrapper);
  $('.csv').html('');
}

function main() {
  setPage('Upload or View Data', wrapper1);
  $('#uploadCSV').click(parseFile);
  $('#retrieveData').click(() => {
    setPage('Look Up Data', wrapper3);
    $('#goBack').click(main);
    $('#lookUpImportName').click(() => {
      setPage('Enter Import Name', wrapper4);
      $('#goBack').click(main);
      $('#searchDB').click(() => {
        $.ajax({
          url: '/api/search/' + $('#searchImports').val(),
          type: 'get',
          success: (res) => {
            alert('Success!');
          },
          error: (err) => {
            alert('Something went wrong!');
          }
        });
      });
    });
  });
}

main();