<div id="reporting-content">

    <g:if test="${reportsHeader}"><h4 class="header-with-help">Project Reports</h4></g:if>

    <div data-bind="foreach:reportsByCategory">
        <div class="report-category">
            <h3 data-bind="text:title"></h3>

            <div class="report-category-description" data-bind="if:description">
                <div data-bind="html:description.markdownToHtml()"></div>
            </div>
            <div class="report-category-banner" data-bind="if:banner">
                <div class="alert alert-banner">
                    <div data-bind="html:banner.markdownToHtml()"></div>
                </div>
            </div>

            <div data-bind="template:{name:'reportTable', data:model}"></div>
        </div>
    </div>
    <div data-bind="if:reportsByCategory.length == 0">
        No reports found.
    </div>

</div>

<script id="notReportable" type="text/html">
    <!-- ko if:!report.editable -->
    <p><span class="badge text-bg-danger text-wrap" data-bind="text:notEditableReason()"></span></p>
    <!-- /ko -->
<p data-bind="visible:report.dateAdjusted"><span class="badge p-1 text-white text-bg-danger">Report adjusted</span></p>
    <div data-bind="if:isCurrent()">
        <span><span class="badge p-1 text-white text-bg-info" data-bind="if:isCurrent()">Current reporting period</span>
            <fc:iconHelp dynamic-help="currentPeriodHelpText"></fc:iconHelp> </span>
    </div>

<span class="badge p-1 text-white text-bg-info" data-bind="if:progress() == 'started'">Reporting form incomplete</span>
<span class="badge p-1 text-white text-bg-success" data-bind="if:progress() == 'finished'">Reporting form complete</span>

<g:if test="${fc.userIsAlaOrFcAdmin()}">
    <div class="mt-2" data-bind="visible:!hasData()">
        <p>
            <button type="button" data-bind="click:cancelReport" class="btn btn-sm btn-danger"><i class="fa fa-remove icon-white"></i> Not required</button>
        </p>
    </div>
</g:if>
</script>

<script id="notSubmitted" type="text/html">
 <p data-bind="if:!report.editable"><span class="badge text-bg-danger p-1">Template being updated</span></p>
    <p data-bind="visible:report.dateAdjusted"><span class="badge p-1 text-white text-bg-danger">Report adjusted</span></p>
    <p><span class="badge p-1 text-white text-bg-warning">Report not submitted</span></p>

    <g:if test="${isAdmin || fc.userIsSupportOfficerOrAdmin()}">
        <p>
            <button class="btn btn-success btn-sm" data-bind="enable:complete,click:submitReport"
                    title="The reporting form must be marked as complete before this report can be submitted.">Submit report</button>
        </p>

    </g:if>
    <span class="badge p-1 text-white text-bg-info" data-bind="if:progress() == 'started'">Reporting form incomplete</span>
    <span class="badge p-1 text-white text-bg-success" data-bind="if:progress() == 'finished'">Reporting form complete</span>
    <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <div class="mt-2" data-bind="visible:!hasData()">
            <p>
                <button type="button" data-bind="click:cancelReport" class="btn btn-sm btn-danger"><i class="fa fa-remove icon-white"></i> Not required</button>
            </p>
        </div>
    </g:if>
</script>

<script id="approved" type="text/html">

    <p><span class="badge p-1 text-white text-bg-success">Report approved</span></p>
    <p data-bind="visible:report.dateAdjusted"><span class="badge p-1 text-white text-bg-danger">Report adjusted</span></p>
    <g:if test="${fc.userIsSupportOfficerOrAdmin()}">
        <p>
            <button type="button" data-bind="click:rejectReport" class="btn btn-sm btn-danger"><i class="fa fa-remove icon-white"></i> Withdraw approval</button>
        </p>
    </g:if>
    <g:if test="${fc.userIsSiteAdmin()}">
        <p data-bind="visible:report.isAdjustable && !report.dateAdjusted">
            <button type="button" data-bind="click:adjustReport" class="btn btn-sm btn-danger"><i class="fa fa-edit"></i> Adjustment required</button>
        </p>
    </g:if>


</script>

<script id="submitted" type="text/html">
    <p><span class="badge p-1 text-white text-bg-info">Report submitted</span></p>
    <p data-bind="visible:report.dateAdjusted"><span class="badge p-1 text-white text-bg-danger">Report adjusted</span></p>
    <div data-bind="if:overDelivered">
        <p><span data-bind="popover:{content:overDeliveryMessage(), html:true}" class="badge badge-overdelivered">Project targets over-delivered</span></p>
    </div>
    <g:if test="${isGrantManager || fc.userIsAlaOrFcAdmin()}">

    <span class="btn-group">
        <button type="button" data-bind="disable:overDeliveryCheckInProgress,click:approveReport" class="btn btn-sm me-1 btn-success"><i
                class="fa fa-check icon-white"></i> Confirm</button>
        <button type="button" data-bind="click:rejectReport" class="btn btn-sm btn-danger"><i
                class="fa fa-remove icon-white"></i> More Information Required</button>
    </span>
    </p>
