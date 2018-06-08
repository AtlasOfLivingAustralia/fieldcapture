<!-- ko stopBinding: true -->
<div id="reason-modal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog  modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3><span data-bind="text:title"></span> reason</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <p>Please enter a reason.  This reason will be included in the email sent to the project administrator(s).</p>
                <textarea rows="5" style="width:97%" data-bind="textInput:reason"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success" data-bind="click:submit, text:buttonText, enable:reason" data-dismiss="modal"
                        aria-hidden="true"></button>
                <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
            </div>

        </div>
    </div>
</div>
<!-- /ko -->
