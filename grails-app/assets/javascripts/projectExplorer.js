//= require datatables/1.10.13/datatables.1.10.13.min.js
//= require datatables/buttons/1.2.4/buttons.html5.min.js
//= require datatables/buttons/1.2.4/datatables.buttons.min.js
//= require wms
//= require mapWithFeatures.js
//= require forms-knockout-bindings.js
//= require reef2050Report.js
//= require components.js

var DownloadViewModel = function(options) {
    var defaults = {
        downloadButtonSelector: '#downloadXlsxButton',
        downloadTabsSelector: '#downloadTabSelection'
    };
    var config = _.defaults(options, defaults);
    var self = this;
    var disabled = false;

    var downloadButton = $(config.downloadButtonSelector);
    var failureMessage = "There was an error submitting your download request.  Please try again after logging out and then back in.  If this doesn't work, please contact support";
    var successMessage = "The download may take several minutes to complete.  Once it is complete, an email will be sent to your registered email address.";
    self.downloadXlsx = function() {
        if (!disabled) {
            disabled = true;
            downloadButton.prop('disabled', true);
            var downloadTabs = $(config.downloadTabsSelector);
            $.post(config.downloadXlsxUrl,  downloadTabs.serializeArray())
            .done(function(data,status, xhr) {
                var responseType = xhr.getResponseHeader("Content-Type");

                // If the user isn't logged in, the request will be redirected because of the CAS filter
                // or preAuthorize annotation but the response code will still be 200.  Hence we are checking the
                // Content-Type of the response to determine whether it worked.
                var message = responseType.indexOf("json") >= 0 ? successMessage : failureMessage;
                bootbox.alert(message);

            }).fail(function() {
                bootbox.alert(failureMessage);
            }).always(function() {
                downloadButton.prop('disabled', false);
                disabled = false;
            });
        }
    }
};
