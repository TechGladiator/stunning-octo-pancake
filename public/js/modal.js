function modal(moId, moBody, moFooter) {
	$('body').append(`
  <div class="modal fade" id="${moId}" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="${moId}Label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${moId}Label">${moId}</h5>
          <button type="button" class="close" id="${moId}Close1" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer" id="modalFooter"></div>
      </div>
    </div>
	</div>
	`);
	$(`#${moId}`).modal('show');
	$('#modalBody').html(`<h5 class="text-center">${moBody}</h5>`);
	let okButton = `<button type="button" class="btn btn-primary" id="${moId}Close2">Ok</button>`;
	if (moFooter) {
		$('#modalFooter').html(`${moFooter}${okButton}`);
	} else {
		$('#modalFooter').html(okButton);
	}
	modalDispose(moId, 'Close1');
	modalDispose(moId, 'Close2');
}

function modalDispose(moId, close, func) {
	$(`#${moId}${close}`).click(() => {
		$(`#${moId}`).modal('hide');
		$(`#${moId}`).on('hidden.bs.modal', () => {
			$('.modal').remove();
			$('.modal-backdrop').remove();
			if (func) func();
		});
	});
}