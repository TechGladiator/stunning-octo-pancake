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
    $('#modalBody').append(`<input class="form-control" type="text" placeholder="Import Name" value="${fileName || $('#jumboHeader').html()}">`);
    $(`#${code}Close2`).html(code);
    modalDispose(code, button);
    modalDispose(code, 'Close2', () => {
      $.ajax({
        url: '/import/',
        type: 'post',
        data: fieldData,
        dataType: 'json',
        contentType: 'application/json'
      }).done((res) => {
        modal('Success', 'Data has posted');
      }).fail((err) => {
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