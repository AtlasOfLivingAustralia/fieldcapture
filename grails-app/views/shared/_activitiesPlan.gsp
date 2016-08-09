<r:require modules="datepicker, jqueryGantt, jqueryValidationEngine, attachDocuments"/>
<r:script>
    var PROJECT_STATE = {approved:'approved',submitted:'submitted',planned:'not approved'};
    var ACTIVITY_STATE = {planned:'planned',started:'started',finished:'finished',deferred:'deferred',cancelled:'cancelled'};

</r:script>
<!-- This section is bound to a secondary KO viewModel. The following line prevents binding
         to the main viewModel. -->
<!-- ko stopBinding: true -->
<div class="row-fluid" id="planContainer">
    <div class="actions row-fluid" data-bind="template:planStatusTemplateName"></div>
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
                <table class="table table-condensed" id="activities">
                    <thead>
                    <tr data-bind="visible: stages.length > 0">
                        <th style="width:15%;">Stage</th>
                        <th style="width:68px;">Actions</th>
                        <th style="min-width:64px">From</th>
                        <th style="min-width:64px">To</th>
                        <th style="width:25%;" id="description-column">Description<i class="fa fa-expand pull-right" data-bind="click:toggleDescriptions, css:{'fa-expand':!descriptionExpanded(), 'fa-compress':descriptionExpanded()}"></i></th>
                        <th>Activity</th>
                        <g:if test="${showSites}">
                            <th>Site</th>
                        </g:if>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <!-- ko foreach:stages -->
                    <tbody data-bind="foreach:activities, css:{activeStage:isCurrentStage, inactiveStage: !isCurrentStage}" id="activityList">
                    <tr>
                        <!-- ko with:isFirst -->
                        <td data-bind="attr:{rowspan:$parents[1].activities.length}" class="stage-display">
                            <span data-bind="text:$parents[1].label%{--, blah:console.log(ko.toJS($data))--}%"></span>
                            <br data-bind="visible:$parents[1].isCurrentStage">
                            <span data-bind="visible:$parents[1].isCurrentStage" class="badge badge-info">Current stage</span>

                            <span data-bind="template:$parents[1].stageStatusTemplateName"/>
                        </td>
                        <!-- /ko -->
                        <td>
                            <button type="button" class="btn btn-container" data-bind="click:$parent.editActivity, enable:$parent.canEditActivity()||$parent.canEditOutputData()"><i class="icon-edit" title="Edit Activity"></i></button>
                            <button type="button" class="btn btn-container" data-bind="click:$parent.viewActivity"><i class="icon-eye-open" title="View Activity"></i></button>
                            <button type="button" class="btn btn-container" data-bind="click:$parent.printActivity, enable:$parent.canPrintActivity"><i class="icon-print" title="Print activity"></i></button>
                            <button type="button" class="btn btn-container" data-bind="click:del, enable:$parent.canDeleteActivity"><i class="icon-remove" title="Delete activity"></i></button>
                        </td>
                        <td><span data-bind="text:plannedStartDate.formattedDate"></span></td>
                        <td><span data-bind="text:plannedEndDate.formattedDate"></span></td>
                        <td>
                            <span class="truncate" data-bind="text:description,click:$parent.editActivity, css:{clickable:true}"></span>
                        </td>
                        <td>
                            <span data-bind="text:type,click:$parent.editActivity, css:{clickable:true}"></span>
                        </td>
                        <g:if test="${showSites}">
                            <td><a class="clickable" data-bind="text:siteName,click:$parents[1].openSite"></a></td>
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
                                        <textarea data-bind="value:notes,hasFocus:true" name="reason" rows=4 cols="80" class="validate[required]"></textarea>
                                    </div>
                                    <div class="modal-footer">
                                        <button class="btn" data-bind="click: $parent.displayReasonModal.cancelReasonModal" data-dismiss="modal" aria-hidden="true">Discard status change</button>
                                        <button class="btn btn-primary" data-bind="click:$parent.displayReasonModal.saveReasonDocument">Save reason</button>
                                    </div></form>
                            </div>

                        </td>
                    </tr>
                    </tbody>
                    <!-- /ko -->
                </table>
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

    <g:if env="development">
        <hr />
        <div class="expandable-debug">
            <h3>Plan Debug</h3>
            <div>
                <h4>Target metadata</h4>
                <pre data-bind="text:ko.toJSON(targetMetadata,null,2)"></pre>
            </div>
        </div>
    </g:if>

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
       data-bind="popover: {title: 'Reason for deferral<br><small>(Click icon to edit reason.)</small>', content: notes, placement: 'left'}, click:$parent.displayReasonModal.editReason">
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
       data-bind="popover: {title: 'Reason for deferral', content: notes, placement: 'left'}">
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

</script>

