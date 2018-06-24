function fixRow(code, close, row) {
  $(`#${code}${close}`).click(() => {
    console.log('Row: ', row);
    console.log(fieldData[row]);
    let fn = '';
    let fd = '';
    fieldNames.forEach(e => {
      console.log(e);
      fn += `<th>${e}</th>`;
    })
    $('.csv').html(`
                    <div class="card">
                      <div class="card-body">
                        <table class="table table-bordered">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              ${fn}
                            </tr>
                          </thead>
                          <tbody>

                          </tbody>
                        </table>
                      </div>
                    </div>
                  `);
  });
}