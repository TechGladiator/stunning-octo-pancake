function setHeader(header, wrapper) {
  $('title').html(header);
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

function searchImports(searchString) {
  let searchTerm;
  if ($(searchString).val()) {
    searchTerm = $(searchString).val();
  } else {
    searchTerm = searchString;
  }
  $.ajax({
    url: '/api/search/' + searchTerm,
    type: 'get',
    success: (res) => {
      if (res.status) {
        modal(res.status, res.message);
      } else {
        let resHTML = '<div class="d-flex justify-content-center mb-3" role="group" aria-label="button group">';
        res.forEach(e => {
          console.log(e.importname);
          resHTML += `<button type="button" class="btn btn-dark m-1" onclick="searchRecords('${e.importname}')">${e.importname}</button>`;
        });
        resHTML += '</div>';
        $('.csv').html(resHTML);
      }
    },
    error: (err) => {
      modal(err.status, err.responseText);
    }
  });
}

function main() {
  if (!pageSwitch) {
    pageSwitch = true;
    setPage('Upload or Search', wrapper1, '#uploadCSV', parseFile, '#searchData', main);
    $('title').html(mainTitle);
  } else {
    pageSwitch = false;
    setPage('Search By Import Name', wrapper3, '#goBack', main, '#searchDB', () => {
      searchImports('#searchImports');
    });
  }
}

function saveRecords() {
  let code = 'Save';
  let button = 'Cancel';
  let cancel = `<button type="button" class="btn btn-danger" id="${code}${button}">${button}</button>`;
  modal(code, 'Name this imported data', cancel);
  $('#modalBody').append(`<input class="form-control" id="saveImportName" type="text" placeholder="Import Name" value="${fileName || $('#jumboHeader').html()}">`);
  let saveName = document.getElementById('saveImportName');
  let importName = saveName.value;
  function getSaveName() {
    importName = saveName.value;
  }
  saveName.onchange = getSaveName;
  $(`#${code}Close2`).html(code);
  modalDispose(code, button);
  modalDispose(code, 'Close2', () => {
    postData(importName);
  });
}

main();
