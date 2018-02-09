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
    <div class="span2">
        <strong>All Data:</strong>
    </div>

    <div class="span6">
        <a class="btn"
           href="${g.createLink(controller: 'report', action: 'reef2050PlanActionReportPreview', params: [approvedOnly: false])}">Reef 2050 Plan Action Report</a>
        <span> </span>
        <a class="btn"
           href="${g.createLink(controller: 'report', action: 'reef2050PlanActionReportPDF', params: [approvedOnly: false])}">Reef 2050 Plan Action Report as PDF</a>
    </div>

</div>

<div>
    <div class="span2">
        <strong>Approved data only:</strong>
    </div>

    <div class="span6">
        <a class="btn"
           href="${g.createLink(controller: 'report', action: 'reef2050PlanActionReportPreview')}">Reef 2050 Plan Action Report</a>

        <span> </span>
        <a class="btn"
           href="${g.createLink(controller: 'report', action: 'reef2050PlanActionReportPDF')}">Reef 2050 Plan Action Report as PDF</a>
    </div>

</div>

<g:render template="/shared/dashboard"/>

<asset:javascript src="common.js"/>
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

    });

</script>
</body>
</html>