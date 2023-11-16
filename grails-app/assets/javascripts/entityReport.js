function EntityReportSelectorViewModel(options) {
    var self = this;
    var config = _.defaults(options);

    var now = convertToSimpleDate(new Date());
    var d = new Date();
    d.setFullYear(2018, 6, 1);
    self.fromDate = ko.observable(d).extend({simpleDate:false});
    self.toDate = ko.observable(now).extend({simpleDate:false});

    self.entityReportDownload = function () {
        var summaryFlag = false;
        return generateEntityReport(summaryFlag)
    };

    self.entityReportDownloadSummary = function() {
        var summaryFlag = true;
        generateEntityReport(summaryFlag);
    };

    function generateEntityReport(summaryFlag) {
        var json = {fromDate:self.fromDate(), toDate:self.toDate(), summaryFlag: summaryFlag}
        return $.ajax({
            url: config.generateEntityReportInPeriodUrl,
            type: 'GET',
            data: json,
            dataType:'json',
            contentType: 'application/json'
        }).done(function(data) {
            if (!data || data.error){
                bootbox.alert(data.error)
            }else{
                var details = data['details']
                var message = data['message']
                var detailsIcon = ' <i class="fa fa-info-circle showDownloadDetailsIcon" data-toggle="collapse" href="#downloadDetails"></i>'
                var detailsPanel = '<div class="collapse" id="downloadDetails"><a id="entityReportDownloadLink" href='+config.downloadUrl +'/' + details+'>Try this link, if you cannot get an email confirmation</a></div>'
                bootbox.alert(message + detailsIcon + detailsPanel)
            }
        }).fail(function() {
            bootbox.alert("Save failed");
        });
    }

}