</g:if>
</script>
<script id="cancelled" type="text/html">
    <p><span class="badge p-1 text-white text-bg-danger">Report not required
    </span><fc:iconHelp dynamic-help="cancelledCommentText"></fc:iconHelp></p>
    <g:if test="${fc.userIsAlaOrFcAdmin()}">
        <div class="mt-2" data-bind="visible:!hasData()">
            <p>
                <button type="button" data-bind="click:unCancelReport" class="btn btn-success btn-sm"><i class="fa fa-remove icon-white"></i> Require report</button>
            </p>
        </div>
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
        <g:if test="${!hideDueDate}">
            <th class="report-due">
                Date Due <fc:iconHelp>This is the date your report is due. You must submit your report by this date.</fc:iconHelp>
            </th>
        </g:if>
        <th class="report-start">
            Period start <fc:iconHelp>Each report covers your activities that were conducted between the 'Period start' date and the 'Period end' date of that report</fc:iconHelp>
        </th>
        <th class="report-end">Period end <fc:iconHelp>Each report covers your activities that were conducted between the 'Period start' date and the 'Period end' date of that report</fc:iconHelp></th>
        <th class="report-status">Status <fc:iconHelp html="html">Reports cannot be submitted until after the end of the reporting period. <br/> Reports must be marked as complete before they can be submitted. </fc:iconHelp></th>
    </tr>

    </thead>
    <tbody data-bind="foreach:{ data:filteredReports, as:'report', afterAdd: attachHelp}">

    <tr>
        <td class="report-actions">
            <a class="btn btn-container btn-sm" data-bind="attr:{href:editUrl}, visible:editable"><i
                    class="fa fa-edit" title="Complete this report"></i></a>

            <a class="btn btn-container btn-sm disabled-icon" data-bind="visible:!editable">
            <i class="fa fa-edit" title="Submitted or approved reports cannot be edited"></i>
            </a>

            <a class="btn btn-container btn-sm" data-bind="attr:{href:viewUrl}, visible:viewable"><i
                    class="fa fa-eye" title="View this report"></i></a>

            <a class="btn btn-container btn-sm disabled-icon" data-bind="visible:!viewable">
                <i class="fa fa-eye" title="Please mark the report as complete before viewing it"></i>
            </a>

            <a target="print-report" class="btn btn-container btn-sm"
                    data-bind="attr:{href:downloadUrl}, visible:viewable"><i
                    class="fa fa-download" title="Display a printable version of this report"></i></a>
            <a class="btn btn-container btn-sm disabled-icon" data-bind="visible:!viewable">
                <i class="fa fa-download" title="Please mark the report as complete before generating a PDF"></i>
            </a>
            <a href="#" class="btn btn-container btn-sm" data-bind="visible:!historyVisible(), click:toggleHistory"><i class="fa fa-plus" title="Show report history"></i></a>
            <a href="#" class="btn btn-container btn-sm" data-bind="visible:historyVisible(), click:toggleHistory"><i class="fa fa-minus" title="Hide report history"></i></a>

            <g:if test="${fc.userIsAlaOrFcAdmin()}">
                <a class="btn btn-container btn-sm pull-right" href="javascript:void(0)" title="Delete all data entered for this report"
                   data-bind="visible:canReset, click:resetReport"><i class="fa fa-remove" style="color:red;"></i>
                </a>

            </g:if>

        </td>
        <td class="report-name"><a data-bind="visible:editable, attr:{href:editUrl, title:title}" title="Complete this report"><span
                data-bind="text:description"></span></a>
            <span data-bind="visible:!editable, text:description"></span>
        </td>
        <g:if test="${!hideDueDate}">
            <td class="report-due">
                <p><span data-bind="text:dueDate.formattedDate"></span></p>
                <g:if test="${isGrantManager || fc.userIsAlaOrFcAdmin()}">
                    <p>
                    <a href="#" class="btn btn-warning btn-sm edit-due-date" data-bind="visible:canEditDueDate, click:editDueDate">Edit due date</a>
                    </p>
                </g:if>
            </td>
        </g:if>
        <td class="report-start" data-bind="text:fromDate.formattedDate"></td>
        <td class="report-end" data-bind="text:toDateLabel"></td>

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

<script type="text/html" id="edit-due-date-modal-template">
    <div class="modal validationEngineContainer" id="edit-due-date-modal" role="dialog" tabindex="-1">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit due date</h3>
                </div>
                <div class="modal-body">
                    <p>Change the date the report <b><span data-bind="text:reportName"></span></b> is due.</p>

                    <label class="form-label" for="report-due-date">Date due</label>
                    <fc:datePicker type="text" bs4="true" class="form-control" id="report-due-date" name="reportDueDate"
                                   data-bind="datepicker:dueDate.date" targetField="" required="true" autocomplete="off"/>

                    <div class="alert alert-danger mt-2" data-bind="visible:error">
                        <span data-bind="text:error"></span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-sm btn-primary" data-bind="click:save, disable:saving">Save</button>
                    <button type="button" class="btn btn-sm btn-danger" data-bind="click:cancel">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</script>

<asset:script type="text/javascript">

    $(function() {
        var reports = <fc:modelAsJavascript model="${reports ?: []}"/>;
    var addHocReportTypes = <fc:modelAsJavascript model="${adHocReportTypes}"/>;
    var reportOwner = fcConfig.reportOwner;
    var order = <fc:modelAsJavascript model="${reportOrder}"/>;
    var config = _.extend(fcConfig, {adjustmentInstructionsSelector:'#adjustment-instructions'});
    ko.applyBindings(new CategorisedReportsViewModel(reports, order, addHocReportTypes, reportOwner, config), document.getElementById('reporting-content'));
});
</asset:script>
