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
    <div data-bind="if:isCurrent()">
        <span><span class="badge badge-info" data-bind="if:isCurrent()">Current reporting period</span>
            <fc:iconHelp dynamic-help="currentPeriodHelpText"></fc:iconHelp> </span>
    </div>

<span class="badge badge-info" data-bind="if:progress() == 'started'">Reporting form incomplete</span>
<span class="badge badge-success" data-bind="if:progress() == 'finished'">Reporting form complete</span>

</script>

<script id="notSubmitted" type="text/html">

    <p><span class="badge badge-warning">Report not submitted</span></p>

<g:if test="${isAdmin || fc.userIsAlaOrFcAdmin()}">
    <p>
        <button class="btn btn-success btn-small" data-bind="enable:complete,click:submitReport"
                title="The reporting form must be marked as complete before this report can be submitted.">Submit report</button>
    </p>
    <span class="badge badge-info" data-bind="if:progress() == 'started'">Reporting form incomplete</span>
    <span class="badge badge-success" data-bind="if:progress() == 'finished'">Reporting form complete</span>

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

<div  data-bind="visible:displayShowAllCheckbox">
    <label class="checkbox label-with-help"><input class="hide-future-reports" type="checkbox" data-bind="checked:showAllReports"> Show all reports</label>
    <fc:iconHelp>By default, reports approved more than a week ago and reports for a future reporting period are hidden.  Tick this box to see all reports.</fc:iconHelp>
</div>
<table class="table table-striped" style="width:100%;">
    <thead>

    <tr>
        <th class="report-actions">
            Actions <fc:iconHelp html="html">Submitted and approved reports cannot be edited<br/>Only reports marked as completed can be viewed or downloaded as a PDF</fc:iconHelp></th>
        <th class="report-name">Report</th>
        <th class="report-start">Period start</th>
        <th class="report-end">Period end
        </th>
        <g:if test="${!hideDueDate}">
            <th class="report-due">Date Due
            </th>
        </g:if>
        <th class="report-status">Status <fc:iconHelp html="html">Reports cannot be submitted until after the end of the reporting period. <br/> Reports must be marked as complete before they can be submitted. </fc:iconHelp><br/></th>
    </tr>
    </thead>
    <tbody data-bind="foreach:{ data:filteredReports, as:'report', afterAdd: attachHelp}">

    <tr>
        <td class="report-actions">
            <a class="btn btn-container" data-bind="attr:{href:editUrl}, visible:editable"><i
                    class="fa fa-edit" title="Complete this report"></i></a>

            <a class="btn btn-container disabled-icon" data-bind="visible:!editable">
            <i class="fa fa-edit" title="Submitted or approved reports cannot be edited"></i>
            </a>

            <a class="btn btn-container" data-bind="attr:{href:viewUrl}, visible:viewable"><i
                    class="fa fa-eye" title="View this report"></i></a>

            <a class="btn btn-container disabled-icon" data-bind="visible:!viewable">
                <i class="fa fa-eye" title="Please mark the report as complete before viewing it"></i>
            </a>

            <a target="print-report" class="btn btn-container"
                    data-bind="attr:{href:downloadUrl}, visible:viewable"><i
                    class="fa fa-download" title="Download a PDF of this report"></i></a>
            <a class="btn btn-container disabled-icon" data-bind="visible:!viewable">
                <i class="fa fa-download" title="Please mark the report as complete before generating a PDF"></i>
            </a>

            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <a class="btn btn-container pull-right" href="javascript:void(0)" title="Delete all data entered for this report"
                   data-bind="visible:canReset, click:resetReport"><i class="fa fa-remove" style="color:red;"></i>
                </a>

            </g:if>

        </td>
        <td class="report-name"><a data-bind="visible:editable, attr:{href:editUrl, title:title}" title="Complete this report"><span
                data-bind="text:description"></span></a>
            <span data-bind="visible:!editable, text:description"></span>
        </td>
        <td class="report-start" data-bind="text:fromDate.formattedDate"></td>
    <td class="report-end" data-bind="text:toDateLabel">
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
