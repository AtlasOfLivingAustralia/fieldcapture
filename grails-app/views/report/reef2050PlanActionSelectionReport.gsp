<html>
<head>
    <title>Reef 2050 Action Status</title>
    <title></title>
    <asset:stylesheet src="reef2050DashboardReport.css"/>
</head>

<body>

<div id="reef-2050-reports">
<g:if test="${flash.error || error}">
    <g:set var="error" value="${flash.error ?: error}"/>
    <div class="row-fluid">
        <div class="alert alert-error large-space-before">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error}</span>
        </div>
    </div>
</g:if>
<g:else>

<h3>Reef 2050 Plan Action Reporting</h3>

    <div class="report-selector">
        <select data-bind="options:reportPeriods, optionsText:'label', value:selectedPeriod"></select>
    </div>

    <div id="reportContents">

    </div>

</g:else>


</div>

<script type="text/javascript">
    var reportConfig = ${reportConfig as grails.converters.JSON};
    var reportUrl = '${g.createLink(controller:'report', action:'reef2050PlanActionReportContents')}';
    var options = {
        reportUrl: reportUrl,
        contentSelector: '#reportContents',
        dataTableSelector: 'table.action-table'
    };
    ko.applyBindings(new Reef2050ReportSelectorViewModel(reportConfig, options), document.getElementById('reef-2050-reports'));

</script>
</body>
</html>