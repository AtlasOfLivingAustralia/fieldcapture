function ManagementUnitReportSelectorViewModel() {
    var self = this;
    var now = convertToSimpleDate(new Date());
    var d = new Date();
    d.setFullYear(2018, 6, 1);
    self.fromDate = ko.observable(d).extend({simpleDate:false});
    self.toDate = ko.observable(now).extend({simpleDate:false});

    self.muReportDownloadSummary = function() {
        var summaryFlag = true;
        generateMuReport(summaryFlag);
    };

    self.muReportDownload = function () {
        generateMuReport();
    };

    function generateMuReport(summaryFlag = false) {
        var selectPeriod = $('select#reportPeriodOfManagementUnit').val()
        var fromDate = $('#fromDate').val()
        var toDate = $('#toDate').val()
        $.get(fcConfig.generateMUReportInPeriodUrl, {selectPeriod:selectPeriod, fromDate:fromDate, toDate:toDate, summaryFlag: summaryFlag})
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
    }

}