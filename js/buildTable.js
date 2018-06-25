function buildTable(row) {
  console.log('Row: ', row);
  console.log(fieldData[row]);
  let fn = '';
  let fd = '';
  let i = 0;
  let j = 0;
  
  if ($('#headerCheck').prop('checked')) {
    fieldNames.forEach(e => {
      console.log(e);
      fn += `<th id="header${i}">${e}</th>`;
      i++;
    });
  }

  if (errorCount) {
    for (const k in fieldData[row]) {
      if (fieldData[row].hasOwnProperty(k)) {
        const e = fieldData[row][k];
        console.log(e);
        fd += `<td id="field${j}">${e}</td>`;
        j++;
      }
    }
  } else {
    fieldData.forEach(e => {
      fd += `<tr>`;
      for (const k in e) {
        if (e.hasOwnProperty(k)) {
          const f = e[k];
          console.log('f = ', f);
          fd += `<td id="field${j}">${f}</td>`
          j++;
        }
      }
      fd += `</tr>`
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