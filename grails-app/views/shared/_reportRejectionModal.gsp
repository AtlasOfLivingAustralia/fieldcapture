<!-- ko stopBinding: true -->
<div class="modal" id="reason-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"><span data-bind="text:title"></span> reason </h3>
                <button type="button" class="close btn-sm" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <p data-bind="visible:!explanationText">Please enter a reason.  This reason will be included in the email sent to the project administrator(s).</p>
                <p data-bind="visible:explanationText, text:explanationText"></p>
                <textarea rows="5" class="w-100 form-control form-control-sm" data-bind="textInput:reason"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-primary" data-bind="click:submit, text:buttonTextYes, enable:reason" data-dismiss="modal" aria-hidden="true"></button>
                <button class="btn btn-sm btn-danger" data-bind="visible:!buttonTextNo" data-dismiss="modal" aria-hidden="true">Cancel</button>
                <button class="btn btn-sm btn-danger" data-bind="visible:buttonTextNo, text:buttonTextNo" data-dismiss="modal" aria-hidden="true"></button>
            </div>
        </div>
    </div>
</div>
<!-- /ko -->
