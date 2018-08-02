// Validate field names
function validateFieldNames(fieldName) {
	for (let i = 0; i < names.length; i++) {
		if (fieldName == names[i]) {
			name = true;
			return;
		} else {
			name = false;
		}
	}
}

// Validate data type formats in each record
function validateState(row) {
	const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MP', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
	if (row.State) {
		for (let i = 0; i < states.length; i++) {
			if (row.State == states[i]) {
        fieldState = true;
        return;
			} else {
        fieldState = false;
      }
		}
	}
}

function validateZip(row) {
  fieldZip = true;
	const digits = '0123456789';
	if (row.Zip) {
		if (row.Zip.length != 5) {
			fieldZip = false;
		}
		for (let i = 0; i < row.Zip.length; i++) {
			temp = `${row.Zip.substring(i, i+1)}`;
			if (digits.indexOf(temp) == '-1') {
				fieldZip = false;
			}
		}
	}
}

function validateDate(row) {
	fieldDate = true;
	const regEx = /^\d{4}-\d{2}-\d{2}$/;

	if (row['Creation Date']) {
		if (!row['Creation Date'].match(regEx)) { // Invalid format
			fieldDate = false;
		}

		const d = new Date(row['Creation Date']);

		if (!d.getTime() && d.getTime() !== 0 && fieldDate) { // Invalid date
			fieldDate = false;
			console.log(`${row['Creation Date']} is an invalid date`);
		}
	}
}

function validateField(e, k, i, j) {
  validateState(e);
  validateZip(e);
  validateDate(e);
  if (e[k] == e.State && !fieldState || e[k] == e.Zip && !fieldZip || e[k] == e['Creation Date'] && !fieldDate) {
    $(`#row${i}Field${j}`).addClass('table-danger');
  } else {
    $(`#row${i}Field${j}`).removeClass('table-danger');
  }
}