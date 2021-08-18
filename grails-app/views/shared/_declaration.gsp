<!-- ko stopBinding: true -->
<div id="${divId ?: 'declaration'}" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5>Declaration</h5>
                <g:if test="${meriPlan}">
                    <button type="button" class="close" data-dismiss="modal" data-bind="click:cancelMeriPlanDeclaration" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </g:if>
                <g:else>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </g:else>

            </div>

            <div class="modal-body declaration-text">
                <fc:getSettingContent settingType="${declarationType ?: au.org.ala.merit.SettingPageType.DECLARATION}"/>
            </div>

            <div class="modal-footer">
                <label class="float-left">
                    <input type="checkbox" name="acceptTerms" data-bind="checked:termsAccepted" class="m-0"/>&nbsp;
                I agree with the above declaration.
                </label>
                <button class="btn btn-sm btn-success" data-bind="click:submitReport, enable:termsAccepted"
                        data-dismiss="modal" aria-hidden="true">Submit</button>
                <g:if test="${meriPlan}">
                    <button class="btn btn-sm btn-danger" data-dismiss="modal" data-bind="click:cancelMeriPlanDeclaration" aria-hidden="true">Cancel</button>
                </g:if>
                <g:else>
                    <button class="btn btn-sm btn-danger" data-dismiss="modal" aria-hidden="true">Cancel</button>
                </g:else>

            </div>
        </div>
    </div>
</div>
<!-- /ko -->
