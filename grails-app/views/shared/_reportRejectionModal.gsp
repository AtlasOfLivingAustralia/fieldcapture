
<!-- ko stopBinding: true -->
<div id="reason-modal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3><span data-bind="text:title"></span> reason</h3>
    </div>
    <div class="modal-body">
        %{--<p data-bind="visible:rejectionCategories">--}%
        %{--Rejection Category:<br/>--}%
        %{--<select data-bind="options:rejectionCategories, value:rejectionCategory"></select>--}%
        %{--</p>--}%
        <p data-bind="visible:!explanationText">Please enter a reason.  This reason will be included in the email sent to the project administrator(s).</p>
        <p data-bind="visible:explanationText, text:explanationText"></p>
        <textarea rows="5" style="width:97%" data-bind="textInput:reason"></textarea>
    </div>
    <div class="modal-footer">
        <button class="btn btn-success" data-bind="click:submit, text:buttonText, enable:reason" data-dismiss="modal" aria-hidden="true"></button>
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
    </div>
</div>
<!-- /ko -->
