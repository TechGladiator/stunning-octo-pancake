function buildTable(row) {
  let fn = '';
  let fd = '';
  let fullAddress = '';
  let addressList = [];

  $('.csv').addClass('p-5');
  
  fn = getFieldNames(fn);

  function addressFields(r, j, fieldType, f) {
    fd += `<td id="row${r}Field${j}${names[fieldType]}">${f}</td>`
    fullAddress += ` ${f}`;
  }

  if (errorCount) {
    let j = 0;
    fd += `
            <th scope="row">${row + 1}</th>
          `;
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        const e = fieldData[row][k];
        validateState(e);
        validateZip(e);
        validateDate(e);
        fd += `<td id="row${row}Field${j}">${e}</td>`;
        j++;
      }
    }
  } else {
    let r = 0;
    fieldData.forEach(e => {
      let j = 0;
      validateState(e);
      validateZip(e);
      validateDate(e);
      fd += `
            <tr>
              <th scope="row" id="row${r}">${r + 1}</th>
            `;
      for (const k in e) {
        if (e.hasOwnProperty(k)) {
          const f = e[k];
          if (f == e.State && !fieldState || f == e.Zip && !fieldZip || f == e['Creation Date'] && !fieldDate) {
            fd += `<td class="table-danger" id="row${r}Field${j}">${f}</td>`
          } else {
            switch (f) {
              case e.Address:
                if (f == '') {
                  fd += `<td id="row${r}Field${j}"></td>`
                  break;
                } else {
                  addressFields(r, j, 1, f);
                  break;
                }
              case e.City:
                addressFields(r, j, 3, f);
                break;
              case e.State:
                addressFields(r, j, 4, f);
                break;
              case e.Zip:
                addressFields(r, j, 5, f);
                break;
              case e.Lat:
                addressFields(r, j, 9, f);
                break;
              case e.Long:
                addressFields(r, j, 10, f);
                break;
              case e.Name:
                objEntry = Object.entries(e)[j][0];
                if (objEntry != 'Property Owner') {
                  addressFields(r, j, 0, f);
                  break;
                }
              default:
                fd += `<td id="row${r}Field${j}">${f}</td>`
            }
          }
          j++;
        }
      }
      addressList.push(fullAddress);
      fullAddress = '';
      fd += `</tr>`
      r++;
    });
  }

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

  $('#editData').click(() => {
    toggleEditable();
    updateFields(row);
  });
  $('#mapData').click(() => {
    initialize();
    geoIterate(addressList);
  });
  $('#repairNext').click(() => {
    updateFields(row);
    printStats();
    if (firstError == undefined) {
      modal('noErrors', 'All rows have the correct number of fields');
    }
  });
  $('#cancelCSV').click(() => {
    cancelCSV();
  });
}