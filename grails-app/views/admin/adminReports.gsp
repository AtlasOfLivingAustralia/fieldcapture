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
            generateMUReportInPeriodUrl: "${g.createLink(controller:'managementUnit', action:'generateReportsInPeriod')}",
            muReportDownloadUrl: "${g.createLink(controller:"download",action:"get")}"

        }
    </script>
    <asset:stylesheet src="common-bs4.css"/>
    <g:set var="here" value="${g.createLink(action: 'editSiteBlog')}"/>
</head>

<body>
<h3>Administrator Reports</h3>
<content tag="pageTitle">Administrator Reports</content>

<h4>Organisation data download:</h4>

<a id="orgDataDownload" class="btn btn-sm" href="#">Download Organisation Report Data</a>

<h4>Management unit report download:</h4>
<div class="form-group">
    <label class="control-label">Select reporting period: </label>
    <div class="controls">
        <select id="reportPeriodOfManagementUnit" class="form-control form-control-sm input-medium">
            <g:each var="financialYear" in="${reportsPeriodsOfManagementUnit}">
                <option value="startDate=${financialYear}-07-01&endDate=${financialYear+1}-06-30">01 July ${financialYear} - 30 June ${financialYear+1} </option>
            </g:each>
        </select>
    </div>
</div>
<a id="muReportDownload" class="btn btn-sm" href="#">Download Management Unit Report</a>

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
            <button class="btn btn-sm btn-success" data-bind="click:go">View Report</button>
            </div>
        </div>

    </form>

</div>

<g:render template="/shared/dashboard"/>

<asset:javascript src="common-bs4.js"/>
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

        $('#muReportDownload').click(function () {
            var selectPeriod = $('select#reportPeriodOfManagementUnit').val()
            $.get(fcConfig.generateMUReportInPeriodUrl +"?" + selectPeriod)
                .done(function (data) {
                    if (data.error){
                        bootbox.alert(data.error)
                    }else{
                        var details = data['details']
                        var message = data['message']
                        var detailsIcon = ' <i class="fa fa-info-circle showDownloadDetailsIcon" data-toggle="collapse" href="#downloadDetails"></i>'
                        var detailsPanel = '<div class="collapse" id="downloadDetails"><a id="muReportDownloadLink" href='+fcConfig.muReportDownloadUrl +'/' + details+'>Try this link, if you cannot get an email confirmation</a></div>'
                        bootbox.alert(message + detailsIcon + detailsPanel)
                    }
                })
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
