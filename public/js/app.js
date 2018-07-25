function setHeader(header, wrapper) {
  $('#jumboHeader').html(header);
  $('.wrapper').html(wrapper);
  $('.csv').html('');
}

function setPage(header, wrapper, elId1, func1, elId2, func2) {
  setHeader(header, wrapper);
  $(elId1).click(func1);
  $(elId2).click((params) => {
    func2(params);
  })
}

function searchRecords(searchId) {
  $.ajax({
    url: '/api/search/' + $(searchId).val(),
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
      modal(err.status, err.responseText);
    }
  });
}

function main() {
  if (!pageSwitch && !searchPage) {
    pageSwitch = true;
    setPage('Upload or View Data', wrapper1, '#uploadCSV', parseFile, '#retrieveData', main);
  } else if (pageSwitch && !searchPage) {
    pageSwitch = false;
    setPage('Look Up Data', wrapper3, '#goBack', main, '#lookUpImportName', () => {
      searchPage = true;
      main();
    })
  } else {
    searchPage = false;
    setPage('Enter Import Name', wrapper4, '#goBack', main, '#searchDB', () => {
      searchRecords('#searchImports');
    });
  }
}

main();
