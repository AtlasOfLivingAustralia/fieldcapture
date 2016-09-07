<!doctype html>
<html>
<head>
    <meta name="layout" content="adminLayout"/>
    <title>Admin Reports | Admin | Data capture | Atlas of Living Australia</title>
    <r:require modules="knockout,jqueryValidationEngine,wmd"/>
    <r:script disposition="head">
        fcConfig = {
            performanceComparisonReportUrl: "${g.createLink(controller: 'report', action: 'performanceAssessmentComparisonReport')}",
            dashboardUrl: "${g.createLink(controller: 'report', action: 'loadReport')}",
            organisationDataDownloadUrl: "${g.createLink(controller:'search', action:'downloadOrganisationData')}"


        }
    </r:script>
    <g:set var="here" value="${g.createLink(action:'editSiteBlog')}"/>
</head>

<body>
<h3>Administrator Reports</h3>

<h4>Organisation data download: </h4>

<a id="orgDataDownload" class="btn" href="#">Download Organisation Report Data</a>


<g:render template="/shared/dashboard" plugin="fieldcapture-plugin"/>

</body>
<r:script>
    $(function() {
        var SELECTED_REPORT_KEY = 'selectedAdminReport';
        var selectedReport = amplify.store(SELECTED_REPORT_KEY);
        var $dashboardType = $('#dashboardType');
        if (!$dashboardType.find('option[value='+selectedReport+']')[0]) {
            selectedReport = 'performanceAssessmentComparison';
        }
        $dashboardType.val(selectedReport);
        $dashboardType.change(function(e) {
            var $content = $('#dashboard-content');
            var $loading = $('.loading-message');
            $content.hide();
            $loading.show();

            var reportType = $dashboardType.val();

            $.get(fcConfig.dashboardUrl, {report:reportType}).done(function(data) {
                $content.html(data);
                $loading.hide();
                $content.show();
                $('#dashboard-content .helphover').popover({animation: true, trigger:'hover', container:'body'});
                amplify.store(SELECTED_REPORT_KEY, reportType);
            });

        }).trigger('change');

        $('#orgDataDownload').click(function() {
            $.get(fcConfig.organisationDataDownloadUrl).done(function(data) {
               bootbox.alert("Your download will be emailed to you when it is complete.");
            });
        });

    });

</r:script>
</html>