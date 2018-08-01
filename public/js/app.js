function setHeader(header, wrapper) {
  $('#jumboHeader').html(header);
  $('.wrapper').html(wrapper);
  $('#map').html('');
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
  let id = $(searchId).val();
  $.ajax({
    url: '/api/imports/' + id,
    type: 'get',
    success: (res) => {
      console.log(res);
      if (res.length > 0) {
        setHeader(id);
        names.push('Lat', 'Long');
        fieldNames = names;
        fieldData = res;
        printStats();
      } else {
        modal('404', 'Not Found');
      }
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function postData(importName) {
  const importData = { importName, fieldData };
  $.ajax({
    url: '/api/imports/',
    type: 'post',
    data: JSON.stringify(importData),
    dataType: 'json',
    contentType: 'application/json',
    success: (res) => {
      modal(res.status, res.message || res.error);
    }
  }).fail((err) => {
    modal(err.status, err.responseText);
  });
}

function main() {
  if (!pageSwitch && !searchPage) {
    searchPage = true;
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
