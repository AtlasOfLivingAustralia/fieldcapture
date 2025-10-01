<div id="${divId ?: 'declaration'}" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog  modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Declaration</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    
                </button>
            </div>
            <div class="modal-body declaration-text">
                <fc:getSettingContent settingType="${declarationType ?: au.org.ala.merit.SettingPageType.DECLARATION}"/>
            </div>
            <div class="modal-footer">
                <label class="me-auto">
                    <input type="checkbox" name="acceptTerms" data-bind="checked:termsAccepted" style="margin:0;"/>&nbsp;
                I agree with the above declaration.
                </label>
                <button class="btn btn-sm btn-success" data-bind="click:submitReport, enable:termsAccepted" data-bs-dismiss="modal" aria-hidden="true">Submit</button>
                <button class="btn btn-sm btn-danger" data-bs-dismiss="modal" aria-hidden="true">Cancel</button>
            </div>
        </div>
    </div>
</div>
