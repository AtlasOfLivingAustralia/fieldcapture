<r:require modules="datepicker, jqueryGantt, jqueryValidationEngine, attachDocuments, activity"/>
<r:script>
    var PROJECT_STATE = {approved:'approved',submitted:'submitted',planned:'not approved'};
    var ACTIVITY_STATE = {planned:'planned',started:'started',finished:'finished',deferred:'deferred',cancelled:'cancelled'};

</r:script>
<style type="text/css">
    a.icon-link {
        color: black;
    }
</style>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
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


        <h4 class="inline">Planned Activities</h4>
        <i class="icon-lock" data-bind="visible:planStatus()==='submitted'"
           title="Plan cannot be modified once it has been submitted for approval"></i>
        <g:if test="${user?.isEditor}">
            <button type="button" class="btn btn-link btn-info" data-bind="visible:isPlanEditable,click:newActivity" style="vertical-align: baseline"><i class="fa fa-plus"></i> Add new activity</button>
            <g:if test="${grailsApplication.config.simulateCaseManager}">
                <span class="pull-right">
                    <label class="checkbox inline" style="font-size:0.8em;">
                        <input data-bind="checked:userIsCaseManager" type="checkbox"> Impersonate grant manager
                    </label>
                </span>
            </g:if>
        </g:if>

        <ul class="nav nav-tabs nav-tab-small space-before">
            <li class="active"><a href="#tablePlan" data-toggle="tab">Tabular</a></li>
            <li><a href="#ganttPlan" data-toggle="tab">Gantt chart</a></li>
        </ul>

        <div class="tab-content" style="padding:0;border:none;overflow:visible">
            <div class="tab-pane active" id="tablePlan">

                <!-- ko foreach:stages -->

                <div data-bind="visible:showEmptyStages || activities.length > 0">
                <div class="stage-header">

                    <i data-bind="css:{'fa-plus-square-o':collapsed, 'fa-minus-square-o':!collapsed()}, click:toggleActivities" class="fa"></i> &nbsp; <b style="font-size: 20px;" data-bind="text:label"></b> - <span data-bind="text:datesLabel"></span>


                    <div class="pull-right">
                        <span data-bind="visible:isCurrentStage"></span>
                        <span data-bind="visible:isCurrentStage" class="badge badge-info">Current stage</span>

                        <span data-bind="template:stageStatusTemplateName"></span>
                    </div>
                </div>

                <table class="table table-condensed" data-bind="visible:!collapsed()">
                    <thead>

                    <tr>
                        <th style="min-width:68px; width:5%;">Actions</th>
                        <th style="min-width:90px; width:5%;">From</th>
                        <th style="min-width:90px; width:5%">To</th>
                        <th style="width:40%;" class="description-column">Description<i class="fa fa-expand pull-right" data-bind="click:$parent.toggleDescriptions, css:{'fa-expand':!$parent.descriptionExpanded(), 'fa-compress':$parent.descriptionExpanded()}"></i></th>
                        <th style="width:25%;">Activity</th>
                        <g:if test="${showSites}"><th style="width:15%">Site</th></g:if>
                        <th style="width:5%; min-width:90px;">Status</th>
                    </tr>
                    </thead>

                    <tbody data-bind="css:{activeStage:isCurrentStage, inactiveStage: !isCurrentStage}" id="activityList">
                    <!-- ko foreach:activities -->
                    <tr>

                        <td>
                            <!-- ko if:$parent.canEditActivity()||$parent.canEditOutputData() -->
                            <a class="icon-link" data-bind="attr:{href:editActivityUrl()}"><i class="fa fa-edit" title="Edit Activity"></i></a>
                            <!-- /ko -->
                            <!-- ko if:!$parent.canEditActivity() && !$parent.canEditOutputData() -->
                            <button class="btn btn-container" disabled="disabled"><i class="fa fa-edit" title="This activity is not editable"></i></button>
                            <!-- /ko -->
                            <a class="icon-link" data-bind="attr:{href:viewActivityUrl()}"><i class="fa fa-eye" title="View Activity"></i></a>
                            <a class="icon-link" data-bind="attr:{href:printActivityUrl()}" target="activity-print"><i class="fa fa-print" title="Open a blank printable version activity"></i></a>
                            <button type="button" class="btn btn-container" data-bind="click:$root.deleteActivity, enable:$parent.canDeleteActivity"><i class="fa fa-remove" title="Delete activity"></i></button>
                        </td>
                        <td><span data-bind="text:plannedStartDate.formattedDate"></span></td>
                        <td><span data-bind="text:plannedEndDate.formattedDate"></span></td>
                        <td>
                            <span class="truncate" data-bind="text:description"></span>
                        </td>
                        <td>
                            <a data-bind="attr:{href:editActivityUrl()}"><span data-bind="text:type"></span></a>
                        </td>
                        <g:if test="${showSites}">
                            <td><a class="clickable" data-bind="text:siteName,attr:{href:siteUrl()}"></a></td>
                        </g:if>
                        <td>
                            <span data-bind="template:$parent.canUpdateStatus() ? 'updateStatusTmpl' : 'viewStatusTmpl'"></span>

                            <!-- Modal for getting reasons for status change -->
                            <div id="activityStatusReason" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
                                 data-bind="showModal:displayReasonModal(),with:deferReason">
                                <form class="reasonModalForm">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                                data-bind="click:$parent.displayReasonModal.cancelReasonModal">×</button>
                                        <h3 id="myModalLabel">Reason for deferring or cancelling an activity</h3>
                                    </div>
                                    <div class="modal-body">
                                        <p>If you wish to defer or cancel a planned activity you must provide an explanation. Your case
                                        manager will use this information when assessing your report.</p>
                                        <p>You can simply refer to a document that has been uploaded to the project if you like.</p>
                                        <textarea data-bind="value:notes,hasFocus:true" name="reason" rows=4 cols="80" class="validate[required]" style="width:95%;"></textarea>
                                    </div>
                                    <div class="modal-footer">
                                        <button class="btn" data-bind="click: $parent.displayReasonModal.cancelReasonModal" data-dismiss="modal" aria-hidden="true">Discard status change</button>
                                        <button class="btn btn-primary" data-bind="click:$parent.displayReasonModal.saveReasonDocument">Save reason</button>
                                    </div></form>
                            </div>

                            <div id="viewActivityStatusReason" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
                                 data-bind="showModal:displayReasonModalReadOnly(),with:deferReason">
                                <div class="reasonModalForm">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                                data-bind="click:function() {$parent.displayReasonModalReadOnly(false);}">×</button>
                                        <h3>Reason for deferring or cancelling an activity</h3>
                                    </div>
                                    <div class="modal-body">

                                        <textarea readonly="readonly" data-bind="value:notes,hasFocus:true" name="reason" rows=4 cols="80" class="validate[required]" style="width:95%;"></textarea>
                                    </div>
                                </div>
                            </div>

                        </td>
                    </tr>
                    <!-- /ko -->
                    <tr data-bind="visible:activities.length == 0">
                        <td colspan="7">No activities defined for this stage</td>
                    </tr>
                    </tbody>

                </table>
                </div>
                <!-- /ko -->


            </div>
            <div class="tab-pane" id="ganttPlan" style="overflow:hidden;">
                <div id="gantt-container"></div>
            </div>
        </div>
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
                    <span class="save-indicator" data-bind="visible:$parents[1].isSaving"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/> saving</span>
                </td>
                <!-- /ko -->
                <td><span data-bind="text:scoreLabel"></span></td>
                <td>
                    <input type="text" class="input-mini" data-bind="visible:$root.canEditOutputTargets(),value:target" data-validation-engine="validate[required,custom[number]]"/>
                    <span data-bind="visible:!$root.canEditOutputTargets(),text:target"></span>
                    <span data-bind="text:units"></span>
                    <span class="save-indicator" data-bind="visible:isSaving"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/> saving</span>
                </td>

            </tr>
            </tbody>
            <!-- /ko -->
        </table>

    </form>

