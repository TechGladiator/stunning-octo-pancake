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
                      <button type="button" class="btn btn-secondary" id="mapData">Map Imported Data</button>
                      <button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
                      <button type="button" class="btn btn-secondary" id="cancelCSV">Cancel CSV Processing</button>
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
  }

  if (firstError == undefined) {
    $('#repairNext').addClass('invisible');
  } else {
    $('#mapData').addClass('invisible');
  }

  $('#editData').click(() => {
    toggleEditable(row);
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
  $('#cancelCSV').click(() => {
    cancelCSV();
  });
}