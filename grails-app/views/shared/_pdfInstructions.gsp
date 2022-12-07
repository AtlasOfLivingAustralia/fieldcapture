<!-- ko stopBinding:true -->
<div class="modal fade" id="print-instructions" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Saving a PDF file</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.PDF_INSTRUCTIONS}"/>
            </div>
            <div class="modal-footer">
                <input type="checkbox" name="instructionHide" data-bind="checked:dontShowAgain">Don't show these instructions again</input>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary print" data-bind="click:print">Open Print Dialog</button>
            </div>
        </div>
    </div>
</div>
<!-- /ko -->
<asset:script>
    $(function() {
        ko.applyBindings(new printInstructionsVM('#print-instructions'), document.getElementById('print-instructions'));
    });
</asset:script>