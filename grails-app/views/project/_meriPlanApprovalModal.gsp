<!-- ko stopBinding: true -->
<div id="meri-plan-approval-modal" class="modal hide fade" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"><span data-bind="text:title"></span></h3>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <form class="validationEngineContainer">
                    <div class="row">
                        <div class="col-sm-4">Date / time approved</div>
                        <div class="col-sm-8"><input type="text" readonly="readonly" data-bind="value:dateApproved.formattedDate"></div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4"><label class="required" for="meri-plan-approval-document-reference">Change order numbers </label></div>
                        <div class="col-sm-8"><input id="meri-plan-approval-document-reference" type="text" class="required" data-bind="value:referenceDocument"></div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4"><label class="required" for="meri-plan-approval-reason">Comments </label></div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
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
    </div>
</div>
<!-- /ko -->