</div>

<script id="updateStatusTmpl" type="text/html">
<div class="btn-group">
    <button type="button" class="btn btn-small dropdown-toggle" data-toggle="dropdown"
            data-bind="activityProgress:progress"
            style="line-height:16px;min-width:86px;text-align:left;">
        <span data-bind="text: progress"></span> <span class="caret pull-right" style="margin-top:6px;"></span>
    </button>
    <ul class="dropdown-menu" data-bind="foreach:$root.progressOptions" style="min-width:100px;">
        <!-- Disable item if selected -->
        <li data-bind="css: {'disabled' : $data==$parent.progress() || $data=='planned'}">
            <a href="#" data-bind="click: $parent.progress"><span data-bind="text: $data"></span></a>
        </li>
    </ul>
</div>
<span class="save-indicator" data-bind="visible:isSaving"><r:img dir="images" file="ajax-saver.gif" alt="saving icon"/> saving</span>
<!-- ko with: deferReason -->
<span data-bind="visible: $parent.progress()=='deferred' || $parent.progress()=='cancelled'">
    <i class="icon-list-alt"
       data-bind="popover: {title: $parent.deferReasonHelpText, content: notes, placement: 'left'}, click:$parent.displayReasonModal.editReason">
    </i>
</span>
<!-- /ko -->
</script>

