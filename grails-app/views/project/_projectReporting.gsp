<div id="generate-report" class="validationEngineContainer">
    <g:if test="${user?.isCaseManager || fc.userIsAlaOrFcAdmin()}">
        <div data-bind="if:!reportsAreGenerated()" class="required">
            <div class="alert alert-info">
                Project reports cannot be created until the MERI plan has been approved
            </div>
        </div>
        <div data-bind="if:anyReportData" class="required">
            <div class="form-actions" >
                <b>Grant manager actions:</b>
                <div class="alert alert-info">
                    Please ensure the project start and end dates match the dates in the work order before pressing the "Generate Project Reports" button
                </div>
                <form id="reportingTabDatesForm">
                    <div class="row mb-2">
                        <div class="col-sm-2">
                            <label for="startDate">Project start date
                            <fc:iconHelp title="Start date">Date the project is intended to commence.</fc:iconHelp>
                            </label>
                            <div class="input-group input-append">
                                <fc:datePicker class="form-control form-control-sm" bs4="true" targetField="plannedStartDate.date" id= "startDate" name="startDate" data-validation-engine="validate[required, past[endDate]]" autocomplete="off"/>
                            </div>
                        </div>
                        <div class="col-sm-2">
                            <label for="endDate">Project end date
                            <fc:iconHelp title="End date">Date the project is intended to finish.</fc:iconHelp>
                            </label>
                            <div class="input-group input-append">
                                <fc:datePicker class="form-control form-control-sm" bs4="true" targetField="plannedEndDate.date" id="endDate" name="endDate" data-validation-engine="validate[required, future[startDate]" autocomplete="off"/>
                            </div>
                        </div>
                    </div>
                </form>
                <span class="grantManagerActionSpan">
                    <button type="button" id="generateReports" data-bind="click:generateProjectReports" class="btn btn-sm btn-success"><i class="fa fa-check"></i> Generate Project Reports</button>
                </span>
            </div>
        </div>
    </g:if>
    <g:elseif test="${fc.userIsSiteAdmin()}">
        <div class="alert alert-info">
            You must be listed as a Grant Manager in the Project Access section of the Admin tab to create the reports for this project
        </div>
    </g:elseif>
</div>
<g:set var="declarationTemplate" value="${declarationTemplate}"/>
<g:render template="/shared/categorizedReporting"></g:render>
<g:render template="/shared/declaration" model="${[declarationType:declarationTemplate]}"/>
<g:render template="/shared/reportRejectionModal"/>
<script type="text/html" id="adjustment-instructions">
<fc:getSettingContent settingType="${au.org.ala.merit.SettingPageType.REPORT_ADJUSTMENT_INSTRUCTIONS}"/>
</script>

<g:if test="${user?.isCaseManager || fc.userIsAlaOrFcAdmin()}">
<asset:script type="text/javascript">
    $(function() {
        var config = _.extend(fcConfig, {adjustmentInstructionsSelector:'#adjustment-instructions', datesFormSelector:"#reportingTabDatesForm"});
        ko.applyBindings(new GrantManagerReportsViewModel(config), document.getElementById('generate-report'));
    });
</asset:script>
</g:if>