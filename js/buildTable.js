function buildTable(row) {
  let fn = '';
  let fd = '';
  
  if (headerCheck) {
    let i = 0;
    fn += `<th scope="col">#</th>`;
    fieldNames.forEach(e => {
      validateFieldNames(e);
      if (name) {
        fn += `<th id="header${i}">${e}</th>`;
      } else {
        fn += `<th class="table-danger" id="header${i}">${e}</th>`;
      }
      i++;
    });
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
            fd += `<td id="row${r}Field${j}">${f}</td>`
          }
          j++;
        }
      }
      fd += `</tr>`
      r++;
    });
  }

  $('#jumboHeader').removeClass('mb-5');
  $('#jumboHeader').html('Edit CSV Data');
  $('.wrapper').html('');

  $('.csv').html(`
                    <div class="btn-group d-flex justify-content-center mb-3" role="group" aria-label="button group">
                      <button type="button" class="btn btn-secondary" id="editData">Edit Data</button>
                      <button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
                      <button type="button" class="btn btn-secondary" id="cancelCSV">Cancel CSV Processing</button>
                    </div>
                    <div class="card">
                      <div class="card-body">
                        <table id="csvTable" class="table table-bordered">
                          <thead>
                            <tr>
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