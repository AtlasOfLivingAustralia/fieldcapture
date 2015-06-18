<r:script type="text/javascript">
        fcConfig.organisationReportUrl = '${createLink(action:'report', id:organisation.organisationId)}';
</r:script>

<div id="reporting-content">

    %{--<div class="control-group" style="margin-bottom: 5px;">--}%
    %{--<span class="controls"><button class="btn btn-success pull-right" style="margin-bottom: 5px;" data-bind="click:addReport"><i class="icon-white icon-plus"></i> New ad hoc Report</button></span>--}%
    %{--</div>--}%

    <table class="table table-striped" style="width:100%;">
        <thead>

        <tr>
            <th>Actions</th>
            <th>Programme</th>
            <th>Report Activity</th>
            <th>Date Due<br/><label for="hide-future-reports"><input id="hide-future-reports" type="checkbox" data-bind="checked:hideFutureReports"> Current reports only</label>
            </th>

            <th>Report Progress</th>
            <th>Status<br/><label for="hide-approved-reports"><input id="hide-approved-reports" type="checkbox" data-bind="checked:hideApprovedReports"> Hide approved reports</label></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:{ data:filteredReports, as:'report' }">

        <tr>
            <td>
                <button type="button" class="btn btn-container" data-bind="click:$root.viewAllReports"><i data-bind="css:{'icon-plus':!activitiesVisible(), 'icon-minus':activitiesVisible()}" title="List all project reports"></i></button>
                <button type="button" class="btn btn-container" data-bind="visible:editable, click:$root.editReport"><i class="icon-edit" data-bind="attr:{title:title}" title="Edit reports for all projects in spreadsheet format"></i></button>
            </td>
            <td data-bind="text:report.programme"></td>
            <td><a data-bind="visible:editable, attr:{href:editUrl, title:title}" title="Edit reports for all projects in spreadsheet format"><span data-bind="text:description"></span></a>
                <span data-bind="visible:!editable, text:description"></span>
            </td>
            <td data-bind="text:dueDate.formattedDate()"></td>
            <td>
                <div class="progress active"  data-bind="css:{'progress-success':percentComplete>=100, 'progress-info':percentComplete < 100}">
                    <div class="bar" data-bind="style:{width:percentComplete+'%'}"></div>
                </div>
                <div class="progress-label"> <span data-bind="text:'Reporting completed for '+finishedCount+' of '+count+' projects'"></span></div>

            </td>
            <td data-bind="template:approvalTemplate()">

                <span class="label" data-bind="text:approvalStatus, css:{'label-success':approvalStatus=='Report approved', 'label-info':approvalStatus=='Report submitted', 'label-warning':approvalStatus == 'Report not submitted'}"></span>

            </td>

        </tr>

        <tr data-bind="visible:report.activitiesVisible()">
            <td colspan="6">
                <table style="width:100%">
                    <thead>
                    <tr>
                        <td>Project</td> <td>Report</td><td>Report Status</td><td>Stage Report Status</td>
                    </tr>
                    </thead>
                    <tbody data-bind="foreach:{data:report.activities, as:'activity'}">

                    <tr>

                        <td>
                            <a data-bind="attr:{'href':fcConfig.viewProjectUrl+'/'+projectId}" title="Open the project page">
                                <span data-bind="text:$root.getProject(projectId).name"></span>
                            </a>
                        </td>
                        <td>
                            <a data-bind="attr:{'href':activityDetailsUrl, 'title':activityUrlTitle}">
                                <span data-bind="text:description"></span>
                            </a>
                        </td>
                        <td>
                            <span class="label" data-bind="text:progress, activityProgress:progress"></span>
                        </td>
                        <td>
                            <span class="label" data-bind="text:$root.publicationStatusLabel(publicationStatus), css:{'label-success':publicationStatus=='published', 'label-info':publicationStatus=='pendingApproval', 'label-warning':publicationStatus == 'unpublished' || !publicationStatus}"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>

    </table>

    <div id="addReport" class="modal fade" data-bind="with:newReport" style="display:none;">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="title">Add Report</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal" id="reportForm">

                        <div class="control-group">
                            <label class="control-label" for="project">Project</label>

                            <div class="controls">
                                <select id="project" style="width: 97%;" data-bind="options:$parent.projects, optionsText: 'name', value:project"></select>
                            </div>
                        </div>

                        <div class="control-group">
                            <label class="control-label" for="project">Report Type</label>

                            <div class="controls">
                                <select id="reportType" style="width: 97%;" data-bind="enable:project(), options:availableReports, value:type"></select>
                            </div>
                        </div>


                    </form>
                </div>
                <div class="modal-footer control-group">
                    <div class="controls">
                        <button type="button" class="btn btn-success"
                                data-bind="enable:type() && project(), click:save">Create</button>
                        <button class="btn" data-bind="click:function() {$('#addReport').modal('hide')}">Cancel</button>


                    </div>
                </div>

            </div>
        </div>
    </div>

<script id="notReportable" type="text/html">
<span class="badge badge-warning">Report not submitted</span><br/>
</script>
<script id="notApproved" type="text/html">
<span class="badge badge-warning">Report not submitted</span><br/>
<g:if test="${isAdmin || fc.userIsAlaOrFcAdmin()}">
    <button class="btn btn-success btn-small" data-bind="enable:complete,click:submitReport" title="All project reports must be complete and marked as 'finished' before you can submit this report.">Submit report</button>
</g:if>
</script>
<script id="approved" type="text/html">
<span class="badge badge-success">Report approved</span>
<g:if test="${fc.userIsAlaOrFcAdmin()}"><br/><button type="button" data-bind="click:rejectReport" class="btn btn-danger"><i class="icon-remove icon-white"></i> Withdraw approval</button></g:if>
</script>
<script id="submitted" type="text/html">
<span class="badge badge-info">Report submitted</span>
<g:if test="${isGrantManager || fc.userIsAlaOrFcAdmin()}"><br/>
    <span class="btn-group">
        <button type="button" data-bind="click:approveReport" class="btn btn-success"><i class="icon-ok icon-white"></i> Approve</button>
        <button type="button" data-bind="click:rejectReport" class="btn btn-danger"><i class="icon-remove icon-white"></i> Reject</button>
    </span>
</g:if>
</script>
</div>
