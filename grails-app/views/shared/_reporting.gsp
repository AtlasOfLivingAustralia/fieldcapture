

<div id="reporting-content">

    <g:if test="${fc.userIsAlaOrFcAdmin() && adHocReportTypes}">
    <div class="control-group" style="margin-bottom: 5px;">
         <span class="controls"><button class="btn btn-success pull-right" style="margin-bottom: 5px;" data-bind="click:addReport"><i class="icon-white icon-plus"></i> New Report</button></span>
    </div>
    </g:if>

    <g:if test="${reportsHeader}"><h4 class="header-with-help">Project Reports</h4></g:if>
    <table class="table table-striped" style="width:100%;">
        <thead>

        <tr>
            <th>Actions</th>
            <th>Report</th>
            <th>Period
                <g:if test="${hideDueDate}">
                <br/><label for="hide-future-reports"><input id="hide-future-reports" type="checkbox" data-bind="checked:hideFutureReports"> Current reports only</label>
                </g:if>
            </th>
            <g:if test="${!hideDueDate}">
            <th>Date Due<br/><label for="hide-future-reports"><input id="hide-future-reports" type="checkbox" data-bind="checked:hideFutureReports"> Current reports only</label>
            </th>
            </g:if>
            <th>Status<br/><label for="hide-approved-reports"><input id="hide-approved-reports" type="checkbox" data-bind="checked:hideApprovedReports"> Hide approved reports</label></th>
        </tr>
        </thead>
        <tbody data-bind="foreach:{ data:filteredReports, as:'report' }">

        <tr>
            <td>
                <button type="button" class="btn btn-container" data-bind="visible:editable, click:$root.editReport"><i class="fa fa-edit" title="Complete this report"></i></button>
                <button type="button" class="btn btn-container" data-bind="visible:viewable, click:$root.viewReport"><i class="fa fa-eye" title="View this report"></i></button>
                <button type="button" class="btn btn-container" data-bind="visible:viewable && report.downloadUrl, click:$root.downloadReport"><i class="fa fa-download" title="Download a PDF of this report"></i></button>

            </td>
            <td><a data-bind="visible:editable, attr:{href:editUrl, title:title}" title="Complete this report"><span data-bind="text:description"></span></a>
                <span data-bind="visible:!editable, text:description"></span>
            </td>
            <td data-bind="text:period"></td>
            <g:if test="${!hideDueDate}">
            <td data-bind="text:dueDate.formattedDate()"></td>
            </g:if>
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

                            <a data-bind="if:projectId, attr:{'href':fcConfig.viewProjectUrl+'/'+projectId}" title="Open the project page">
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
        <tfoot>
            <tr data-bind="visible:filteredReports().length == 0">
                <td colspan="5">No reports found.</td>
            </tr>
        </tfoot>

    </table>

    <div id="addReport" class="modal fade" data-bind="with:newReport" style="display:none;">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="title">Add Report</h4>
                </div>

                <div class="modal-body">
                    <form class="form-horizontal" id="reportForm">

                        <div class="control-group form-group">
                            <label class="control-label" for="reportType">Report Type</label>

                            <div class="controls">
                                <select id="reportType" class="form-control" style="width: 97%;" data-bind="options:availableReports, optionsText:formatReportType, value:selectedReportType"></select>
                            </div>
                        </div>

                        <div class="control-group form-group">
                            <label class="control-label" for="fromDate">From</label>

                            <div class="controls">
                                <fc:datePicker class="form-control" targetField="fromDate.date" name="fromDate" data-validation-engine="validate[required]" printable="${printView}"/>
                            </div>
                        </div>

                        <div class="control-group">
                            <label class="control-label" for="toDate">To</label>

                            <div class="controls form-group">
                                <fc:datePicker class="form-control" targetField="toDate.date" name="toDate" data-validation-engine="validate[required]" printable="${printView}"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer control-group">
                    <div class="controls">
                        <button type="button" class="btn btn-success"
                                data-bind="enable:type() && fromDate() && toDate(), click:save">Create</button>
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
    <p><span class="badge badge-warning">Report not submitted</span></p>

<g:if test="${isAdmin || fc.userIsAlaOrFcAdmin()}">
    <p>
    <button class="btn btn-success btn-small" data-bind="enable:complete,click:submitReport" title="All fields in the Self Assessment form must be completed before it can be submitted.">Submit report</button>
    </p>
</g:if>
</script>
<script id="approved" type="text/html">
<p><span class="badge badge-success">Report approved</span></p>

<g:if test="${fc.userIsAlaOrFcAdmin()}">
    <p>
    <button type="button" data-bind="click:rejectReport" class="btn btn-danger"><i class="icon-remove icon-white"></i> Withdraw approval</button></g:if>
    </p>
</script>
<script id="submitted" type="text/html">
<p><span class="badge badge-info">Report submitted</span></p>
<g:if test="${isGrantManager || fc.userIsAlaOrFcAdmin()}">

    <span class="btn-group">
        <button type="button" data-bind="click:approveReport" class="btn btn-success"><i class="icon-ok icon-white"></i> Confirm</button>
        <button type="button" data-bind="click:rejectReport" class="btn btn-danger"><i class="icon-remove icon-white"></i> More Information Required</button>
    </span>
    </p>
</g:if>
</script>
</div>

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

<asset:script type="text/javascript">

$(function() {
    var reports = <fc:modelAsJavascript model="${reports?:[]}"/>;
    var addHocReportTypes = <fc:modelAsJavascript model="${adHocReportTypes}"/>;
    var reportOwner = fcConfig.reportOwner;
    ko.applyBindings(new ReportsViewModel(reports, fcConfig.projects, addHocReportTypes, reportOwner, fcConfig), document.getElementById('reporting-content'));
});
</asset:script>
