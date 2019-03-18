

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

    <form class="report-selector form-inline">
        <div class="control-group">
            <label class="control-label">Selected period:   </label>  <select data-bind="options:reportPeriods, optionsText:'label', value:selectedPeriod" class="input-xlarge"></select></label>
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

    var viewModel = new Reef2050ReportSelectorViewModel(reportConfig, options);
    <g:if test="${approvedActivitiesOnly != null}">
        viewModel.approvedActivitiesOnly(${approvedActivitiesOnly});
    </g:if>
    ko.applyBindings(viewModel, document.getElementById('reef-2050-reports'));


</script>
