function buildTable(row) {
  console.log('Row: ', row);
  console.log(fieldData[row]);
  let fn = '';
  let fd = '';
  fieldNames.forEach(e => {
    console.log(e);
    fn += `<th>${e}</th>`;
  });
  for (const k in fieldData[row]) {
    if (fieldData[row].hasOwnProperty(k)) {
      const e = fieldData[row][k];
      console.log(e);
      fd += `<td>${e}</td>`;
    }
  }
  $('.csv').html(`
                    <div class="card">
                      <div class="card-body">
                        <table class="table table-bordered">
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
}