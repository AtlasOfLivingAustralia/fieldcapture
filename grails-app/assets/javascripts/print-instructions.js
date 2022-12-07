/** Simple view model that binds to the HTML in the /shared/_pdfInstructions.gsp template */
var printInstructionsVM = function(viewSelector) {
    var self = this;

    self.print = function() {
        $(viewSelector).on('hidden.bs.modal', function() {
            window.print();
        }).modal('hide');
    };

    var dontShowAgainKey = 'dont-show-print-instructions';
    var dontShowAgainFromStorage = amplify.store(dontShowAgainKey);
    self.dontShowAgain = ko.observable(dontShowAgainFromStorage);

    self.dontShowAgain.subscribe(function(hide) {
        amplify.store(dontShowAgainKey, hide);
    });

    if (!dontShowAgainFromStorage) {
        $(viewSelector).modal();
    }
};