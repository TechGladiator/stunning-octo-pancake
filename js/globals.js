// global variables
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
const wrapper = `
<div class="input-group mr-auto ml-auto mb-3">
	<div class="custom-file">
		<input type="file" class="custom-file-input" id="inputGroupFile02">
		<label class="custom-file-label" for="inputGroupFile02">Drag &amp; Drop or click here to browse for your file</label>
	</div>
	<div class="input-group-append" id="upload">
		<span class="input-group-text">Upload</span>
	</div>
</div>
<div class="text-center">
	<input type="checkbox" id="headerCheck" checked aria-label="Checkbox if header is included">
<label for="headerCheck">Check here if a header is included as the first line of the file</label>
</div>
`;
let code;
let editable;
let message;
let name = true;
let row;
let rowCount = 0;
let errorCount = 0;
let fieldData;
let fieldDate = true;
let fieldErrors;
let fieldNames;
let fieldState = true;
let fieldZip = true;
let firstError;
let fullResults;
let start;
let end;
let firstRun = true;