<script id="viewStatusTmpl" type="text/html">
<button type="button" class="btn btn-small"
        data-bind="activityProgress:progress"
        style="line-height:16px;min-width:75px;text-align:left;cursor:default;color:white">
    <span data-bind="text: progress"></span>
</button>
<!-- ko with: deferReason -->
<span data-bind="visible: $parent.progress()=='deferred' || $parent.progress()=='cancelled'">
    <i class="icon-list-alt"
       data-bind="popover: {title: $parent.deferReasonHelpText, content: notes, placement: 'left'}, click:function() {$parent.displayReasonModalReadOnly(true);}">
    </i>
</span>
<!-- /ko -->
</script>
<script id="noActionTmpl" type="text/html">
</script>

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
            disable:!readyForApproval() || isApproved() || !riskAndDetailsActive(),
            click:submitReport,
            attr:{title:(readyForApproval() && riskAndDetailsActive()) ?'Submit this stage for implementation approval.':'* Report cannot be submitted while activities are still open. \n* Project details and risk table information are mandatory for report submission.'}"
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
    <button type="button" data-bind="click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Withdraw approval</button>
</g:if>

</script>

<script id="stageSubmittedTmpl" type="text/html">
<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">

    <span>Grant manager actions: </span>
    <span class="btn-group">
        <button type="button" data-bind="click:approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
    </span>
</g:if>

</script>

<script id="stageSubmittedVariationTmpl" type="text/html">

<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">

    <span>Grant manager actions: </span>

    <span class="btn-group">
        <button type="button" data-bind="click:approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="click:rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
        <button type="button" data-bind="click:variationModal" class="btn btn-warning"><i class="icon-remove icon-white"></i> Variation</button>
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

<!-- ko stopBinding: true -->
<div id="attachReasonDocument" class="modal fade" style="display:none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="title">Activity Deferral</h4>
            </div>

            <div class="modal-body">
                <p>Please enter the reason the activity is being deferred.  You can also attach supporting documentation.</p>
                <form class="form-horizontal" id="documentForm">

                    <div class="control-group">
                        <label class="control-label" for="deferralReason">Reason</label>

                        <div class="controls">
                            <textarea id="deferralReason" rows="4" cols="80" data-bind="value:name, valueUpdate:'keyup'"></textarea>
                        </div>
                    </div>

                    <div class="control-group">
                        <label class="control-label" for="documentFile">Supporting documentation</label>

                        <div class="controls">
                            <span class="btn fileinput-button" data-bind="visible:!filename()">
                                <i class="icon-plus"></i>
                                <input id="documentFile" type="file" name="files"/>
                                Attach file
                            </span>
                            <span data-bind="visible:filename()">
                                <input type="text" readonly="readonly" data-bind="value:fileLabel"/>
                                <button class="btn" data-bind="click:removeFile">
                                    <span class="icon-remove"></span>
                                </button>
                            </span>
                        </div>
                    </div>

                    <div class="control-group" data-bind="visible:hasPreview">
                        <label class="control-label">Preview</label>

                        <div id="preview" class="controls"></div>
                    </div>

                    <div class="control-group" data-bind="visible:progress() > 0">
                        <label for="progress" class="control-label">Progress</label>

                        <div id="progress" class="controls progress progress-info active input-large"
                             data-bind="visible:!error() && progress() < 100, css:{'progress-info':progress()<100, 'progress-success':complete()}">
                            <div class="bar" data-bind="style:{width:progress()+'%'}"></div>
                        </div>

                        <div id="successmessage" class="controls" data-bind="visible:complete()">
                            <span class="alert alert-success">File successfully uploaded</span>
                        </div>

                        <div id="message" class="controls" data-bind="visible:error()">
                            <span class="alert alert-error" data-bind="text:error"></span>
                        </div>
                    </div>

                    <g:if test="${grailsApplication.config.debugUI}">
                        <div class="expandable-debug">
                            <h3>Debug</h3>
                            <div>
                                <h4>Document model</h4>
                                <pre class="row-fluid" data-bind="text:toJSONString()"></pre>
                            </div>
                        </div>
                    </g:if>

                </form>
            </div>
            <div class="modal-footer control-group">
                <div class="controls">
                    <button type="button" class="btn btn-success"
                            data-bind="enable:name() && !error(), click:save, visible:!complete()">Save</button>
                    <button class="btn" data-bind="click:cancel, visible:!complete()">Cancel</button>
                    <button class="btn" data-bind="click:close, visible:complete()">Close</button>

                </div>
            </div>

        </div>
    </div>
