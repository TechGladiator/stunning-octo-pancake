function setHeader(header, wrapper) {
  $('#jumboHeader').html(header);
  $('.wrapper').html(wrapper);
  $('#map').html('');
  $('.csv').html('');
}

function setPage(header, wrapper, elId0, func0, elId1, func1, elId2, func2) {
  setHeader(header, wrapper);
  $(elId0).click(func0);
  $(elId1).click(func1);
  $(elId2).click((params) => {
    func2(params);
  })
}

function searchRecords(searchId) {
  let id;
  if ($(searchId).val()) {
    id = $(searchId).val();
  } else {
    id = searchId;
  }
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
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function main() {
  if (!pageSwitch && !searchPage) {
    pageSwitch = true;
    setPage('Upload or Search', wrapper1, '#uploadCSV', parseFile, '#searchData', main);
  } else if (pageSwitch && !searchPage) {
    pageSwitch = false;
    setPage('Search Data', wrapper3, '#listImportName', () => {
      console.log('you clicked on #listImportName');
      $('#listImportName').addClass('invisible');
      setHeader('Import List');
      $.ajax({
        url: '/api/importlist/',
        type: 'get',
        success: (res) => {
          let resHTML = '<div class="d-flex justify-content-center mb-3" role="group" aria-label="button group">';
          res.forEach(e => {
            console.log(e.importname);
            resHTML += `<button type="button" class="btn btn-dark m-1" onclick="searchRecords('${e.importname}')">${e.importname}</button>`;
          });
          resHTML += '</div>';
          $('.csv').html(resHTML);
        },
        error: (err) => {
          modal(err.status, err.responseText);
        }
      });
    }, '#goBack', main, '#searchImportName', () => {
      searchPage = true;
      main();
    });
  } else {
    pageSwitch = true;
    searchPage = false;
    setPage('Search By Import Name', wrapper4, '#goBack', main, '#searchDB', () => {
      searchRecords('#searchImports');
    });
  }
}

main();
