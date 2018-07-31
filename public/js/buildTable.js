function buildTable(row) {
  let fn = '';
  let fd = '';
  let fullAddress = '';
  let addressList = [];

  $('.csv').addClass('p-5');
  
  fn = getFieldNames(fn);

  ({ fd, fullAddress } = getFieldData(fd, row, fullAddress, addressList));

  if (row == 'header') {
    fd = '';
  }

  $('#jumboHeader').removeClass('mb-5');
  $('#jumboHeader').html(fileName);
  $('.wrapper').html('');

  $('.csv').html(`
                    <div class="btn-group d-flex justify-content-center mb-3" role="group" aria-label="button group">
                      <button type="button" class="btn btn-secondary" id="editData">Edit Data</button>
                      <button type="button" class="btn btn-secondary invisible" id="saveRecords">Save Records</button>
                      <button type="button" class="btn btn-secondary" id="mapData">Map Imported Data</button>
                      <button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
                      <button type="button" class="btn btn-secondary" id="lookup">Lookup Record</button>
                      <button type="button" class="btn btn-secondary" id="newCSV">Import New CSV File</button>
                    </div>
                    <div class="card">
                      <div class="card-body">
                        <table id="csvTable" class="table table-bordered">
                          <thead>
                            <tr class="headerRow">
                              ${fn}
                            </tr>
                          </thead>
                          <tbody>
                            ${fd}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  `);

  if (mapped) {
    $('tbody').addClass('latlong');
    $('#saveRecords').removeClass('invisible');
  }

  if (firstError == undefined) {
    $('#repairNext').addClass('invisible');
  } else {
    $('#mapData').addClass('invisible');
  }

  $('#editData').click(() => {
    toggleEditable(row);
  });
  $('#saveRecords').click(() => {
    let code = 'Save';
    let button = 'Cancel';
    let cancel = `<button type="button" class="btn btn-danger" id="${code}${button}">${button}</button>`;
    modal(code, 'Name this imported data', cancel);
    $('#modalBody').append(`<input class="form-control" id="saveImportName" type="text" placeholder="Import Name" value="${fileName || $('#jumboHeader').html()}">`);
    let saveName = document.getElementById('saveImportName');
    let importName = saveName.value;
    function getSaveName() {
      importName = saveName.value;
      console.log(importName);
    }
    saveName.onchange = getSaveName;
    $(`#${code}Close2`).html(code);
    modalDispose(code, button);
    modalDispose(code, 'Close2', () => {
      let dataFields = [];
      function getDataFields() {
        let i = 0;
        fieldData.forEach(e => {
          dataFields.push(['(SELECT importid FROM get_importid)']);
          for (const k in e) {
            if (e.hasOwnProperty(k)) {
              const f = e[k];
              dataFields[i].push(f);
            }
          }
          i++;
        });
        console.log(dataFields);
      }
      getDataFields();
      const importData = {importName, dataFields};
      console.log(importData);
      $.ajax({
        url: '/api/import/',
        type: 'post',
        data: importData,
        dataType: 'json',
        contentType: 'application/json'
      }).done((res) => {
        console.log('you are getting a success response');
        modal('Success', 'Data has posted');
      }).fail((err) => {
        console.log('you are getting a fail response');
        modal(err.status, err.responseText);
      });
    });
  });
  $('#mapData').click(() => {
    if (!mapped) {
      initialize();
    }
    geoIterate(addressList);
  });
  $('#repairNext').click(() => {
    updateFields(row);
    printStats();
  });
  $('#lookup').click(() => {
    newCSV();
    searchPage = true;
    main();
  });
  $('#newCSV').click(newCSV);
}