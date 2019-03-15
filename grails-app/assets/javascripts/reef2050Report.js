/**
 * This view model controls the behaviour of the two places where a Reef 2050 Plan Action Report can be selected:
 * * the project explorer dashboard and the administrator reports page.
 * The behaviour of these two places is slightly different.
 * @param reports the list of available reef 2050 reports
 * @param options controls the behaviour of this view model.
 * @constructor
 */
var Reef2050ReportSelectorViewModel = function(reports, options) {
    var self = this;

    var defaults = {
        reportUrl: fcConfig.reef2050PlanReportUrl,
        contentSelector: '#reportContents',
        dataTableSelector: 'table.action-table',
        showReportInline: true,
        loadingSelector: '.reef-report-loading'
    };

    var config = _.defaults(options, defaults);

    self.reportPeriods = reports;

    self.selectedPeriod = ko.observable();
    self.approvedReportsOnly = ko.observable(true);
    self.format = ko.observable("html");
    self.formatOptions = ["html", "pdf"];

    self.inline = ko.observable(options.showReportInline);


    if (options.showReportInline) {
        self.selectedPeriod.subscribe(function(period) {

            $(config.contentSelector).hide();
            $(config.loadingSelector).show();

            var reportUrl = config.reportUrl;
            $.get(reportUrl, {periodEnd:period.periodEnd, type:period.type}).done(function(result) {
                $(config.loadingSelector).hide();
                $(config.contentSelector).html(result).show();


                if (period.type != 'settingsText') {
                    $.fn.dataTableExt.oStdClasses.sPageButtonActive = "currentStep";
                    $.fn.dataTableExt.oStdClasses.sPaging = "pagination ";

                    $(config.dataTableSelector).dataTable({
                        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
                        "columnDefs": [{
                            "orderData": 1, "targets": 0
                        }],
                        "autoWidth":false,
                        "scrollX":false
                    });
                }
            });
        });
    }
    else {
        self.go = function() {
            var url = options.reportUrl;
            var period = self.selectedPeriod();
            url += "?periodEnd="+period.periodEnd+"&type="+period.type+"&format="+self.format()+"&approvedReportsOnly="+self.approvedReportsOnly();
            window.open(url, "reef2050PlanActionReport");
        };
    }

    self.selectedPeriod(self.reportPeriods[0]);

};