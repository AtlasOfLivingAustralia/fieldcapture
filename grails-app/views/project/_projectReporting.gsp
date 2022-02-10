<div id="generate-report" class="validationEngineContainer">
    <g:if test="${user?.isCaseManager || fc.userIsAlaOrFcAdmin()}">
        <div data-bind="if:!isMeriPlanApproved()" class="required">
        <div class="alert alert-info">
            Project reports cannot be created until the MERI plan is approved and the project start date is confirmed
        </div>
        </div>
        <div data-bind="if:anyReportData" class="required">
            <div class="form-actions" >
                <b>Grant manager actions:</b>
                <div class="alert alert-info">
                    Please ensure the project start date matches the project start date in the work order before pressing the "Generate Project Reports" button
                </div>
                <div>
                    <div class="form-group row">
                        <label for="startDate" class="col-form-label col-sm-2">Project Start Date</label>
                        <div>
                            <div class="input-group">
                                <fc:datePicker size="form-control form-control-sm" targetField="plannedStartDate.date" id="startDate" bs4="true" name="startDate" data-bind="datepicker:plannedStartDate.date" data-validation-engine="validate[required, past[plannedEndDate]]" printable="${printView}"/>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="grantManagerActionSpan">
                    <button type="button" id="generateReports" data-bind="click:generateProjectReports" class="btn btn-sm btn-success"><i class="fa fa-check"></i> Generate Project Reports</button>
                </span>
            </div>
        </div>
    </g:if>
</div>
<g:render template="/shared/categorizedReporting"></g:render>
<g:render template="/shared/declaration" model="${[declarationType:au.org.ala.merit.SettingPageType.RLP_REPORT_DECLARATION]}"/>
<g:render template="/shared/reportRejectionModal"/>
<script type="text/html" id="adjustment-instructions">
<fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.REPORT_ADJUSTMENT_INSTRUCTIONS}"/>
</script>

<asset:script type="text/javascript">
    $(function() {
        var reports = <fc:modelAsJavascript model="${reports ?: []}"/>;
        var config = _.extend(fcConfig, {adjustmentInstructionsSelector:'#adjustment-instructions'});
        var project = <fc:modelAsJavascript model="${project?: null}"/>;
        ko.applyBindings(new GrantManagerReportsViewModel(reports, config, project), document.getElementById('generate-report'));
        // $('.validationEngineContainer').validationEngine();
    });
</asset:script>
