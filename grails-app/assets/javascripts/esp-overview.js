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
//= require forms.js
//= require_self

var SiteStatusModel = function(site, currentStage, map, sitesViewModel) {
    var self = this;
    self.name = site.name;

    var incompleteActivities = _.filter(currentStage.activities, function(activity) {
        return activity.siteId == site.siteId && !activity.isComplete();
    });
    self.reportingComplete = incompleteActivities.length == 0;


    function getSiteBounds(siteId) {
        // Only works for polygon sites.
        var features = map.featureIndex[siteId];

        var bounds = new google.maps.LatLngBounds();
        if (features && _.isArray(features)) {
            for (var i=0; i<features.length; i++) {
                var feature = features[i];
                if (feature && _.isFunction(feature.getPath)) {
                    feature.getPath().forEach(function(element) {
                        bounds.extend(element)
                    });
                }
            }
        }

        return bounds;
    }

    var bounds = getSiteBounds(site.siteId);
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

    self.hasCollectedReportingDates = function() {
        return project.custom && project.custom.reportingPeriodStart && project.custom.reportindPeriodEnd;
    };
    var hasSubmittedOrPublishedReport = _.find(project.reports || [], function(report) {
        return report.publicationStatus == 'published' || report.publicationStatus == 'pendingApproval';
    });

    // Find the oldest report that has not yet been approved to work with.
    var currentReport = _.find(project.reports || [], function(report) {
        return report.publicationStatus != 'published';
    });
    if (!currentReport) {
        currentReport = project.reports[project.reports.length-1];
    }
    currentReport = new Report(currentReport);

    var planViewModel = new PlanViewModel(project.activities, project.reports, [], {}, project, null, config, true, false);

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

    var reportToDate = currentReport.toDate;

    self.reportingFinancialYear = isoDateToFinancialYear(reportToDate);
    self.dueDate = convertToSimpleDate(reportToDate);

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
            return isAdminActivity(activity) || isOptionalReport(activity) || activity.progress() == ActivityProgress.finished;
        });
    };

    /**
     * If the ESP Species activity hasn't yet been completed when the submit button is pressed,
     * this function will mark it as not applicable and save it as finished.
     */
    self.skipOptionalReport = function() {
        var outputName = 'ESP Optional Reporting';
        var activityId = self.optionalReport.activityId;
        var output = {
            name:outputName,
            data:{},
            outputNotCompleted: true
        };

        var activityData = {
            activityId:activityId,
            outputs:[output],
            progress:ActivityProgress.finished
        };

        return $.ajax({
            url: config.activityUpdateUrl+'/'+activityId,
            type: 'POST',
            data: JSON.stringify(activityData),
            contentType: 'application/json'
        });
    };

    function showSaveError() {
        bootbox.error("There was an error submitting your report.  Please reload your page and try again.  If the error persists, please contact: ESPmonitoring@environment.gov.au");
    }


    function saveAndSubmitAnnualReport() {
        ecodata.forms[self.administrativeReport.activityId].save(function(valid, data) {
            if (valid && data && !data.error) {
                currentStage.submitReport();
            }
            else {
                showSaveError();
            }
        });
    }

    /**
     * Checks if the ESP species activity is complete, and if not completes it before saving the
     * annual submission report activity and submitting the report
     */
    self.submitReport = function() {

        if (self.optionalReport.progress() != ActivityProgress.finished) {
            self.skipOptionalReport().done(function() {
                saveAndSubmitAnnualReport();
            }).fail(function() {
                showSaveError();
            });
        }
        else {
            saveAndSubmitAnnualReport();
        }
    };

    // This is a temporary measure to attempt to collect what dates stewards are reporting against as the
    // project data is not necessarily correct in all cases.
    self.reportingPeriodStart = ko.observable(currentReport.fromDate).extend({simpleDate:false});
    self.reportingPeriodEnd = ko.observable(currentReport.toDate).extend({simpleDate:false});
    self.reportingPeriodStart.subscribe(function(startDate) {
        var endDate = convertToIsoDate(moment(startDate).add(1, 'years').toDate());
        self.reportingPeriodEnd(endDate);
    });
    var reportSelectionModalSelector = '#report-selection';
    self.saveReportingDates = function() {
        $("#report-selection").modal('hide');
        blockUIWithMessage("Saving your reporting dates");
        var data = {
            custom: {
                reportingPeriodStart: self.reportingPeriodStart(),
                reportindPeriodEnd: self.reportingPeriodEnd(),
                reportId:currentReport.reportId
            }
        };
        $.ajax({
            url: config.saveReportingDatesUrl,
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).done(function() {
            window.location.reload();
        }).fail(function() {
            $.unblockUI();
            bootbox.alert("An error occurred when saving your reporting dates.  Please reload your page and try again.  If the error persists, please contact: ESPmonitoring@environment.gov.au", function() {
                $("#report-selection").modal('show');
            })
        })
    };
    self.collectReportDates = function() {
        $(reportSelectionModalSelector).modal({backdrop:'static'});
    };

    if (!hasSubmittedOrPublishedReport && !self.hasCollectedReportingDates()) {
        self.collectReportDates();
    }
    else if (self.hasCollectedReportingDates()) {
        self.reportingFinancialYear = isoDateToFinancialYear(project.custom.reportindPeriodEnd);
    }

};

initialiseESPActivity = function(activity) {
    var master = null;

    function registerModel(modelMaster) {
        var activityData = {
            activityId:activity.activityId,
            startDate:activity.plannedStartDate,
            endDate:activity.plannedEndDate,
            progress:'finished'
        };

        modelMaster.register('activityModel', function() { return activityData; }, function() { return true }, function(){}, false);
    };

    // The ESP activity is loaded via ajax onto a tab, and there appears to be
    // a race between the script on that page running and the tab shown event firing
    // (which is what invokes this code).  So we keep waiting until it's done what
    // we need it to do, which is to add a reference to itself to the global scope for
    // us to use.
    function waitForMaster() {
        master = ecodata.forms[activity.activityId];
        if (master) {
            registerModel(master);
        }
        else {
            setTimeout(waitForMaster, 500);
        }
    }
    waitForMaster();


};

initialisePhotos = function(photoPointSelector, photosSelector) {

    loadAndConfigureSitePhotoPoints(photoPointSelector);
    $(photosSelector).mThumbnailScroller({});
    $(photosSelector + ' .fancybox').fancybox();
}