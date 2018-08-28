const $ = require("jquery");

function globalConst() {
  const mainTitle = $("title").html();
  const names = [
    "Name",
    "Address",
    "Address 2",
    "City",
    "State",
    "Zip",
    "Purpose",
    "Property Owner",
    "Creation Date"
  ];
  const wrapper1 = `
<div class="text-center">
	<button type="button" class="btn btn-dark" id="uploadCSV">Upload CSV File</button>
	<button type="button" class="btn btn-dark" id="searchData">Search</button>
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
  const wrapper3 = `
<div class="input-group mb-3">
	<input type="text" class="form-control" id="searchImports">
	<div class="input-group-append">
		<span class="input-group-text" id="searchDB">Search</span>
		<span class="input-group-text" id="goBack">Go Back</span>
	</div>
</div>
`;
  return { names, wrapper2, wrapper1, mainTitle, wrapper3 };
}
exports.globalConst = globalConst;
