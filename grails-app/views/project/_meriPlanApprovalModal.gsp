<!-- ko stopBinding: true -->
<div id="meri-plan-approval-modal" class="modal fade" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" data-bind="text:title"></h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <form class="validationEngineContainer">
                    <div class="form-group row">
                        <label for="dateApproved" class="col-form-label col-sm-5">Date / time approved</label>
                        <div class="col-sm-7">
                            <input type="text" id="dateApproved" readonly="readonly" class="form-control form-control-sm" data-bind="value:dateApproved.formattedDate">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="required col-form-label col-sm-5" for="meri-plan-approval-document-reference">Change order numbers </label>
                        <div class="col-sm-7">
                            <input id="meri-plan-approval-document-reference" type="text" class="required form-control form-control-sm" data-bind="value:referenceDocument">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="required" for="meri-plan-approval-reason">Comments </label>
                        <textarea id="meri-plan-approval-reason" rows="5" maxlength="500" class="required form-control form-control-sm" placeholder="Approval reason" data-bind="textInput:reason"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-success" type="button" data-bind="click:submit, text:buttonText, enable:reason() && referenceDocument()" data-dismiss="modal" aria-hidden="true"></button>
                <button class="btn btn-sm btn-danger" type="button" data-dismiss="modal" aria-hidden="true">Cancel</button>
            </div>
        </div>
    </div>
</div>
<!-- /ko -->