<script id="stageNotApprovedTmpl" type="text/html">
<br/><span class="badge badge-warning">Report not submitted</span>
<!-- Disable button for editor with help text -->
<g:if test="${user?.isAdmin}">
    <br/>
    <button type="button" class="btn btn-success btn-small" style="margin-top:4px;"
            data-bind="
            disable:!$parents[1].readyForApproval() || !$parents[2].isApproved() || !$parents[1].riskAndDetailsActive(),
            click:$parents[1].submitReport,
            attr:{title:($parents[1].readyForApproval() && $parents[1].riskAndDetailsActive()) ?'Submit this stage for implementation approval.':'* Report cannot be submitted while activities are still open. \n* Project details and risk table information are mandatory for report submission.'}"
    >Submit report</button>
</g:if>
<g:else>
    <g:if test="${user?.isEditor}">
        <br/>
        <button type="button" class="btn btn-success btn-small" style="margin-top:4px;" disabled="disabled" title="Your Editor access level does not allow submitting of a report, this is an administrator user role. Contact your Administrator or Grant Manager if access upgrade is required">Submit report</button>
    </g:if>
</g:else>
<br/>
</script>

<script id="stageApprovedTmpl" type="text/html">
<br/>
<span class="badge badge-success">Report Approved</span>

<g:if test="${fc.userInRole(role: grailsApplication.config.security.cas.adminRole) || fc.userInRole(role: grailsApplication.config.security.cas.alaAdminRole)}">
    <br/>
    <button type="button" data-bind="click:$parents[1].rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Withdraw approval</button>
</g:if>

</script>

<script id="stageSubmittedTmpl" type="text/html">
<br/>
<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">
    <br/>
    <span>Grant manager actions: </span>
    <br/>
    <span class="btn-group">
        <button type="button" data-bind="click:$parents[1].approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="click:$parents[1].rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
    </span>
</g:if>

</script>

