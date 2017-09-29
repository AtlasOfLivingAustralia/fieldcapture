<asset:script>
    var PROJECT_STATE = {approved:'approved',submitted:'submitted',planned:'not approved',unlockedforcorrection:'unlocked for correction'};
    var ACTIVITY_STATE = {planned:'planned',started:'started',finished:'finished',deferred:'deferred',cancelled:'cancelled',corrected:'corrected'};

</asset:script>
<style type="text/css">
    a.icon-link {
        color: black;
    }
</style>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<span class="badge" style="font-size: 13px;" data-bind="text:meriPlanStatus().text, css:meriPlanStatus().badgeClass"></span>
<!-- ko stopBinding: true -->
<div class="row-fluid" id="planContainer">

    <div id="status-update-error-placeholder"></div>
    <div id="activityContainer" class="space-before">

        <g:if test="${user?.isAdmin || user?.isCaseManager}">
            <div data-bind="visible:canModifyProjectStart && isPlanEditable()">
                <span class="pull-right"><button class="btn" data-bind="click:changeProjectDates">Change project dates</button><fc:iconHelp>Use this to adjust the start and end date of your project, if required. The dates for all project activities will be adjusted to reflect the date you select. The administrative reports will also be updated to reflect the start date you select</fc:iconHelp> </span>
            </div>
            <div class="modal hide" id="changeProjectDates">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Change project dates</h4>
                        </div>

                        <div class="modal-body">
                            <form id="projectDatesForm">
                                <p>Changing the project dates will also adjust the dates of all project activities and update any administrative reports currently listed against your project.</p>
                                <p>New project start date: <fc:datePicker class="input-small" targetField="plannedStartDate.date" name="plannedStartDate" data-validation-engine="validate[funcCall[validateProjectStartDate]]"/></p>
                                <p>New project end date: &nbsp;<fc:datePicker class="input-small" targetField="plannedEndDate.date" name="plannedEndDate" data-validation-engine="validate[future[plannedStartDate]]"/></p>
                                <p>Automatically adjust end date to maintain project duration: <input type="checkbox" data-bind="checked:autoUpdateEndDate"></p>
                            </form>
                        </div>
                        <div class="alert" data-bind="visible:showDurationWarning">
                            Warning: Significant changes to the project duration will require grant manager approval.
                        </div>
                    </div>
                    <div class="modal-footer control-group">
                        <div class="controls">
                            <button type="button" class="btn btn-success"
                                    data-bind="click:saveProjectDates">Save</button>
                            <button class="btn" data-bind="click:cancelChangeProjectDates">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="project-report" data-bind="visible:!canModifyProjectStart || !isPlanEditable()">
                <span class="pull-right">
                    <button class="btn btn-info" data-bind="click:configureProjectReport">Project Summary</button><fc:iconHelp>Generate a project summary covering activities from the selected stages. The report will open in a new window.</fc:iconHelp> </span>
                </span>
            </div>
            <div class="modal hide" id="projectReportOptions">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Project Summary Options</h4>
                        </div>

                        <div class="modal-body">
                            <form class="form-horizontal">
                                <div class="control-group">
                                    <label class="control-label" for="fromStage">From: </label>
                                    <div class="controls">
                                        <select id="fromStage" data-bind="value:reportFromStage, options:reportableStages"></select>
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label class="control-label" for="toStage">To: </label>
                                    <div class="controls">
                                        <select id="toStage" data-bind="value:reportToStage, options:reportableToStages"></select>
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label class="control-label">Optional content: </label>
                                    <div class="controls">
                                        <!-- ko foreach:projectReportSections -->
                                            <label class="checkbox"><input type="checkbox" data-bind="checkedValue: $data.value, checked: $parent.reportIncludedSections, disable:$parent.disabledSection($data)">
                                                <span data-bind="text:$data.text"></span>
                                                <!-- ko if:$data.help -->
                                                    <i class="icon-question-sign" data-bind="popover:{content:$data.help, placement:'top'}"></i>
                                                <!-- /ko -->
                                            </label>
                                        <!-- /ko -->
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label class="control-label">PDF Orientation: <fc:iconHelp>If your PDF includes activities with wide tables, the Landscape setting may improve the result.  This setting has no effect on the HTML view. </fc:iconHelp></label>
                                    <div class="controls">
                                        <select data-bind="value:orientation">
                                            <option value="portrait">Portrait</option>
                                            <option value="landscape">Landscape</option>
                                        </select>
                                    </div>
                                </div>

                            </form>
                        </div>

                    </div>

                    <div class="modal-footer control-group">

                        <div class="controls">

                            <button type="button" class="btn btn-success"
                                    data-bind="click:generateProjectReportHTML">Generate Report (HTML)</button>
                            <button type="button" class="btn btn-success"
                                    data-bind="click:generateProjectReportPDF">Generate Report (PDF)</button>
                            <button class="btn" data-bind="click:cancelGenerateReport">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

        </g:if>

        <g:render template="/shared/activitiesByStage"/>

        </div>

    <form id="outputTargetsContainer">
        <h4 style="display: inline;">Total Project Outputs </h4>
        <fc:iconHelp title="Total Project Outputs">Statement of Outputs to be delivered by end of the project should be SMART and link to a relevant Project Outcome. For example: By 30 June 2018, 10ha of riparian revegetation works will be completed along priority waterways towards Outcome 1.</fc:iconHelp>
        <br/><br/>
        <table id="outputTargets" class="table table-condensed tight-inputs">
            <thead><tr><th>Output Type</th><th>Output Statement / Description</th><th>Output Target Measure(s)</th><th>Target</th></tr></thead>
            <!-- ko foreach:outputTargets -->
            <tbody data-bind="foreach:scores">
            <tr>
                <!-- ko with:isFirst -->
                <td data-bind="attr:{rowspan:$parents[1].scores.length}">
                    <b><span data-bind="text:$parents[1].name"></span></b>
                </td>
                <td data-bind="attr:{rowspan:$parents[1].scores.length}">
                    <textarea data-bind="visible:$root.canEditOutputTargets(),value:$parents[1].outcomeTarget" rows="3" cols="80" style="width:90%"></textarea>
                    <span data-bind="visible:!$root.canEditOutputTargets(),text:$parents[1].outcomeTarget" style="white-space: pre-wrap;"></span>
                    <span class="save-indicator" data-bind="visible:$parents[1].isSaving"><asset:image src="ajax-saver.gif" alt="saving icon"/> saving</span>
                </td>
                <!-- /ko -->
                <td><span data-bind="text:scoreLabel"></span></td>
                <td>
                    <input type="text" class="input-mini" data-bind="visible:$root.canEditOutputTargets(),value:target" data-validation-engine="validate[required,custom[number]]"/>
                    <span data-bind="visible:!$root.canEditOutputTargets(),text:target"></span>
                    <span data-bind="text:units"></span>
                    <span class="save-indicator" data-bind="visible:isSaving"><asset:image src="ajax-saver.gif" alt="saving icon"/> saving</span>
                </td>

            </tr>
            </tbody>
            <!-- /ko -->
        </table>

    </form>

