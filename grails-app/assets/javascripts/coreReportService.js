/**
 * @param options mostly URLs to access server functions.
 */
function CoreReportService(options) {
    var self = this;
    self.regenerateReports = function(data,url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType:'json',
            contentType: 'application/json'
        }).done(function() {
            document.location.reload();
        }).fail(function() {
            bootbox.alert("Failed to regenerate organisation reports");
            $.unblockUI();
        });

    };
};
