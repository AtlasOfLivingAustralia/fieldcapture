//= require wms
//= require mapWithFeatures.js
//= require forms-knockout-bindings.js
//= require reef2050Report.js
//= require components.js

var DatePickerModel = function(fromDate, toDate, urlWithoutDates, $location) {
    var formatString = 'YYYY-MM-DD';
    var self = this;
    var date = moment('2011-07-01T00:00:00+10:00');
    var end = moment();

    self.ranges = [{display:'select date range', from:undefined, to:undefined}];
    while (date.isBefore(end)) {
        var rangeEnd = moment(date).add(6, 'months');
        self.ranges.push({from:date.format(formatString), to:rangeEnd.format(formatString), display:date.format("MMM YYYY")+' - '+rangeEnd.format("MMM YYYY")});

        date = rangeEnd;
    }
    self.selectedRange = ko.observable();
    self.fromDate = ko.observable().extend({simpleDate:false});
    if (fromDate) {
        self.fromDate(moment(fromDate).format());
    }
    self.toDate = ko.observable().extend({simpleDate:false});
    if (toDate) {
        self.toDate(moment(toDate).format());
    }

    self.clearDates = function() {
        if (!urlWithoutDates) {
            urlWithoutDates = '?';
        }
        $location.href = urlWithoutDates;
    };

    var validateAndReload = function(newFromDate, newToDate) {

        var formattedFromDate = moment(fromDate).format(fromDate);
        var formattedToDate = moment(toDate).format(toDate);
        var formattedNewFromDate = moment(newFromDate).format(formatString);
        var formattedNewToDate = moment(newToDate).format(formatString);

        if (formattedNewFromDate == formattedFromDate && formattedNewToDate == formattedToDate) {
            return;
        }

        if ($('#facet-dates').validationEngine('validate')) {
            reloadWithDates(newFromDate, newToDate);
        }
    }

    var reloadWithDates = function(newFromDate, newToDate) {
        var parsedNewFromDate = moment(newFromDate);
        var parsedNewToDate = moment(newToDate);
        if (newFromDate && parsedNewFromDate.isValid()) {
            urlWithoutDates += urlWithoutDates?'&':'?';
            urlWithoutDates += 'fromDate='+moment(newFromDate).format(formatString);
        }
        if (newToDate && parsedNewToDate.isValid()) {
            urlWithoutDates += urlWithoutDates?'&':'?';
            urlWithoutDates += 'toDate='+moment(newToDate).format(formatString);
        }
        $location.href = urlWithoutDates;
    }

    self.fromDate.subscribe(function(a, b) {
        validateAndReload(self.fromDate(), self.toDate());
    });
    self.toDate.subscribe(function(toDate) {
        validateAndReload(self.fromDate(), self.toDate());
    });

    self.selectedRange.subscribe(function(value) {

        if (value.from) {
            reloadWithDates(value.from, value.to);
        }

    });
};

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
