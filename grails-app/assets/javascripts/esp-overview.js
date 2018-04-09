//= require thumbnail.scroller/2.0.3/jquery.mThumbnailScroller.js
//= require jquery.columnizer/jquery.columnizer.js
//= require jquery.fileDownload/jQuery.fileDownload
//= require meriplan.js
//= require risks.js
//= require sites.js
//= require activity.js
//= require projectActivityPlan.js
//= require projectActivity.js
//= require enterActivityData.js
//= require keydragzoom/keydragzoom.js
//= require_self

var SiteStatusModel = function(site, currentStage, map, sitesViewModel) {
    var self = this;
    self.name = site.name;

    var incompleteActivities = _.filter(currentStage.activities, function(activity) {
        return activity.siteId == site.siteId && !activity.isComplete();
    });
    self.reportingComplete = incompleteActivities.length == 0;
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
    var activity = incompleteActivities.length >= 0 ? incompleteActivities[0] : null;
    if (!activity) {
        activity = _.find(currentStage.activities, function(activity) {
            return activity.siteId == site.siteId;
        });
    }
    var siteInfoWindow = new google.maps.InfoWindow({content:getSiteInfoHtml(), position:calculateInfoWindowPosition(bounds)});

    var features = map.featureIndex[site.siteId];
    if (_.isArray(features)) {

        _.each(features, function(feature) {
            feature.setOptions(featureDisplayOptions);

            google.maps.event.clearInstanceListeners(feature);

            google.maps.event.addListener(feature, 'mouseover', function (event) {
                siteInfoWindow.open(map.map, feature);
                _.each(features, function(feature) {
                    feature.setOptions({fillOpacity: 0.8});

                });
            });
            google.maps.event.addListener(feature, 'mouseout', function (event) {
                _.each(features, function(feature) {
                    feature.setOptions({fillOpacity: 0.3});
                });
                siteInfoWindow.close();
            });

            if (activity) {
                google.maps.event.addListener(feature, 'click', function(event) {
                    window.location.href = activity.editActivityUrl();
                });
            }
        });
    }

};

var SimplifiedReportingViewModel = function(project, config) {
    var self = this;

    var reportsViewModel = new ProjectReportsViewModel(project);
    var planViewModel = new PlanViewModel(project.activities, project.reports, [], {}, project, null, config, true, false);
    var currentReport = reportsViewModel.currentReport;

    var currentStage = _.find(planViewModel.stages, function(stage) {
        return stage.toDate == currentReport.toDate;
    });


    var OPTIONAL_REPORT_TYPE = config.sightingsActivityType || 'ESP Species';
    var ADMIN_REPORT_TYPE = config.adminActivityType || 'ESP Overview';
    function isAdminActivity(activity) {
        return activity.type == ADMIN_REPORT_TYPE;
    }
    function isOptionalReport(activity) {
        return activity.type == OPTIONAL_REPORT_TYPE;
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

    self.administrativeReport = _.find(currentStage.activities, function(activity) {
        return isAdminActivity(activity);
    });

    self.optionalReport = _.find(currentStage.activities, function(activity) {
        return isOptionalReport(activity);
    });

    self.siteReports = function() {
        return _.filter(currentStage.activities, function(activity) {
            return !isAdminActivity(activity) && !isOptionalReport(activity);
        })
    };

    self.currentStage = currentStage;
    self.currentReport = currentReport;
    self.adminReportingHelp = ko.pureComputed(function() {
        if (self.finishedAdminReporting) {
            return "You have completed your administrative reporting requirements for this year"
        }
        return "Complete and save the form below to finish your reporting for this year.";
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

    self.canViewSubmissionReport = function() {
        return _.every(currentStage.activities, function(activity) {
            return isAdminActivity(activity) || activity.progress() == 'finished';
        });
    };

    self.submitReport = function() {
        ecodata.forms[self.administrativeReport.activityId].save(function(valid, data) {
            if (valid && data && !data.error) {
                currentStage.submitReport();
            }

        });
    };

};

initialiseESPActivity = function(activity) {
    var master = ecodata.forms[activity.activityId];
    if (master) {
        var activityData = {
            activityId:activity.activityId,
            startDate:activity.plannedStartDate,
            endDate:activity.plannedEndDate,
            progress:'finished'
        };

        master.register('activityModel', function() { return activityData; }, function() { return true }, function(){}, false);

    }


};

initialisePhotos = function(photoPointSelector, photosSelector) {

    loadAndConfigureSitePhotoPoints(photoPointSelector);
    $(photosSelector).mThumbnailScroller({});
    $(photosSelector + ' .fancybox').fancybox();
}