<script id="stageSubmittedVariationTmpl" type="text/html">
<br/>
<span class="badge badge-info" style="font-size:13px;">Report submitted</span>
<g:if test="${user?.isCaseManager}">
    <br/>
    <span>Grant manager actions: </span>
    <br/>
    <span class="btn-group">
        <button type="button" data-bind="click:$parents[1].approveStage" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="click:$parents[1].rejectStage" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
        <button type="button" data-bind="click:$parents[1].variationModal" class="btn btn-warning"><i class="icon-remove icon-white"></i> Variation</button>
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

    ko.bindingHandlers.showModal = {
        init: function (element, valueAccessor) {
            $(element).modal({ backdrop: 'static', keyboard: true, show: false });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.utils.unwrapObservable(value)) {
                $(element).modal('show');
            }
            else {
                $(element).modal('hide');
            }
        }
    };

    ko.extenders.withPrevious = function (target) {
        // Define new properties for previous value and whether it's changed
        target.previous = ko.observable();
        target.changed = ko.computed(function () { return target() !== target.previous(); });
        target.revert = function () {
            target(target.previous());
        };

        // Subscribe to observable to update previous, before change.
        target.subscribe(function (v) {
            target.previous(v);
        }, null, 'beforeChange');

        // Return modified observable
        return target;
    };

    var sites = ${sites ?: []};
    function lookupSiteName (siteId) {
        var site;
        if (siteId !== undefined && siteId !== '') {
            site = $.grep(sites, function(obj, i) {
                    return (obj.siteId === siteId);
            });
            if (site.length > 0) {
                 return site[0].name;
            }
        }
        return '';
    }

    function drawGanttChart(ganttData) {
        if (ganttData.length > 0) {
            $("#gantt-container").gantt({
                source: ganttData,
                navigate: "keys",
                scale: "weeks",
                itemsPerPage: 30/*,
                onItemClick: function(data) {
                    alert(data.type + ' (' + data.progress() + ')');
                },
                onAddClick: function(dt, rowId) {
                    alert("Empty space clicked - add an item!");
                },
                onRender: function() {
                    if (window.console && typeof console.log === "function") {
                        console.log("chart rendered");
                    }
                }*/
            });
        }
    }

    $(window).load(function () {

        var PlannedActivity = function (act, isFirst, project) {
            var self = this;
            this.activityId = act.activityId;
            this.isFirst = isFirst ? this : undefined;
            this.siteId = act.siteId;
            this.siteName = lookupSiteName(act.siteId);
            this.type = act.type;
            this.projectStage = act.projectStage;
            this.description = act.description;
            this.hasOutputs = act.outputs && act.outputs.length;
            this.startDate = ko.observable(act.startDate).extend({simpleDate:false});
            this.endDate = ko.observable(act.endDate).extend({simpleDate:false});
            this.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate:false});
            this.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate:false});
            this.progress = ko.observable(act.progress).extend({withPrevious:act.progress});
            this.isSaving = ko.observable(false);
            this.publicationStatus = act.publicationStatus ? act.publicationStatus : 'unpublished';
            this.deferReason = ko.observable(undefined); // a reason document or undefined
            // the following handles the modal dialog for deferral/cancel reasons
            this.displayReasonModal = ko.observable(false);
            this.displayReasonModal.trigger = ko.observable();
            this.displayReasonModal.needsToBeSaved = true; // prevents unnecessary saves when a change to progress is reverted
            this.displayReasonModal.closeReasonModal = function() {
                self.displayReasonModal(false);
                self.displayReasonModal.needsToBeSaved = true;
            };
            this.displayReasonModal.cancelReasonModal = function() {
                if (self.displayReasonModal.trigger() === 'progress_change') {
                    self.displayReasonModal.needsToBeSaved = false;
                    self.progress.revert();
                }
                self.displayReasonModal.closeReasonModal();
            };
            this.displayReasonModal.saveReasonDocument = function (item , event) {
                // make sure reason text has been added
                var $form = $(event.currentTarget).parents('form');
                if ($form.validationEngine('validate')) {
                    if (self.displayReasonModal.trigger() === 'progress_change') {
                        self.saveProgress({progress: self.progress(), activityId: self.activityId});
                    }
                    self.deferReason().recordOnlySave("${createLink(controller:'document', action:'documentUpdate')}/" + (self.deferReason().documentId ? self.deferReason().documentId : ''));
                    self.displayReasonModal.closeReasonModal();
                }
            };
            this.displayReasonModal.editReason = function () {
                // popup dialog for reason
                self.displayReasonModal.trigger('edit');
                self.displayReasonModal(true);
            };
            // save progress updates - with a reason document in some cases
            this.progress.subscribe(function (newValue) {
                if (!self.progress.changed()) { return; } // Cancel if value hasn't changed
                if (!self.displayReasonModal.needsToBeSaved) { return; } // Cancel if value hasn't changed

                if (newValue === 'deferred' || newValue === 'cancelled') {
                    // create a reason document if one doesn't exist
                    // NOTE that 'deferReason' role is used in both cases, ie refers to cancel reason as well
                    if (self.deferReason() === undefined) {
                        self.deferReason(new DocumentViewModel(
                            {role:'deferReason', name:'Deferred/canceled reason document'},
                            {activityId:act.activityId/*, projectId:project.projectId*/}));
                    }
                    // popup dialog for reason
                    self.displayReasonModal.trigger('progress_change');
                    self.displayReasonModal(true);
                } else if (self.displayReasonModal.needsToBeSaved) {

                    if ((newValue === 'started' || newValue === 'finished')) {
                        blockUIWithMessage('Loading activity form...');
                        var url = fcConfig.activityEnterDataUrl;
                        document.location.href = url + "/" + self.activityId + "?returnTo=" + here + '&progress='+newValue;
                    }
                    else {
                        self.saveProgress({progress: newValue, activityId: self.activityId});
                    }
                }
            });

            this.saveProgress = function(payload) {
                self.isSaving(true);
                // save new status
                $.ajax({
                    url: "${createLink(controller:'activity', action:'ajaxUpdate')}/" + self.activityId,
                    type: 'POST',
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            alert(data.detail + ' \n' + data.error);
                        }
                        drawGanttChart(planViewModel.getGanttData());
                    },
                    error: function (data) {
                        bootbox.alert('The activity was not updated due to a login timeout or server error.  Please try again after the page reloads.', function() {location.reload();});
                    },
                    complete: function () {
                        //console.log('saved progress');
                        self.isSaving(false);
                    }
                });
            };
            this.del = function () {
                // confirm first
                bootbox.confirm("Delete this activity? Are you sure?", function(result) {
                    if (result) {
                        $.getJSON(fcConfig.activityDeleteUrl + '/' + self.activityId,
                            function (data) {
                                if (data.code < 400) {
                                    document.location.reload();
                                } else {
                                    alert("Failed to delete activity - error " + data.code);
                                }
                            });
                    }
                });
            };

            var reasonDocs = $.grep(act.documents, function(document) {
                return document.role === 'deferReason';
            });
            if (reasonDocs.length > 0) {
                self.deferReason(new DocumentViewModel(reasonDocs[0], {activityId:act.activityId/*, projectId:project.projectId*/}));
            }
            this.isApproved = function() {
                return this.publicationStatus == 'published';
            };
            this.isSubmitted = function() {
                return this.publicationStatus == 'pendingApproval';
            }
        };

        var PlanStage = function (stage, activities, planViewModel, isCurrentStage, project,today, rejectionCategories) {
            var stageLabel = stage.name;

            // Note that the two $ transforms used to extract activities are not combined because we
            // want the index of the PlannedActivity to be relative to the filtered set of activities.
            var self = this,
                activitiesInThisStage = $.grep(activities, function (act, index) {
                    return act.plannedEndDate > stage.fromDate &&  act.plannedEndDate <= stage.toDate;
                });
            this.label = stageLabel;
            this.isCurrentStage = isCurrentStage;
            this.isReportable = isStageReportable(project,stage);
            this.projectId = project.projectId;
            this.planViewModel = planViewModel;


            // sort activities by assigned sequence or date created (as a proxy for sequence).
            // CG - still needs to be addressed properly.
            activitiesInThisStage.sort(function (a,b) {
                if (a.sequence !== undefined && b.sequence !== undefined) {
                    return a.sequence - b.sequence;
                }

                if (a.plannedStartDate != b.plannedStartDate) {
                     return a.plannedStartDate < b.plannedStartDate ? -1 : (a.plannedStartDate > b.plannedStartDate ? 1 : 0);
                }
                var numericActivity = /[Aa]ctivity (\d+)(\w)?.*/;
                var first = numericActivity.exec(a.description);
                var second = numericActivity.exec(b.description);
                if (first && second) {
                    var firstNum = Number(first[1]);
                    var secondNum = Number(second[1]);
                    if (firstNum == secondNum) {
                        // This is to catch activities of the form Activity 1a, Activity 1b etc.
                        if (first.length == 3 && second.length == 3) {
                            return first[2] > second[2] ? 1 : (first[2] < second[2] ? -1 : 0);
                        }
                    }
                    return  firstNum - secondNum;
                }
                else {
                    if (a.dateCreated !== undefined && b.dateCreated !== undefined && a.dateCreated != b.dateCreated) {
                        return a.dateCreated < b.dateCreated ? 1 : -1;
                    }
                    return a.description > b.description ? 1 : (a.description < b.description ? -1 : 0);
                }

            });
            this.activities = $.map(activitiesInThisStage, function (act, index) {
                act.projectStage = stageLabel;
                return new PlannedActivity(act, index === 0, project);
            });

            this.isApproved = function() {
                return stage.publicationStatus == 'published';
            };
            this.isSubmitted = function() {
                return stage.publicationStatus == 'pendingApproval';
            }


            this.readyForApproval = ko.computed(function() {
                return $.grep(self.activities, function (act, i) {
                        return act.progress() === 'planned' || act.progress() === 'started';
                    }).length === 0;
            }, this, {deferEvaluation: true});

            this.riskAndDetailsActive = ko.computed(function(){
            	/*
            	if(project.risks)
            		return project.risks['status'] == 'active';
				*/
            	return true;
            });

            this.submitReport = function () {
                var declaration = $('#declaration')[0];
                var declarationViewModel = {

                    termsAccepted : ko.observable(false),
                    submitReport : function() {
                        self.submitStage();
                    }
                };
                ko.applyBindings(declarationViewModel, declaration);
                $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', function() {ko.cleanNode(declaration);});

            };

            this.approveOrRejectStage = function(url, title, buttonText, rejectionCategories) {
                var $reasonModal = $('#reason-modal');
                var reasonViewModel = {
                    reason: ko.observable(),
                    rejectionCategories:rejectionCategories,
                    rejectionCategory: ko.observable(),
                    title:title,
                    buttonText: buttonText,
                    submit:function() {
                        self.updateStageStatus(url, this.reason(), this.rejectionCategory());
                    }
                }
                ko.applyBindings(reasonViewModel, $reasonModal[0]);
                $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
            };

            this.submitStage = function() {
                var url = '${createLink(controller:'project', action:'ajaxSubmitReport')}/';
                self.updateStageStatus(url);
            };
            this.approveStage = function () {
                var url = '${createLink(controller:'project', action:'ajaxApproveReport')}/';
                self.updateStageStatus(url, '', '');
            };
            this.rejectStage = function() {
                var url = '${createLink(controller:'project', action:'ajaxRejectReport')}/';
                self.approveOrRejectStage(url, 'Rejection', 'Reject', rejectionCategories);
            };
            
            this.variationModal = function() {
                $('#variation').modal("show");
            };

            this.updateStageStatus = function(url, reason, rejectionCategory) {
                var payload = {};
                payload.activityIds = $.map(self.activities, function(act, i) {
                    return act.activityId;
                });
                payload.stage = stageLabel;
                payload.reason = reason || '';
                payload.category = rejectionCategory;
                payload.reportId = stage.reportId;
                payload.projectId = self.projectId;
                $.ajax({
                    url: url + self.projectId,
                    type: 'POST',
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.error) {
                            bootbox.alert("The report could not be submited.  This may be due to a login timeout or because not all activities have been completed, deferred or cancelled.  Please try again after the page reloads.", function() {location.reload();});
                        }
                        else {
                            location.reload();
                        }
                    },
                    error: function (data) {
                        bootbox.alert("The report could not be submited due to a login timeout or server error.  Please try again after the page reloads.", function() {location.reload();});
                    },
                    complete: function () {
                        //console.log('saved progress');

                    }
                });
            };

            this.isReadOnly = ko.computed(function() {
                var isEditor = ${user?.isEditor?'true':'false'};
                return !isEditor || self.isSubmitted() || self.isApproved();
            });
            this.stageStatusTemplateName = ko.computed(function(){
				if (!self.isReportable) {
                    return 'stageNotReportableTmpl';
                }
                if (self.isApproved()) {
                    return 'stageApprovedTmpl';
                }
                if (self.isSubmitted() && today >= project.plannedEndDate) {
                    return 'stageSubmittedVariationTmpl';
                }
                if (self.isSubmitted()) {
                    return 'stageSubmittedTmpl';
                }
                return 'stageNotApprovedTmpl';
            });

			this.previewStage = function(){
				var status = "Report not submitted";
				if (!self.isReportable) {
                   status = "Report not reportable";
                }
                else if (self.isApproved()) {
                    status = "Report approved";
                }
                else if (self.isSubmitted()) {
                	status = "Report submitted";
                }
				var url = '${createLink(controller:'project', action:'previewStageReport')}';
                window.open(url+'?id='+self.projectId +'&reportId='+stage.reportId+'&status='+status, '_blank');
			};
            this.canEditActivity = ko.computed(function () {
                return !self.isReadOnly() && planViewModel.planStatus() === 'not approved';
            });
            this.canEditOutputData = ko.computed(function () {
                return !self.isReadOnly() && planViewModel.planStatus() === 'approved';
            });
            this.canPrintActivity = ko.computed(function () {
                return true;
            });
            this.canDeleteActivity = ko.computed(function () {
                return !self.isReadOnly() && planViewModel.planStatus() === 'not approved';
            });
            this.canUpdateStatus = ko.computed(function () {
                return !self.isReadOnly() && planViewModel.planStatus() === 'approved';
            });

            this.editActivity = function (activity) {
                var url;
                if (self.isReadOnly() || (activity.publicationStatus == 'pendingApproval' || activity.publicationStatus == 'published')) {
                    self.viewActivity(activity);
                } else if (self.canEditOutputData()) {
                    url = fcConfig.activityEnterDataUrl;
                    document.location.href = url + "/" + activity.activityId +
                        "?returnTo=" + here;
                } else if (self.canEditActivity()) {
                    url = fcConfig.activityEditUrl;
                    document.location.href = url + "/" + activity.activityId +
                        "?returnTo=" + here;
                }
            };
            this.viewActivity = function(activity) {
                url = fcConfig.activityViewUrl;
                document.location.href = url + "/" + activity.activityId +
                        "?returnTo=" + here;
            };
            this.printActivity = function(activity) {
                open(fcConfig.activityPrintUrl + "/" + activity.activityId, "fieldDataPrintWindow");
            };
        };

        /* data structures for handling output targets */
        var Output = function (name, scores, existingTargets, root) {
            var self = this;
            this.name = name;
            this.outcomeTarget = ko.observable(function () {
                // find any existing outcome value for this output
                var outcomeValue = "";
                $.each(existingTargets, function (j, existingTarget) {
                    if (existingTarget.outcomeTarget && existingTarget.outputLabel === self.name) {
                        outcomeValue = existingTarget.outcomeTarget;
                        return false; // end the loop
                    }
                });
                return outcomeValue;
            }());
            this.outcomeTarget.subscribe(function() {
                if (root.canEditOutputTargets()) {
                    self.isSaving(true);
                    root.saveOutputTargets();
                }
            });
            this.scores = $.map(scores, function (score, index) {
                var targetValue = 0;
                $.each(existingTargets, function(j, existingTarget) {
                    if (existingTarget.scoreLabel === score.label) {
                        targetValue = existingTarget.target;
                        return false; // end the loop
                    }
                });
                return new OutputTarget(score, targetValue, index === 0, root);
            });
            this.isSaving = ko.observable(false);
        };
        Output.prototype.toJSON = function () {
            // we need to produce a flat target structure (for backwards compatibility)
            var self = this,
            targets = $.map(this.scores, function (score) {
                var js = score.toJSON();
                js.outputLabel = self.name;
                return js;
            });
            // add the outcome target
            targets.push({outputLabel:self.name, outcomeTarget: self.outcomeTarget()});
            return targets;
        };
        Output.prototype.clearSaving = function () {
            this.isSaving(false);
            $.each(this.scores, function (i, score) { score.isSaving(false) });
        };

        var OutputTarget = function (target, value, isFirst, root) {
            var self = this;
            this.scoreName = target.name;
            this.scoreLabel = target.label;
            this.target = ko.observable(value).extend({numericString:1});
            this.isSaving = ko.observable(false);
            this.isFirst = isFirst;
            this.units = target.units;
            this.target.subscribe(function() {
                if (root.canEditOutputTargets()) {
                    self.isSaving(true);
                    root.saveOutputTargets();
                }
            });
        };
        OutputTarget.prototype.toJSON = function () {
            var clone = ko.toJS(this);
            delete clone.isSaving;
            delete clone.isFirst;
            return clone;
        };

        var Outcome = function (target) {
            var self = this;
            this.outputLabel = target.outputLabel;
            this.outcomeText = target.outcomeText;
            this.isSaving = ko.observable(false);
        };

        Outcome.prototype.toJSON = function () {
            var clone = ko.toJS(this);
            delete clone.isSaving;
            return clone;
        };

        function PlanViewModel(activities, reports, outputTargets, project, programModel, today, config) {
            var self = this;
            this.userIsCaseManager = ko.observable(${user?.isCaseManager});
            this.planStatus = ko.observable(project.planStatus || 'not approved');
            this.planStatusTemplateName = ko.computed(function () {
            	// todo remove casemanager and admin functionality from activities plan page
                //return self.planStatus() === 'not approved' ? 'planningTmpl' : self.planStatus() + 'Tmpl';
                return 'noActionTmpl';
            });
            this.isApproved = ko.computed(function () {
                return (self.planStatus() === 'approved');
            });

            this.isPlanEditable = ko.computed(function() {
                return self.planStatus()==='not approved'
            });
            this.canEditOutputTargets = ko.computed(function() {
                var isEditor = ${user?.isEditor?'true':'false'};
                return isEditor && self.planStatus() === 'not approved';
            });
            //this.currentDate = ko.observable("2014-02-03T00:00:00Z"); // mechanism for testing behaviour at different dates
            this.currentDate = ko.observable(new Date().toISOStringNoMillis()); // mechanism for testing behaviour at different dates
            this.currentProjectStage = findStageFromDate(reports,this.currentDate());
            this.loadActivities = function (activities) {
                var stages = [];

                // group activities by stage
                $.each(reports, function (index, stageReport) {
                    stages.push(new PlanStage(stageReport, activities, self, stageReport.name === self.currentProjectStage, project,today, config.rejectionCategories));
                });

                return stages;
            };
            self.stages = self.loadActivities(activities);
            self.currentStageReadyForApproval = ko.computed(function () {
                var currPlanStage = $.grep(self.stages, function(stage) {
                    return stage.label === self.currentProjectStage;
                });
                return currPlanStage.length > 0 ? currPlanStage[0].readyForApproval() : false;
            });
            self.progressOptions = ['planned','started','finished','deferred','cancelled'];
            self.newActivity = function () {
                var context = '',
                    projectId = project.projectId,
                    siteId = "${site?.siteId}",
                    returnTo = '?returnTo=' + document.location.href;
                if (projectId) {
                    context = '&projectId=' + projectId;
                } else if (siteId) {
                    context = '&siteId=' + siteId;
                }
                document.location.href = fcConfig.activityCreateUrl + returnTo + context;
            };
            self.openSite = function () {
                var siteId = this.siteId;
                if (siteId !== '') {
                    document.location.href = fcConfig.siteViewUrl + '/' + siteId;
                }
            };
            self.descriptionExpanded = ko.observable(false);
            self.toggleDescriptions = function() {
                self.descriptionExpanded(!self.descriptionExpanded());
                adjustTruncations();
            };

            var minProjectStart = '2013-01-01T13:00:00Z', canModifyProjectStart = false;
            $.each(programModel.programs, function(i, program) {
                if (project.associatedProgram == program.name) {
                    canModifyProjectStart = !program.projectDatesContracted; // The project dates aren't constrained by the contract dates.

                    $.each(program.subprograms, function(j, subprogram) {
                        if (project.associatedSubProgram == subprogram.name) {
                            minProjectStart = subprogram.startDate || minProjectStart;
                            return false;
                        }
                    });
                    return false;
                }
            });

            this.canModifyProjectStart = canModifyProjectStart;

            self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate:false});
            self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate:false});
            self.autoUpdateEndDate = ko.observable(true);

            self.changeProjectDates = function() {
                $('#changeProjectDates').modal({backdrop:'static'});
                $('#projectDatesForm').validationEngine();
            };
            var defaultReportStage = self.currentProjectStage;
            if (defaultReportStage == 'unknown' && self.stages) {
                defaultReportStage = self.stages[self.stages.length-1].label;
            }
            self.configureProjectReport = function() {
                $('#projectReportOptions').modal({backdrop:'static'});
            }
            self.reportFromStage = ko.observable(defaultReportStage);
            self.reportToStage = ko.observable(defaultReportStage);
            self.projectReportSections = [
               {value:'Images', text:'Images', default:true},
               {value:'Activity status summary', text:'Activity status summary', default:true},
               {value:'Supporting documents', text:'Supporting documents', default:true},
               {value:'Project outcomes', text:'Project outcomes', default:true},
               {value:'Progress against output targets', text: 'Progress against output targets', default:true},
               {value:'Progress of outputs without targets', text:'Progress of outputs without targets', default:true},
               {value:'Stage report', text:'Stage report', help:'Displays the most recent ‘Progress, Outcomes and Learning’ activity for the period selected. If you have selected the Progress against activities option below, this will already include the ‘Progress, Outcomes and Learning’ activity.', default:false },
               {value:'Project risks', text:'Project risks', default:true},
               {value:'Project risks changes', text:'Project risks changes', help:'Displays all risks created or modified in the reporting period selected.', default:false},
               {value:'Progress against activities', text:'Progress against activities', help:'Includes all activity reporting data for the selected stage(s).  This will only display started or finished activities.', default:true}];

            self.reportIncludedSections = ko.observableArray();
            for (var i=0; i<self.projectReportSections.length; i++) {
                if (self.projectReportSections[i].default) {
                    self.reportIncludedSections.push(self.projectReportSections[i].value);
                }
            }
            self.disabledSection = function(section) {
                return section.value == 'Stage report' && self.reportIncludedSections.indexOf('Progress against activities') >= 0;
            };
            self.reportIncludedSections.subscribe(function() {
                if (self.reportIncludedSections.indexOf('Progress against activities') >= 0) {
                    if (self.reportIncludedSections.indexOf('Stage report') >= 0) {
                        self.reportIncludedSections.splice(self.reportIncludedSections.indexOf('Stage report'), 1);
                    }
                }
            });


            self.reportableStages = ko.computed(function() {
                var stages = [];
                $.each(self.stages || [], function(i, stage) {
                    stages.push(stage.label);
                });
                return stages;
            });
            self.reportableToStages = ko.computed(function() {
                var stages = [];
                var started = false;
                $.each(self.stages || [], function(i, stage) {
                    if (stage.label == self.reportFromStage()) {
                        started = true;
                    }
                    if (started) {
                        stages.push(stage.label);
                    }

                });
                return stages;
            });
            self.generateProjectReport = function(url) {

                var url = url + '?fromStage='+self.reportFromStage()+'&toStage='+self.reportToStage();
                for (var i=0; i<self.reportIncludedSections().length; i++) {
                    url+='&sections='+self.reportIncludedSections()[i];
                }
                window.open(url,'project-report');
                $('#projectReportOptions').modal('hide');
            };
            self.generateProjectReportHTML = function() {
                self.generateProjectReport(fcConfig.projectReportUrl);
            };
            self.generateProjectReportPDF = function() {
                self.generateProjectReport(fcConfig.projectReportPDFUrl);
            };

            self.cancelGenerateReport = function() {
                $('#projectReportOptions').modal('hide');
            }


            self.plannedStartDate.subscribeChanged(function(oldStartDate, newStartDate) {

                if (self.autoUpdateEndDate()) {
                    var end = moment(self.plannedEndDate());
                    var duration = moment(newStartDate).diff(moment(oldStartDate), 'days');
                    end.subtract(duration, 'days');
                    self.plannedEndDate(convertToIsoDate(end.toDate()));
                }
            }, null, "beforeChange");

            var originalDuration = moment(project.plannedStartDate).diff(moment(project.plannedEndDate), 'days');
            self.showDurationWarning = ko.computed(function() {
                var duration = moment(self.plannedStartDate()).diff(moment(self.plannedEndDate()), 'days');
                return Math.abs(duration - originalDuration) >= 7;
            });

            // Window scoped for use by jquery validation engine
            window.validateProjectStartDate = function() {
                var value = self.plannedStartDate();
                var endDate = self.plannedEndDate();
                if (value == project.plannedStartDate && endDate == project.plannedEndDate) {
                    return 'The dates have not changed';
                }
                var maxProjectStart = project.contractStartDate;
                if (maxProjectStart && value > maxProjectStart) {
                    return 'The date must be on or before the contract start date - '+convertToSimpleDate(maxProjectStart);
                }
                if (minProjectStart && value < minProjectStart) {
                    return 'The date must be on or after '+convertToSimpleDate(minProjectStart);
                }
            };
            self.saveProjectDates = function() {

                var result = $('#projectDatesForm').validationEngine('validate');
                if (result) {
                    $('#changeProjectDates').modal('hide');
                    var payload = {projectId: project.projectId, plannedStartDate: self.plannedStartDate(), plannedEndDate: self.plannedEndDate()};
                    blockUIWithMessage("Updating project dates...");
                    $.ajax({
                        url: "${createLink(controller: 'project', action: 'updateProjectDates')}/" + project.projectId,
                        type: 'POST',
                        data: JSON.stringify(payload),
                        contentType: 'application/json'
                    }).done(function(data) {
                        document.location.reload();
                    }).fail(function(data) {
                        showAlert("Unable to update the project dates.",
                                "alert-error","status-update-error-placeholder");
                        $.unblockUI();
                    });
                }
            };
            self.cancelChangeProjectDates = function() {
                $('#changeProjectDates').modal('hide');
            };

            // Project status manipulations
            // ----------------------------
            // This has been refactored to update project status on specific actions (rather than subscribing
            //  to changes in the status) so that errors can be handled in a known context.

            // save new status and return a promise
            this.saveStatus = function (newValue) {
                var payload = {planStatus: newValue, projectId: project.projectId};
                return $.ajax({
                    url: "${createLink(action:'ajaxUpdate')}/" + project.projectId,
                    type: 'POST',
                    data: JSON.stringify(payload),
                    contentType: 'application/json'
                });
            };
            // submit plan and handle errors
            this.confirmSubmitPlan = function () {
                var declaration = $('#declaration')[0];
                var declarationViewModel = {

                    termsAccepted : ko.observable(false),
                    submitReport : function() {
                        self.submitPlan();
                    }
                };
                ko.applyBindings(declarationViewModel, declaration);
                $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', function() {ko.cleanNode(declaration);});

            };
            this.submitPlan = function () {

                self.saveStatus('submitted')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to submit plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        self.planStatus('submitted');
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to submit plan. You do not have editor rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to submit plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
            };
            // approve plan and handle errors
            this.approvePlan = function () {
                // should we check that status is 'submitted'?
                self.saveStatus('approved')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to approve plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        self.planStatus('approved');
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to approve plan. You do not have grant manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to approve plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
            };
            // reject plan and handle errors
            this.rejectPlan = function () {
                // should we check that status is 'submitted'?
                self.saveStatus('not approved')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to reject plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        self.planStatus('not approved');
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to reject plan. You do not have grant manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to reject plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
            };
            // make plan modifiable and handle errors
            // this is the same as rejectPlan apart from messages but it is expected that it will
            // have different functionality in the future so it has been separated
            this.modifyPlan = function () {
                // should we check that status is 'approved'?
                self.saveStatus('not approved')
                .done(function (data) {
                    if (data.error) {
                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.detail + ' \n' + data.error,
                            "alert-error","status-update-error-placeholder");
                    } else {
                        self.planStatus('not approved');
                        location.reload();
                    }
                })
                .fail(function (data) {
                    if (data.status === 401) {
                        showAlert("Unable to modify plan. You do not have grant manager rights for this project.",
                            "alert-error","status-update-error-placeholder");
                    } else {
                        showAlert("Unable to modify plan. An unhandled error occurred: " + data.status,
                            "alert-error","status-update-error-placeholder");
                    }
                });
            };


            this.submitReport = function (e) {

                $('#declaration').modal('show');
            };

            this.getGanttData = function () {
                var values = [],
                    previousStage = '',
                    hasAnyValidPlannedEndDate = false;
                $.each(self.stages, function (i, stage) {
                    $.each(stage.activities, function (j, act) {
                        var statusClass = 'gantt-' + act.progress(),
                            startDate = act.plannedStartDate.date().getTime(),
                            endDate = act.plannedEndDate.date().getTime();
                        if (!isNaN(startDate)) {
                            values.push({
                                name:act.projectStage === previousStage ? '' : act.projectStage,
                                desc:act.type,
                                values: [{
                                    label: act.type,
                                    from: "/Date(" + startDate + ")/",
                                    to: "/Date(" + endDate + ")/",
                                    customClass: statusClass,
                                    dataObj: act
                                }]
                            });
                        }
                        hasAnyValidPlannedEndDate |= !isNaN(endDate);
                        previousStage = act.projectStage;
                    });
                });
                // don't return any data if there is no valid end date because the lib will throw an error
                return hasAnyValidPlannedEndDate ? values : [];
            };
            self.outputTargets = ko.observableArray([]);
            self.saveOutputTargets = function() {
                if (self.canEditOutputTargets()) {
                    if ($('#outputTargetsContainer').validationEngine('validate')) {
                        var targets = [];
                        $.each(self.outputTargets(), function (i, target) {
                            $.merge(targets, target.toJSON());
                        });
                        var project = {projectId:'${project.projectId}', outputTargets:targets};
                        var json = JSON.stringify(project);
                        var id = "${'/' + project.projectId}";
                        $.ajax({
                            url: "${createLink(action: 'ajaxUpdate')}" + id,
                            type: 'POST',
                            data: json,
                            contentType: 'application/json',
                            success: function (data) {
                                if (data.error) {
                                    alert(data.detail + ' \n' + data.error);
                                }
                            },
                            error: function (data) {
                                var status = data.status;
                                alert('An unhandled error occurred: ' + data.status);
                            },
                            complete: function(data) {
                                $.each(self.outputTargets(), function(i, target) {
                                    // The timeout is here to ensure the save indicator is visible long enough for the
                                    // user to notice.
                                    setTimeout(function(){target.clearSaving();}, 1000);
                                });
                            }
                        });
                    } else {
                        // clear the saving indicator when validation fails
                        $.each(self.outputTargets(), function (i, target) {
                            target.clearSaving();
                        });
                    }
                }
            };
            self.addOutputTarget = function(target) {
                var newOutputTarget = new OutputTarget(target);
                self.outputTargets.push(newOutputTarget);
                newOutputTarget.target.subscribe(function() {
                    if (self.canEditOutputTargets()) {
                        newOutputTarget.isSaving(true);
                        self.saveOutputTargets();
                    }
                });
            };

            // metadata for setting up the output targets
            self.targetMetadata = ${outputTargetMetadata as grails.converters.JSON};

            self.loadOutputTargets = function () {
                var activityTypes = {},  // this just saves us checking multiple activities of the same type
                    uniqueOutputs = {};  // this ensures each output is unique
                // collect the metadata for the unique outputs for the current set of activities
                $.each(activities, function (i, activity) {
                    if (!activityTypes[activity.type] && self.targetMetadata[activity.type]) {
                        activityTypes[activity.type] = true;
                        $.each(self.targetMetadata[activity.type], function(outputName, scores) {
                            if (!uniqueOutputs[outputName]) {
                                uniqueOutputs[outputName] = true;
                                self.outputTargets.push(new Output(outputName, scores, outputTargets, self));
                            }
                        });
                    }
                });
            }();
        }
		var today = '${today}';
		var programModel = <fc:modelAsJavascript model="${programs}"/>;
        var reports = <fc:modelAsJavascript model="${reports}"/>;

        var planViewModel = new PlanViewModel(
            ${activities ?: []},
            reports,
            ${project.outputTargets ?: '{}'},
            checkAndUpdateProject(${project}, null, programModel),
            programModel,
            today,
            {rejectionCategories: ['Minor', 'Moderate', 'Major'] }
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
        drawGanttChart(planViewModel.getGanttData());

        $('#outputTargetsContainer').validationEngine('attach', {scroll:false});

    });

</r:script>
