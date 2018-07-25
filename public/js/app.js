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
            console.log(res);
            if (res.length > 0) {
              modal('success', 'Success!');
            } else {
              modal('404', 'Not Found');
            }
          },
          error: (err) => {
            modal('404', 'Something went wrong!');
          }
        });
      });
    });
  });
}

main();