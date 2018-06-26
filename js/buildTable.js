function buildTable(row) {
  let fn = '';
  let fd = '';
  let i = 0;
  let j = 0;
  let r = 0;
  
  if ($('#headerCheck').prop('checked')) {
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
    fd += `
            <th scope="row">${r + 1}</th>
          `;
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        const e = fieldData[row][k];
        console.log(e);
        validateState(e);
        validateZip(e);
        validateDate(e);
        fd += `<td id="field${j}">${e}</td>`;
        j++;
      }
    }
  } else {
    fieldData.forEach(e => {
      validateState(e);
      validateZip(e);
      validateDate(e);
      fd += `
            <tr>
              <th scope="row">${r + 1}</th>
            `;
      for (const k in e) {
        if (e.hasOwnProperty(k)) {
          const f = e[k];
          if (f == e.State && !fieldState || f == e.Zip && !fieldZip || f == e['Creation Date'] && !fieldDate) {
            fd += `<td class="table-danger" id="field${j}">${f}</td>`
          } else {
            fd += `<td id="field${j}">${f}</td>`
          }
          j++;
        }
      }
      fd += `</tr>`
      r++;
    });
  }

  $('.csv').html(`
                    ${buttonGroup}
                    <div class="card">
                      <div class="card-body">
                        <table class="table table-bordered">
                          <thead id="headings">
                            <tr>
                              ${fn}
                            </tr>
                          </thead>
                          <tbody id="dataEntered">
                            ${fd}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  `);
}