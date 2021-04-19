<div id="reef-2050-reports">
<g:if test="${flash.error || error}">
    <g:set var="error" value="${flash.error ?: error}"/>
    <div class="row">
        <div class="alert alert-danger large-space-before">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span>Error: ${error}</span>
        </div>
    </div>
</g:if>
<g:else>

<h3>Reef 2050 Plan Action Reporting</h3>

    <form class="report-selector form-inline">
        <div class="input-group">
            <label class="control-label" for="selectPeriod">Selected period:   </label>  <select id="selectPeriod" data-bind="options:reportPeriods, optionsText:'label', value:selectedPeriod" class="form-control form-control-sm ml-1 br-2"></select>
        </div>

    </form>

    <div id="reportContents">

    </div>

    <div class="reef-report-loading">
        <asset:image dir="images" src="loading.gif" alt="saving icon"/> Loading...
    </div>

</g:else>


</div>

<script type="text/javascript">
    var reportConfig = ${reportConfig as grails.converters.JSON};
    var reportUrl = '${g.createLink(controller:'report', action:'reef2050PlanActionReportContents')}';
    var options = {
        reportUrl: reportUrl,
        contentSelector: '#reportContents',
        dataTableSelector: 'table.actions'
    };
    <g:if test="${approvedActivitiesOnly != null}">
    options.approvedActivitiesOnly = ${approvedActivitiesOnly};
    </g:if>
    var viewModel = new Reef2050ReportSelectorViewModel(reportConfig, options);
    ko.applyBindings(viewModel, document.getElementById('reef-2050-reports'));


</script>
