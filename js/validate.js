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
	if (!name) {
		console.log(`Header "${fieldName}" is invalid`);
	}
}

// Validate data type formats in each record
function validateState(row) {
	const states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
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
	if (!fieldState) {
		console.log(`${row.State} is invalid`);
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
	if (!fieldZip) {
		console.log(`${row.Zip} is invalid`);
	}
}