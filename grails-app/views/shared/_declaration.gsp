<!-- ko stopBinding: true -->
<div id="${divId ?: 'declaration'}" class="modal hide fade">
    <g:set var="legalDeclaration"><fc:getSettingContent settingType="${declarationType ?: au.org.ala.merit.SettingPageType.DECLARATION}"/></g:set>
    <div class="modal-header hide">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Declaration</h3>
    </div>
    <div class="modal-body declaration-text">
        ${legalDeclaration}
    </div>
    <div class="modal-footer">
        <label class="pull-left">
            <input type="checkbox" name="acceptTerms" data-bind="checked:termsAccepted" style="margin:0;"/>&nbsp;
            I agree with the above declaration.
        </label>
        <button class="btn btn-success" data-bind="click:submitReport, enable:termsAccepted" data-dismiss="modal" aria-hidden="true">Submit</button>
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
    </div>
</div>
<!-- /ko -->