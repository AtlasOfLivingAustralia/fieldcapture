<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Admin Reports | Admin | MERIT</title>
    <script>
        fcConfig = {
            performanceComparisonReportUrl: "${g.createLink(controller: 'report', action: 'performanceAssessmentComparisonReport')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport')}",
            organisationDataDownloadUrl: "${g.createLink(controller:'search', action:'downloadOrganisationData')}",
            userDownloadUrl: "${g.createLink(controller:'search', action:'downloadUserData')}",
            muReportDownloadUrl: "${g.createLink(controller:"download",action:"get")}"
        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <g:set var="here" value="${g.createLink(action: 'editSiteBlog')}"/>
</head>

<body>
<h3>Administrator Reports</h3>
<content tag="pageTitle">Administrator Reports</content>

<h4>Performance Management Framework data download</h4>

<a id="orgDataDownload" class="btn btn-sm" href="#">Download Performance Management Framework data</a>

<h4>Management unit report download:</h4>
<form id="mu-report-selector">
    <label class="control-label">Select reporting period: </label>
    <div class="row mb-2">
        <div class="col-sm-2 pl-0 pr-1">
            <label for="fromDate">Start date</label>
            <div class="input-group input-append">
                <fc:datePicker targetField="fromDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="muFromDate"  data-validation-engine="validate[date]"  size="form-control form-control-sm dateControl" autocomplete="off"/>
            </div>
        </div>
        <div class="col-sm-2 pl-0 pr-1">
            <label for="toDate">End date</label>
            <div class="input-group input-append">
                <fc:datePicker targetField="toDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="muToDate" data-validation-engine="validate[date]"  size="form-control form-control-sm dateControl" autocomplete="off"/>
            </div>
        </div>
    </div>
    <a id="muReportDownload" data-bind="click:entityReportDownload" class="btn btn-sm" href="#">Management Unit - Activities</a>
    <a id="muReportDownloadSummary" data-bind="click:entityReportDownloadSummary" class="btn btn-sm" href="#">Core Reports - Status</a>
</form>

<h4>Organisation report download:</h4>
<form id="org-report-selector">
    <label class="control-label">Select reporting period: </label>
    <div class="row mb-2">
        <div class="col-sm-2 pl-0 pr-1">
            <label for="orgFromDate">Start date</label>
            <div class="input-group input-append">
                <fc:datePicker targetField="fromDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="orgFromDate"  data-validation-engine="validate[date]"  size="form-control form-control-sm dateControl" autocomplete="off"/>
            </div>
        </div>
        <div class="col-sm-2 pl-0 pr-1">
            <label for="orgToDate">End date</label>
            <div class="input-group input-append">
                <fc:datePicker targetField="toDate.date" bs4="bs4" class="form-control form-control-sm dateControl" name="orgToDate" data-validation-engine="validate[date]"  size="form-control form-control-sm dateControl" autocomplete="off"/>
            </div>
        </div>
    </div>
    <a id="orgReportDownload" data-bind="click:entityReportDownload" class="btn btn-sm" href="#">Organisation - Activities</a>
    <a id="orgReportDownloadSummary" data-bind="click:entityReportDownloadSummary" class="btn btn-sm" href="#">RCS Reports - Status</a>
</form>


<h4>User Report</h4>

<button id="userDownload" class="btn btn-sm">Download MERIT User List</button>

<h4 class="mt-4">Reef 2050 Plan Action Report</h4>

<div class="row">
    <div class="col-sm-12">
        <p>Configure the report options below then press View Report to open the report in a new tab</p>
    </div>
    <form id="reef-report-selector" class="report-selector">
        <div class="form-group row">
            <div class="col-sm-1"></div>
            <label for="reportPeriods" class="col-sm-3 pl-2 m-0 control-label">Select period: </label>
            <div class="col-sm-4">
            <select id="reportPeriods" data-bind="options:reportPeriods, optionsText:'label', value:selectedPeriod" class="form-control form-control-sm input-medium"></select>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-1"></div>
            <label for="reportFormats" class="col-sm-3 pl-2 pr-2 m-0 control-label">Report format:</label>
            <div class="col-sm-8">
                <select id="reportFormats" class="form-control form-control-sm" data-bind="options:formatOptions, value:format"></select>
            </div>
        </div>
        <div class="form-group row">
            <div class="col-sm-4 mr-3"></div>
            <div class="controls">
                <input class="checkbox" type="checkbox" data-bind="checked:approvedActivitiesOnly"> Approved reports only?
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-4 mr-3"></div>
            <div class="controls">
            <button id="viewReportBtn" class="btn btn-sm btn-success" data-bind="click:go">View Report</button>
            </div>
        </div>
    </form>

</div>

<g:render template="/shared/dashboard"/>

<asset:javascript src="common-bs4.js"/>
<asset:javascript src="reef2050Report.js"/>
<asset:javascript src="entityReport.js"/>
<script>
    $(function () {
        var SELECTED_REPORT_KEY = 'selectedAdminReport';
        var selectedReport = amplify.store(SELECTED_REPORT_KEY);
        var $dashboardType = $('#dashboardType');
        if (!$dashboardType.find('option[value=' + selectedReport + ']')[0]) {
            selectedReport = 'performanceAssessmentComparison';
        }
        $dashboardType.val(selectedReport);
        $dashboardType.change(function (e) {
            var $content = $('#dashboard-content');
            var $loading = $('.loading-message');
            $content.hide();
            $loading.show();

            var reportType = $dashboardType.val();

            $.get(fcConfig.dashboardUrl, {report: reportType}).done(function (data) {
                $content.html(data);
                $loading.hide();
                $content.show();
                $('#dashboard-content .helphover').popover({animation: true, trigger: 'hover', container: 'body'});
                amplify.store(SELECTED_REPORT_KEY, reportType);
            });

        }).trigger('change');

        $('#orgDataDownload').click(function () {
            $.get(fcConfig.organisationDataDownloadUrl).done(function (data) {
                bootbox.alert("Your download will be emailed to you when it is complete.");
            });
        });

        $('#userDownload').click(function () {
            $.get(fcConfig.userDownloadUrl).done(function (data) {
                bootbox.alert("Your download will be emailed to you when it is complete.");
            });
        });


        var reportConfig = ${raw((reef2050Reports as grails.converters.JSON).toString())};
        var reportUrl = '${g.createLink(controller:'report', action:'reef2050PlanActionReport')}';
        var options = {
            reportUrl: reportUrl,
            showReportInline: false
        };
        ko.applyBindings(new Reef2050ReportSelectorViewModel(reportConfig, options), document.getElementById('reef-report-selector'));

    });

    var generateMUReportInPeriodUrl = "${g.createLink(controller:'report', action:'generateReportsInPeriod', params: [entity: 'managementUnit'])}";
    var optionsReport = {
        generateEntityReportInPeriodUrl: generateMUReportInPeriodUrl,
        downloadUrl: "${g.createLink(controller:"download",action:"get")}"
    };
    ko.applyBindings(new EntityReportSelectorViewModel(optionsReport), document.getElementById('mu-report-selector'));

    var optionsOrgReport = {
        generateEntityReportInPeriodUrl: "${g.createLink(controller:'report', action:'generateReportsInPeriod', params: [entity: 'organisation'])}",
        downloadUrl: "${g.createLink(controller:"download",action:"get")}",
        fromYear: 2023
    };
    ko.applyBindings(new EntityReportSelectorViewModel(optionsOrgReport), document.getElementById('org-report-selector'));


</script>
</body>
</html>
