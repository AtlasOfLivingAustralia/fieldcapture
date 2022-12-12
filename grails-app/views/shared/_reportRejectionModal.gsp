<script type="text/html" id="reason-modal-template">

<div class="modal validationEngineContainer" id="reason-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"><span data-bind="text:title"></span></h3>
                <button type="button" class="close btn-sm" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
                <p data-bind="visible:explanationText, text:explanationText"></p>

                <div id="reasonCategoryOptions" data-bind="foreach: reasonCategoryOptions">
                    <input type="checkbox" name="reasonCategories" data-validation-engine="validate[minCheckbox[1]]" data-errormessage="Please select at least one reason" data-bind="checkedValue: $data, checked: $root.reasonCategories"> <span data-bind="text:$data"></span><br/>
                </div>
                <!-- This is used to enable/disable the conditional validation on the reason field -->
                <input type="hidden" name="reasonRequired" id="reasonRequired" data-bind="value:reasonRequired"/>

                <!-- The text box only needs a sub-title if the reason category list is displayed -->
                <!-- ko if:reasonTitle && reasonCategoryOptions() && reasonCategoryOptions().length > 0 -->
                <br/>
                <label for="reason" data-bind="text:reasonTitle"></label>
                <!-- /ko -->
                <textarea id="reason" rows="5" class="w-100 form-control form-control-sm" data-bind="value:reason" data-validation-engine="validate[condRequired[reasonRequired]]"></textarea>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-sm btn-primary" data-bind="click:submit, text:buttonText" aria-hidden="true"></button>
                <button data-bind="visible:buttonTextNo, text:buttonTextNo" class="btn btn-sm btn-danger" data-dismiss="modal" aria-hidden="true"></button>
            </div>
        </div>
    </div>
</div>

</script>
