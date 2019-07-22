<!-- ko stopBinding: true -->

<div id="meri-plan-approval-modal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3><span data-bind="text:title"></span></h3>
    </div>
    <div class="modal-body">
        <form class="validationEngineContainer">
            <div class="row-fluid">
                <div class="span4">Date / time approved</div>
                <div class="span8"><input type="text" readonly="readonly" data-bind="value:dateApproved.formattedDate"></div>
            </div>
            <div class="row-fluid">
                <div class="span4"><label class="required" for="meri-plan-approval-document-reference">Change order numbers </label></div>
                <div class="span8"><input id="meri-plan-approval-document-reference" type="text" class="required" data-bind="value:referenceDocument"></div>
            </div>
            <div class="row-fluid">
                <div class="span4"><label class="required" for="meri-plan-approval-reason">Comments field</label></div>
            </div>
            <div class="row-fluid">
                <div class="span12">
                    <textarea id="meri-plan-approval-reason" rows="5" maxlength="500" class="required" placeholder="Approval reason" data-bind="textInput:reason"></textarea>
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