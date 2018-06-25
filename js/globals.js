// global variables
const buttonGroup = `
	<div class="btn-group d-flex justify-content-center mb-3" role="group" aria-label="button group">
		<button type="button" class="btn btn-secondary" id="editData">Edit Data</button>
		<button type="button" class="btn btn-secondary" id="repairNext">Repair Next Error</button>
		<button type="button" class="btn btn-secondary" id="cancelCSV">Cancel CSV Processing</button>
	</div>
`;
const names = ['Name', 'Address', 'Address 2', 'City', 'State', 'Zip', 'Purpose', 'Property Owner', 'Creation Date'];
let code;
let message;
let name = true;
let row;
let rowCount = 0;
let errorCount = 0;
let fieldData;
let fieldErrors;
let fieldNames;
let firstError;
let fullResults;
let start;
let end;
let fileBrowser = true;
let firstRun = true;