</div>

<script id="planningTmpl" type="text/html">
<span class="span3">
    <span class="badge badge-warning" style="font-size:13px;">This plan is not yet approved</span>
</span>
<g:if test="${user?.isAdmin}">
    <span class="span9">
        Build your plan by adding activities and entering project targets. Submit your plan when it is built.
        <button type="button" data-bind="click:submitPlan" class="btn btn-success"><i class="icon-thumbs-up icon-white"></i> Submit plan</button>
    </span>
</g:if>
</script>

<script id="submittedTmpl" type="text/html">
<span class="span4">
    <span class="badge badge-info" style="font-size:13px;">This plan has been submitted for approval</span>
</span>
<span data-bind="visible:!userIsCaseManager()" class="span8">
    <span>Your plan is locked until it is approved by your grant manager. Once your plan is approved
    you can start entering activity information.</span>
</span>
<span data-bind="visible:userIsCaseManager" class="span8">
    <span>Grant manager actions: </span>
    <span class="btn-group">
        <button type="button" data-bind="click:approvePlan" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve plan</button>
        <button type="button" data-bind="click:rejectPlan" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject plan</button>
    </span>
</span>
</script>

<script id="approvedTmpl" type="text/html">
<span class="span3">
    <span class="badge badge-success" style="font-size:13px;">This plan has been approved</span>
</span>
<span data-bind="visible:!userIsCaseManager()" class="span9">
    <span>Enter information into each activity. When all activities in a stage are finished (or
    cancelled or deferred) you can submit the stage for validation by clicking the 'report' button.</span>
