<!-- ko stopBinding: true -->

<div id="meri-plan-approval-modal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3><span data-bind="text:title"></span></h3>
    </div>
    <div class="modal-body">
        <form>
            <div class="row-fluid">
                <div class="span4">Date / time approved</div>
                <div class="span8"><input type="text" readonly="readonly" data-bind="value:dateApproved.formattedDate"></div>
            </div>
            <div class="row-fluid">
                <div class="span4">Reference document</div>
                <div class="span8"><input type="text" data-bind="value:referenceDocument"></div>
            </div>
            <div class="row-fluid">
                <div class="span12">
                    <textarea style="width:100%" rows="5" maxlength="500" placeholder="Please add the reason for this approval" data-bind="textInput:reason"></textarea>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-success" data-bind="click:submit, text:buttonText, enable:reason() && referenceDocument()" data-dismiss="modal" aria-hidden="true"></button>
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
    </div>
</div>

<!-- /ko -->