</div>
<!-- /ko -->


<r:script>


    $(function () {

		var today = '${today}';
		var programModel = <fc:modelAsJavascript model="${programs}"/>;
        var reports = <fc:modelAsJavascript model="${reports}"/>;
        var userIsEditor = ${user?.isEditor?'true':'false'};

        var planViewModel = new PlanViewModel(
            fcConfig.project.activities || [],
            reports,
            fcConfig.project.outputTargets || {},
            ${scores as grails.converters.JSON},
            checkAndUpdateProject(fcConfig.project, null, programModel),
            programModel,
            today,
            {rejectionCategories: ['Minor', 'Moderate', 'Major'], saveTargetsUrl:fcConfig.projectUpdateUrl },
            userIsEditor
        );
        ko.applyBindings(planViewModel, document.getElementById('planContainer'));

        // the following code handles resize-sensitive truncation of the description field
        $.fn.textWidth = function(text, font) {
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
            $.fn.textWidth.fakeEl.html(text || this.val() || this.text()).css('font', font || this.css('font'));
            return $.fn.textWidth.fakeEl.width();
        };

        function adjustTruncations () {
            function truncate (cellWidth, originalTextWidth, originalText) {
                var fractionThatFits = cellWidth/originalTextWidth,
                    truncationPoint = Math.floor(originalText.length * fractionThatFits) - 4;
                return originalText.substr(0,truncationPoint) + '..';
            }
            $('.truncate').each( function () {
                var $span = $(this),
                    text = $span.html(),
                    textWidth = $span.textWidth(),
                    textLength = text.length,
                    original = $span.data('truncation');
                // store original values if first time in
                if (original === undefined) {
                    original = {
                        text: text,
                        textWidth: textWidth,
                        textLength: textLength
                    };
                    $span.data('truncation',original);
                }
                if (!planViewModel.descriptionExpanded()) {
                    var cellWidth = $span.parent().width(),
                        isTruncated = original.text !== text;

                    if (cellWidth > 0 && textWidth > cellWidth) {
                        $span.attr('title',original.text);
                        $span.html(truncate(cellWidth, original.textWidth, original.text));
                    } else if (isTruncated && cellWidth > textWidth + 4) {
                        // check whether the text can be fully expanded
                        if (original.textWidth < cellWidth) {
                            $span.html(original.text);
                            $span.removeAttr('title');
                        } else {
                            $span.html(truncate(cellWidth, original.textWidth, original.text));
                        }
                    }
                }
                else {
                    $span.html(original.text);
                    $span.removeAttr('title');
                }
            });
        }

        // throttle the resize events so it doesn't go crazy
        (function() {
             var timer;
             $(window).resize(function () {
                 if(timer) {
                     clearTimeout(timer);
                 }
                 timer = setTimeout(adjustTruncations, 50);
             });
        }());

        // only initialise truncation when the table is visible else we will get 0 widths
        $(document).on('planTabShown', function () {
            // initial adjustments
            adjustTruncations();
        });

        // the following draws the gantt chart
        planViewModel.refreshGantChart();

        $('#outputTargetsContainer').validationEngine('attach', {scroll:false});

    });

</r:script>