</span>
<span data-bind="visible:userIsCaseManager" class="span8">
    <span>Grant manager actions: </span>
    <span class="btn-group">
        <button type="button" data-bind="click:modifyPlan" class="btn btn-info" title="Allow the user to vary and re-submit the plan">
            <i class="icon-repeat icon-white"></i> Modify plan
        </button>
    </span>
</span>
</script>

<script id="stageNotReportableTmpl" type="text/html">
    <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <button type="button" class="btn delete-stage btn-small" title="Delete all activities in this stage" data-bind="visible:activities.length > 0, click:deleteStage">Delete stage</button>
    </g:if>
</script>

<script id="stageNotApprovedTmpl" type="text/html">
<span class="badge badge-warning">Report not submitted</span>
<!-- Disable button for editor with help text -->
<g:if test="${user?.isAdmin}">

    <button type="button" class="btn btn-success btn-small"
            data-bind="
            enable:canSubmitReport,
            click:submitReport,
            attr:{title:submitReportHelp}"
    >Submit report</button>
</g:if>
<g:else>
    <g:if test="${user?.isEditor}">
        <br/>
        <button type="button" class="btn btn-success btn-small" style="margin-top:4px;" disabled="disabled" title="Your Editor access level does not allow submitting of a report, this is an administrator user role. Contact your Administrator or Grant Manager if access upgrade is required">Submit report</button>
    </g:if>
</g:else>
<g:if test="${fc.userIsAlaOrFcAdmin()}">
    <button type="button" class="btn delete-stage btn-small" title="Delete all activities in this stage" data-bind="visible:activities.length > 0, click:deleteStage">Delete stage</button>
</g:if>
<br/>
</script>

<script id="stageApprovedTmpl" type="text/html">

<span class="badge badge-success">Report Approved</span>

<g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.adminRole) || fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole)}">
    <button type="button" data-bind="enable:canRejectStage, click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Withdraw approval</button>
</g:if>

</script>

<script id="stageSubmittedTmpl" type="text/html">
<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">

    <span>Grant manager actions: </span>
    <span class="btn-group">
        <button type="button" data-bind="enable:canApproveStage, click:approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="enable:canRejectStage, click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
    </span>
</g:if>

</script>

<script id="stageSubmittedVariationTmpl" type="text/html">

<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">

    <span>Grant manager actions: </span>

    <span class="btn-group">
        <button type="button" data-bind="enable:canApproveStage, click:approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="enable:canRejectStage, click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
        <button type="button" data-bind="enable:canApproveStage, click:variationModal" class="btn btn-warning"><i class="icon-remove icon-white"></i> Variation</button>
    </span>
</g:if>

</script>

<!-- /ko -->

<g:render template="/shared/declaration"/>

<!-- ko stopBinding: true -->
<div id="reason-modal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3><span data-bind="text:title"></span> reason</h3>
    </div>
    <div class="modal-body">
        %{--<p data-bind="visible:rejectionCategories">--}%
            %{--Rejection Category:<br/>--}%
            %{--<select data-bind="options:rejectionCategories, value:rejectionCategory"></select>--}%
        %{--</p>--}%
        <p>Please enter a reason.  This reason will be included in the email sent to the project administrator(s).</p>
        <textarea rows="5" style="width:97%" data-bind="textInput:reason"></textarea>
    </div>
    <div class="modal-footer">
        <button class="btn btn-success" data-bind="click:submit, text:buttonText, enable:reason" data-dismiss="modal" aria-hidden="true"></button>
        <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
    </div>
</div>
<!-- /ko -->


<asset:script>


    $(function () {

		var today = '${today}';
		var programModel = <fc:modelAsJavascript model="${programs}"/>;
        var reports = <fc:modelAsJavascript model="${reports}"/>;
        var userIsEditor = ${user?.isEditor?'true':'false'};

        var planViewModel = new ProjectActivitiesTabViewModel(
            fcConfig.project.activities || [],
            reports,
            fcConfig.project.outputTargets || {},
            ${scores as grails.converters.JSON},
            fcConfig.project,
            programModel,
            today,
            {rejectionCategories: ['Minor', 'Moderate', 'Major'], saveTargetsUrl:fcConfig.projectUpdateUrl },
            userIsEditor
        );
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));

        // only initialise truncation when the table is visible else we will get 0 widths
        $(document).on('planTabShown', function () {
            // initial adjustments
            planViewModel.adjustTruncations();
            planViewModel.refreshGantChart();
        });


        $('#outputTargetsContainer').validationEngine('attach', {scroll:false});

    });

</asset:script>
