<div id="activities-plan">
<h4 class="inline">Planned Activities</h4>
<i class="icon-lock" data-bind="visible:planStatus()==='submitted'"
   title="Plan cannot be modified once it has been submitted for approval"></i>
<g:if test="${user?.isEditor}">
    <button type="button" class="btn btn-sm btn-link btn-info" data-bind="visible:isPlanEditable,click:newActivity" style="vertical-align: baseline"><i class="fa fa-plus"></i> Add new activity</button>
    <g:if test="${grailsApplication.config.getProperty('simulateCaseManager')}">
        <span class="pull-right">
            <label class="checkbox inline" style="font-size:0.8em;">
                <input data-bind="checked:userIsCaseManager" type="checkbox"> Impersonate grant manager
            </label>
        </span>
    </g:if>
</g:if>

<ul class="nav nav-tabs space-before">
    <li class=" nav-item active"><a href="#tablePlan" data-toggle="tab" class="nav-link active show">Tabular</a></li>
    <li class=" nav-item"><a href="#ganttPlan" data-toggle="tab" class="nav-link">Gantt chart</a></li>
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
                <th class="actions">Actions</th>
                <th class="fromDate">From</th>
                <th class="toDate">To</th>
                <th class="description-column">Description<i class="fa fa-expand pull-right" data-bind="click:$parent.toggleDescriptions, css:{'fa-expand':!$parent.descriptionExpanded(), 'fa-compress':$parent.descriptionExpanded()}"></i></th>
                <th class="activity">Activity</th>
                <g:if test="${showSites}"><th class="sites">Site</th></g:if>
                <th  class="status" >Status</th>
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
        <button class="btn btn-sm btn-container" disabled="disabled"><i class="fa fa-edit" title="This activity is not editable"></i></button>
        <!-- /ko -->
        <a class="icon-link" data-bind="attr:{href:viewActivityUrl()}"><i class="fa fa-eye" title="View Activity"></i></a>
        <a class="icon-link" data-bind="attr:{href:printActivityUrl()}" target="activity-print"><i class="fa fa-print" title="Open a blank printable version activity"></i></a>
        <button type="button" class="btn btn-sm btn-container" data-bind="click:$root.deleteActivity, enable:$parent.canDeleteActivity"><i class="fa fa-remove" title="Delete activity"></i></button>
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
        <div id="activityStatusReason" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-bind="showModal:displayReasonModal(),with:deferReason">
        <div class="modal-dialog" role="document">
            <div class="modal-content reasonModalForm">
                <div class="modal-header">
                    <h4 class="modal-title"id="myModalLabel">Reason for deferring or cancelling an activity</h4>
                    <button type="button" class="close" aria-hidden="true"
                            data-bind="click:$parent.displayReasonModal.cancelReasonModal">&times;</button>
                </div>
                <div class="modal-body">
                    <p data-bind="visible:$parent.displayReasonModal.showWarning"><b style="color:red;">WARNING: The data recorded for this activity will be deleted</b></p>
                    <p>If you wish to defer or cancel a planned activity you must provide an explanation. Your case
                    manager will use this information when assessing your report.</p>
                    <p>You can simply refer to a document that has been uploaded to the project if you like.</p>
                    <textarea data-bind="value:notes,hasFocus:true" name="reason" rows=4 cols="80" class="form-control form-control-sm validate[required]"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-danger" data-bind="click: $parent.displayReasonModal.cancelReasonModal" data-dismiss="modal" aria-hidden="true">Discard status change</button>
                    <button class="btn btn-sm btn-primary" type="button" data-bind="click:$parent.displayReasonModal.saveReasonDocument">Save reason</button>
                </div>
            </div>
        </div>
        </div>

        <div id="viewActivityStatusReason" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-bind="showModal:displayReasonModalReadOnly(),with:deferReason">
            <div class="modal-dialog" role="document">
                <div class="modal-content reasonModalForm">
                    <div class="modal-header">
                        <h4 class="modal-title">Reason for deferring or cancelling an activity</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                data-bind="click:function() {$parent.displayReasonModalReadOnly(false);}">&times;</button>
                    </div>
                    <div class="modal-body">
                        <textarea readonly="readonly" data-bind="value:notes,hasFocus:true" name="reason"
                                  rows=4 cols="80" class="form-control form-control-sm validate[required]"></textarea>
                    </div>
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
                                        <span class="fa fa-remove"></span>
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


    <script id="updateStatusTmpl" type="text/html">
    <div class="dropdown activity">
        <button type="button" class="btn btn-sm activity-progress" data-toggle="dropdown"
                data-bind="activityProgress:progress"
                style="line-height:16px;min-width:86px;text-align:left;">
            <span data-bind="text: progress"></span> <span class="pull-right"> <i class="fa fa-caret-down"></i></span>
        </button>
        <ul class="dropdown-menu" data-bind="foreach:$root.progressOptions" style="min-width:100px;">
            <!-- Disable item if selected -->
            <li data-bind="css: {'disabled' : $data==$parent.progress() || $data=='planned'}">
                <a href="#" data-bind="click: $parent.progress"><span data-bind="text: $data"></span></a>
            </li>
        </ul>
    </div>
    <span class="save-indicator" data-bind="visible:isSaving"><asset:image src="ajax-saver.gif" alt="saving icon"/> saving</span>
    <!-- ko with: deferReason -->
    <span data-bind="visible: $parent.progress()=='deferred' || $parent.progress()=='cancelled'">
        <i class="icon-list-alt"
           data-bind="popover: {title: $parent.deferReasonHelpText, content: notes, placement: 'left'}, click:$parent.displayReasonModal.editReason">
        </i>
    </span>
    <!-- /ko -->
    </script>

    <script id="viewStatusTmpl" type="text/html">
    <button type="button" class="btn btn-small btn-sm"
            data-bind="activityProgress:progress"
            style="line-height:16px;min-width:75px;text-align:left;cursor:default;color:white; font-size: 0.8rem;">
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


</div>
