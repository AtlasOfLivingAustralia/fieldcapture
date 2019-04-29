<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Admin Reports | Admin | Data capture | Atlas of Living Australia</title>
    <script>
        fcConfig = {
            performanceComparisonReportUrl: "${g.createLink(controller: 'report', action: 'performanceAssessmentComparisonReport')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport')}",
            organisationDataDownloadUrl: "${g.createLink(controller:'search', action:'downloadOrganisationData')}",
            userDownloadUrl: "${g.createLink(controller:'search', action:'downloadUserData')}"

        }
    </script>
    <asset:stylesheet src="common.css"/>
    <g:set var="here" value="${g.createLink(action: 'editSiteBlog')}"/>
</head>

<body>
<h3>Administrator Reports</h3>

<h4>Organisation data download:</h4>

<a id="orgDataDownload" class="btn" href="#">Download Organisation Report Data</a>

<h4>User Report</h4>

<a id="userDownload" class="btn">Download MERIT User List</a>

<h4>Reef 2050 Plan Action Report</h4>

<div class="row-fluid">
    <p>Configure the report options below then press View Report to open the report in a new tab</p>
    <form id="reef-report-selector" class="report-selector form-horizontal">
        <div class="control-group">
            <label class="control-label">Select period: </label>
            <div class="controls">
                <select data-bind="options:reportPeriods, optionsText:'label', value:selectedPeriod" class="input-xlarge"></select>
            </div>

        </div>
        <div class="control-group">
            <label class="control-label">Report format:</label>
            <div class="controls">
                <select classs="controls" data-bind="options:formatOptions, value:format"></select>
            </div>
        </div>
        <div class="control-group">

            <div class="controls">
                <input class="checkbox" type="checkbox" data-bind="checked:approvedActivitiesOnly"> Approved reports only?
            </div>
        </div>

        <div class="control-group">
            <div class="controls">
            <button class="btn btn-success" data-bind="click:go">View Report</button>
            </div>
        </div>

    </form>

</div>

<g:render template="/shared/dashboard"/>

<asset:javascript src="common.js"/>
<asset:javascript src="reef2050Report.js"/>
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

        var reportConfig = ${reef2050Reports as grails.converters.JSON};
        var reportUrl = '${g.createLink(controller:'report', action:'reef2050PlanActionReport')}';
        var options = {
            reportUrl: reportUrl,
            showReportInline: false
        };
        ko.applyBindings(new Reef2050ReportSelectorViewModel(reportConfig, options), document.getElementById('reef-report-selector'));

    });

</script>
</body>
</html>