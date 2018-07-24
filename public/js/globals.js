// global variables
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
const wrapper1 = `
<div class="text-center">
	<button type="button" class="btn btn-dark" id="uploadCSV">Upload CSV File</button>
	<button type="button" class="btn btn-dark" id="retrieveData">Retrieve Existing Data</button>
</div>
`;
const wrapper2 = `
<div class="input-group mr-auto ml-auto mb-3">
	<div class="custom-file">
		<input type="file" class="custom-file-input" id="inputGroupFile02">
		<label class="custom-file-label" for="inputGroupFile02">Drag &amp; Drop or click here to browse for your file</label>
	</div>
	<div class="input-group-append" id="upload">
		<span class="input-group-text">Upload</span>
	</div>
	<div class="input-group-append" id="goBack">
    <span class="input-group-text">Go Back</span>
	</div>
</div>
<div class="text-center">
	<input type="checkbox" id="headerCheck" checked aria-label="Checkbox if header is included">
<label for="headerCheck">Check here if a header is included as the first line of the file</label>
</div>
`;
let code;
let editable;
let end;
let errorCount = 0;
let fieldData;
let fieldDate = true;
let fieldErrors;
let fieldNames;
let fieldState = true;
let fieldZip = true;
let fileName;
let firstError;
let firstRun = true;
let fullResults;
let headerCheck = true;
let lat;
let long;
let message;
let name = true;
let row;
let rowCount = 0;
let start;