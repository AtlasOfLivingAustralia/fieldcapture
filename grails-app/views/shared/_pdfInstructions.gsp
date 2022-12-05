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

                <h3>Chrome / Firefox / Edge</h3>
                <p>
                Press the "Open Print Dialog" button to display the browser print dialog.
                This can also be accessed by using your browsers control menu (3 vertical dots <i class="fa fa-ellipsis-v"></i> for Chrome and Edge, 3 horizontal bars for Firefox) and selecting the "Print..." menu item.
                </p>
                <p>
                    On the system print dialog that is displayed, select "Save as PDF" as the Print Destination.
                </p>
                <h3>Safari</h3>
                <p>Press "Close" to dismiss these instructions.</p>
                <p>Select "Export as PDF" from the "File" menu.</p>
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