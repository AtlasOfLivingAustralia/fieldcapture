var Reef2050ReportSelectorViewModel = function(reports, options) {
    var self = this;

    var defaults = {
        reportUrl: fcConfig.reef2050PlanReportUrl,
        contentSelector: '#reportContents',
        dataTableSelector: 'table.action-table'
    };

    var config = _.defaults(options, defaults);

    self.reportPeriods = reports;

    self.selectedPeriod = ko.observable(self.reportPeriods[0]);

    self.selectedPeriod.subscribe(function(period) {
        var reportUrl = config.reportUrl;
        $.get(reportUrl, {periodEnd:period.periodEnd, type:period.type}).done(function(result) {
            $(config.contentSelector).html(result);

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

};