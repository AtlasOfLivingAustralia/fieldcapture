var SiteStatusModel = function(site, currentStage, map, sitesViewModel) {
    var self = this;
    self.name = site.name;

    var incompleteActivities = _.filter(currentStage.activities, function(activity) {
        return activity.siteId == site.siteId && !activity.isComplete();
    });
    self.reportingComplete = incompleteActivities.length == 0;

    // No support currently for multipolygons
    var feature = map.featureIndex[site.siteId] && map.featureIndex[site.siteId][0];

    var bounds = sitesViewModel.getSiteBounds(site.siteId);

    /**
     * Calculates a position for the info window located in the top middle of the sites bounds.
     * @param bounds a LatLngBounds object containing the bounds of the site.
     * @return a lat lng literal representing the top middle of the sites bounds.
     */
    function calculateInfoWindowPosition(bounds) {
        var east = bounds.getNorthEast().lng();
        var west = bounds.getSouthWest().lng();
        var middle = west + (east - west)/2;
        return {lat:bounds.getNorthEast().lat(), lng:middle};
    };

    function getSiteInfoHtml() {
        var siteInfoTemplate = document.getElementById('info-window-template');
        ko.applyBindings(self, siteInfoTemplate);
        var siteInfoHtml = siteInfoTemplate.innerHTML;
        ko.cleanNode(siteInfoTemplate);
        return siteInfoHtml;
    }

    var featureDisplayOptions = {strokeColor:'#BB4411',fillColor:'#BB4411',fillOpacity:0.3,strokeWeight:1,zIndex:1,editable:false};
    if (self.reportingComplete) {
        featureDisplayOptions = {strokeColor:'green',fillColor:'green',fillOpacity:0.3,strokeWeight:1,zIndex:1,editable:false};
    }
    feature.setOptions(featureDisplayOptions);

    google.maps.event.clearInstanceListeners(feature);
    var siteInfoWindow = new google.maps.InfoWindow({content:getSiteInfoHtml(), position:calculateInfoWindowPosition(bounds)});

    google.maps.event.addListener(feature, 'mouseover', function (event) {
        siteInfoWindow.open(map.map, feature);
    });
    google.maps.event.addListener(feature, 'mouseout', function (event) {
        siteInfoWindow.close();
    });


    var activity = incompleteActivities.length >= 0 ? incompleteActivities[0] : null;
    if (!activity) {
        activity = _.find(currentStage.activities, function(activity) {
            return activity.siteId == site.siteId;
        });
    }
    if (activity) {
        google.maps.event.addListener(feature, 'click', function(event) {
            window.location.href = activity.editActivityUrl();
        });
    }
};

var SimplifiedReportingViewModel = function(currentStage, currentReport) {
    var self = this;

    function isAdminActivity(activity) {
        return !activity.siteId;
    }
    self.finishedReporting = currentStage.canSubmitReport();
    self.finishedAdminReporting = _.every(currentStage.activities, function(activity) {
        return !isAdminActivity(activity) || activity.isComplete();
    });
    self.finishedActivityReporting = _.every(currentStage.activities, function(activity) {
        return isAdminActivity(activity) || activity.isComplete();
    });

    self.hasAdministrativeReports = _.some(currentStage.activities, function(activity) {
        return isAdminActivity(activity);
    });

    self.currentStage = currentStage;
    self.currentReport = currentReport;
    self.adminReportingHelp = ko.pureComputed(function() {
        if (self.finishedAdminReporting) {
            return "You have completed your administrive reporting requirements for this year"
        }
        return "Press the 'Administrative Reporting' button in the 'Actions:' section below to complete your administrative reporting.";
    });
    self.activityReportingHelp = ko.pureComputed(function() {
        if (self.finishedActivityReporting) {
            return "You have completed your site based reporting requirements for this period"
        }
        return "Click on a site to update your progress on the site.  When you have finished data entry for the year, please ensure the 'finished' checkbox on each reporting form is ticked.";
    });
    self.submitReportHelp = ko.pureComputed(function() {
        if (self.currentReport.isSubmitted() || self.currentReport.isApproved()) {
            return "You have submitted your report for this year"
        }
        else if (!self.currentStage.isReportable) {
            return "Your report can't be submitted until "+convertToSimpleDate(currentStage.toDateLabel, false);
        }
        else if (self.currentStage.canSubmitReport()) {
            return "Press the 'Submit reports for approval' button the 'Actions:' section below to submit your report to your grant manager."
        }
        return "Your site and administrative reports need to be marked as 'Finished' before you can submit your report.  You can mark a report as finished by opening the report and checking the 'Finished' button at the bottom of the page.";
    });
    self.approveReportHelp = ko.pureComputed(function() {
        return "Once your reports are submitted, your grant manager will review and approve them or return them to you with comments for further work."
    });

    self.canSubmitReport = ko.pureComputed(function() {
        return self.currentReport.isReportable && self.currentReport.canSubmitReport();
    });

    self.administrativeReporting = function() {
        var nextActivity = _.find(currentStage.activities, function(activity) {
            return isAdminActivity(activity) && !activity.isComplete();
        });
        // Default the form to finished.
        if (nextActivity.progress() == ActivityProgress.finished) {
            document.location.href = nextActivity.editActivityUrl();
        }
        else {
            // This will set the progress and open the form.
            nextActivity.progress(ActivityProgress.finished);
        }
    };

    self.administrativeReportButtonHelp = ko.pureComputed(function() {
        if (currentStage.isReadOnly()) {
            return "Once your reports have been submitted or approved they can no longer be edited.";
        }
        else {
            return "Click to complete your administrative reporting for the year."
        }
    });

};