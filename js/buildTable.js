function buildTable(row, buttonGroup) {
  console.log('Row: ', row);
  console.log(fieldData[row]);
  let fn = '';
  let fd = '';
  let i = 0;
  let j = 0;
  fieldNames.forEach(e => {
    console.log(e);
    fn += `<th id="header${i}">${e}</th>`;
    i++;
  });
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      const e = fieldData[row][k];
      console.log(e);
      fd += `<td id="field${j}">${e}</td>`;
      j++;
    }
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