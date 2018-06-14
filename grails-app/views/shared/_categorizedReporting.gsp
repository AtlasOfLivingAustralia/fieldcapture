<div id="reporting-content">
    <g:if test="${reportsHeader}"><h4 class="header-with-help">Project Reports</h4></g:if>

    <div data-bind="foreach:reportsByCategory">
        <h3 data-bind="text:title"></h3>

        <div data-bind="template:{name:'reportTable', data:model}"></div>
    </div>
    <div data-bind="if:reportsByCategory.length == 0">
        No reports found.
    </div>

</div>

<script id="notReportable" type="text/html">
    <span class="badge badge-warning">Report not submitted</span><br/>
</script>

<script id="notApproved" type="text/html">
    <p><span class="badge badge-warning">Report not submitted</span></p>

<g:if test="${isAdmin || fc.userIsAlaOrFcAdmin()}">
    <p>
        <button class="btn btn-success btn-small" data-bind="enable:complete,click:submitReport"
                title="All fields in the reporting form must be completed before it can be submitted.">Submit report</button>
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
        <button type="button" data-bind="click:approveReport" class="btn btn-success"><i
                class="icon-ok icon-white"></i> Confirm</button>
        <button type="button" data-bind="click:rejectReport" class="btn btn-danger"><i
                class="icon-remove icon-white"></i> More Information Required</button>
    </span>
    </p>
</g:if>
</script>


<script id="reportTable" type="text/html">

<table class="table table-striped" style="width:100%;">
    <thead>

    <tr>
        <th class="report-actions">Actions</th>
        <th class="report-name">Report</th>
        <th class="report-start">Period start</th>
        <th class="report-end">Period end
            <g:if test="${hideDueDate}">
                <br/><label><input class="hide-future-reports" type="checkbox"
                                   data-bind="checked:hideFutureReports"> Current reports only</label>
            </g:if>
        </th>
        <g:if test="${!hideDueDate}">
            <th class="report-due">Date Due<br/><label><input class="hide-future-reports" type="checkbox"
                                           data-bind="checked:hideFutureReports"> Current reports only</label>
            </th>
        </g:if>
        <th class="report-status">Status<br/><label><input class="hide-approved-reports" type="checkbox"
                                     data-bind="checked:hideApprovedReports"> Hide approved reports</label></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:{ data:filteredReports, as:'report' }">

    <tr>
        <td class="report-actions">
            <button type="button" class="btn btn-container" data-bind="visible:editable, click:$root.editReport"><i
                    class="fa fa-edit" title="Complete this report"></i></button>
            <button type="button" class="btn btn-container" data-bind="visible:viewable, click:$root.viewReport"><i
                    class="fa fa-eye" title="View this report"></i></button>
            <button type="button" class="btn btn-container"
                    data-bind="visible:viewable && report.downloadUrl, click:$root.downloadReport"><i
                    class="fa fa-download" title="Download a PDF of this report"></i></button>

        </td>
        <td class="report-name"><a data-bind="visible:editable, attr:{href:editUrl, title:title}" title="Complete this report"><span
                data-bind="text:description"></span></a>
            <span data-bind="visible:!editable, text:description"></span>
        </td>
        <td class="report-start" data-bind="text:fromDate.formattedDate"></td>
    <td class="report-end" data-bind="text:toDate.formattedDate">
        <g:if test="${!hideDueDate}">
            <td class="report-due" data-bind="text:dueDate.formattedDate()"></td>
        </g:if>
        <td class="report-status" data-bind="template:approvalTemplate()">

            <span class="label"
                  data-bind="text:approvalStatus, css:{'label-success':approvalStatus=='Report approved', 'label-info':approvalStatus=='Report submitted', 'label-warning':approvalStatus == 'Report not submitted'}"></span>

        </td>

    </tr>
    </tbody>
    <tfoot>
    <tr data-bind="visible:filteredReports().length == 0">
        <td colspan="5">No reports found.</td>
    </tr>
    </tfoot>

</table>

</script>

<asset:script type="text/javascript">

    $(function() {
        var reports = <fc:modelAsJavascript model="${reports ?: []}"/>;
    var addHocReportTypes = <fc:modelAsJavascript model="${adHocReportTypes}"/>;
    var reportOwner = fcConfig.reportOwner;
    var order = <fc:modelAsJavascript model="${reportOrder}"/>;
    ko.applyBindings(new CategorisedReportsViewModel(reports, order, fcConfig.projects, addHocReportTypes, reportOwner, fcConfig), document.getElementById('reporting-content'));
});
</asset:script>
