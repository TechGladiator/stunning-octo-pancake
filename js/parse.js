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
 let firstRun = true;

 // Users navigate to web site and upload a CSV file
 // replace input placeholder with file name
 $('#inputGroupFile02').on('change', function () {
   fileName = $(this).val();
   fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
   if (fileName != '') {
     $(this).next('.custom-file-label').addClass('selected').html(fileName);
     $('.csv').html('');
   } else {
     $(this).next('.custom-file-label').addClass('selected').html('Drag & Drop or click here to browse for your file');
     $('.csv').html('');
   }
 });

 function printStats(msg) {
   if (msg)
     console.log(msg);
   console.log('       Time:', end - start || '(Unknown; your browser does not support the Performance API)', 'ms');
   console.log('  Row count:', rowCount);
   console.log('     Errors:', errorCount);
   if (errorCount) {
     console.log('First error:', firstError);
     code = firstError.code;
     message = firstError.message;
     row = firstError.row;
     const fix = `<button type="button" class="btn btn-danger" id="${code}Fix">Fix</button>`;
     modal(code, `${message} in "${fileName}", Row: ${row + 2}`, fix);
     modalDispose(code, 'Fix', fixRow(code, 'Fix', row));
   }
 }

 // track parsing time
 function now() {
   return typeof window.performance !== 'undefined' ? window.performance.now() : 0;
 }

 function errorFn(err, file) {
   end = now();
   console.log('ERROR:', err, file);
 }

 function completeFn(results) {
   end = now();
   fullResults = results;
   fieldNames = fullResults.meta.fields;
   fieldData = fullResults.data;
   fieldErrors = fullResults.errors;
   if (fullResults && fieldErrors) {
     if (fieldErrors) {
       errorCount = fieldErrors.length;
       firstError = fieldErrors[0];
     }
     if (fieldData && fieldData.length > 0) {
       rowCount = fieldData.length;
     }
   }
   printStats('Parse complete');
   console.log('    Results:', fullResults);
 }

 // Enable application to parse file
 function parseFile() {
   $('#upload').click(() => {
     rowCount = 0;
     errorCount = 0;
     firstError = undefined;
     if (!firstRun) {
       console.log('--------------------------------------------------');
     }
     else {
       firstRun = false;
     }
     if (!$('#inputGroupFile02')[0].files.length) {
       modal("noFileChosen", "Please choose at least one file to parse.");
     }
     // use jquery to select files
     $('#inputGroupFile02').parse({
       config: {
         // base config to use for each file
         delimiter: "",
         header: $('#headerCheck').prop('checked'),
         dynamicTyping: false,
         skipEmptyLines: true,
         preview: 0,
         step: undefined,
         encoding: "",
         worker: false,
         comments: false,
         complete: completeFn,
         error: errorFn,
       },
       before(file) {
         // executed before parsing each file begins;
         // what you return here controls the flow
         start = now();
         console.log('Parsing file...', file);
       },
       error(err, file) {
         // executed if an error occurs while loading the file,
         // or if before callback aborted for some reason
         console.log('ERROR:', err, file);
         firstError = firstError || err;
         errorCount++;
       },
       complete() {
         // executed after all files are complete
         end = now();
         printStats('Done with all files');
       }
     });
   });
 }
