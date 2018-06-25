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
function validate(something) {
}