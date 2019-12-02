//= require forms-manifest.js
//= require jquery.appear/jquery.appear.js
//= require_self
function validateDateField(dateField) {
    var date = stringToDate($(dateField).val());

    if (!isValidDate(date)) {
        return "Date must be in the format dd-MM-YYYY";
    };
}

/* Master controller for page. This handles saving each model as required. */
var Master = function (activityId, config) {
    var self = this;
    this.subscribers = [];

    var defaults = {
        validationContainerSelector:'#validation-container',
        timeoutMessageSelector:'#timeoutMessage',
        activityUpdateUrl:fcConfig.activityUpdateUrl,
        minOptionalSectionsCompleted: 1,
        activityStorageKey: 'activity-'+activityId
    };

    var options = _.extend({}, defaults, config);
    var activityStorageKey = options.activityStorageKey;

    // client models register their name and methods to participate in saving
    self.register = function (modelInstanceName, getMethod, isDirtyMethod, resetMethod, saveCallback) {
        self.subscribers.push({
            model: modelInstanceName,
            get: getMethod,
            isDirty: isDirtyMethod,
            reset: resetMethod,
            saveCallback: saveCallback
        });
        if (ko.isObservable(isDirtyMethod)) {
            isDirtyMethod.subscribe(function() {
                self.dirtyCheck();
            });
        }
    };

    self.dirtyCheck = function() {
        self.dirtyFlag.isDirty(self.isDirty());
    };

    /**
     *  Takes into account changes to the photo point photo's as the default knockout dependency
     *  detection misses edits to some of the fields.
     */
    self.dirtyFlag = {
        isDirty: ko.observable(false),
        reset: function() {
            $.each(self.subscribers, function(i, obj) {
                obj.reset();
            });
        }
    };

    // master isDirty flag for the whole page - can control button enabling
    self.isDirty  = function () {
        var dirty = false;
        $.each(this.subscribers, function(i, obj) {
            dirty = dirty || obj.isDirty();
        });
        return dirty;
    };

    self.activityData = function() {
        var activityData = undefined;
        $.each(self.subscribers, function(i, obj) {
            if (obj.model == 'activityModel') {
                activityData = obj.get();
                return false;
            }
        });
        return activityData;
    };

    self.validate = function() {
        var valid = $(options.validationContainerSelector).validationEngine('validate');
        if (valid) {

            // Check that forms with multiple optional sections have at least one of those sections completed.
            var optionalCount = 0;
            var notCompletedCount = 0;
            var warnings = [];
            $.each(self.subscribers, function(i, obj) {
                if (obj.model !== 'activityModel') {
                    if (obj.model.transients.optional) {
                        optionalCount++;
                        if (obj.model.outputNotCompleted()) {
                            notCompletedCount++;
                        }
                    }
                    warnings = warnings.concat(obj.model.checkWarnings());
                }
            });
            var completed = optionalCount - notCompletedCount;
            if (optionalCount > 1 && completed < config.minOptionalSectionsCompleted) {
                valid = false;
                bootbox.alert("<p>To 'Save changes', the mandatory fields of at least one section of this form must be completed.</p>"+
                    "<p>If all sections are 'Not applicable' please contact your grant manager to discuss alternate form options</p>");
            }
            else if (warnings.length > 0) {
                bootbox.alert("<p>You have active warnings on this form.  Please check that the values entered are correct.</p>");
            }

        }

        return valid;
    };

    self.modelAsJS = function(valid) {
        var activityData, outputs = [];
        $.each(self.subscribers, function(i, obj) {
            if (obj.isDirty()) {
                if (obj.model === 'activityModel') {
                    activityData = obj.get();
                }
                else {
                    outputs.push(obj.get());
                }
            }
        });

        if (activityData === undefined && outputs.length == 0) {
            return undefined;
        }
        if (!activityData) {
            activityData = {
                progress:self.activityData().progress,
                activityId:self.activityData().activityId
            };
        }
        activityData.outputs = outputs;

        // We can't allow an activity that failed validation to be marked as finished.
        if (valid === false) {
            activityData.progress = 'started';
        }

        return activityData;

    };
    self.modelAsJSON = function() {
        var jsData = self.modelAsJS();

        return jsData ? JSON.stringify(jsData) : undefined;
    };

    self.displayErrors = function(errors) {
        var errorText =
            "<span class='label label-important'>Important</span><h4>There was an error while trying to save your changes.</h4>";

        $.each(errors, function (i, error) {
            errorText += "<p>Saving <b>" +  (error.name === 'activity' ? 'the activity context' : error.name) +
                "</b> threw the following error:<br><blockquote>" + error.error + "</blockquote></p>";
        });
        errorText += "<p>Any other changes should have been saved.</p>";
        bootbox.alert(errorText);
    };

    function handleSessionTimeout(localStorageFailed) {

        if (!localStorageFailed) {

            var unloadHandler = window.onbeforeunload;
            window.onbeforeunload = null;
            bootbox.alert($(options.timeoutMessageSelector).html(),
                function() {
                    window.onbeforeunload = unloadHandler;
                });
        }
        else {
            // We weren't able to save the page so we can't give the reload the page instructions.
            // This is relying on the logout detection in the page template
            $('#logout-warning').show();
            bootbox.alert(" <b>Please do not leave this page</b><br/>Your save failed due to a network error or login timeout.  Please open a new tab and log back into MERIT, then attempt to save this data again.");
        }

    };

    /**
     * Makes an ajax call to save any sections that have been modified. This includes the activity
     * itself and each output.
     *
     * Modified outputs are injected as a list into the activity object. If there is nothing to save
     * in the activity itself, then the root is an object that is empty except for the outputs list.
     *
     * NOTE that the model for each section must register itself to be included in this save.
     *
     * Validates the entire page before saving.
     */
    self.save = function (saveCallback, validate) {

        if (_.isUndefined(validate)) {
            validate = true;
        }
        var valid = false;
        if (validate) {
            valid = self.validate();
        }

        var jsData = self.modelAsJS(valid);

        if (jsData === undefined) {
            alert("Nothing to save.");
            return;
        }

        // Don't allow another save to be initiated.
        blockUIWithMessage("Saving activity data...");

        var toSave = JSON.stringify(jsData);

        var localStorageFailed = false;
        try {
            amplify.store(activityStorageKey, toSave);
        }
        catch (e) {
            localStorageFailed = true;
        }

        healthCheck(options.healthCheckUrl).done(function() {
            $.ajax({
                url: options.activityUpdateUrl,
                type: 'POST',
                data: toSave,
                contentType: 'application/json'

            }).done(function (data) {
                if (data.error || data.errors) {
                    $.unblockUI();
                    self.displayErrors(data.errors || [{name:'Activity', error: data.error}]);
                } else {
                    self.cancelAutosave();
                    self.dirtyFlag.reset();
                    blockUIWithMessage("Activity data saved.");
                    amplify.store(activityStorageKey, null);

                    if (validate && !valid) {
                        $.unblockUI();
                        var message = 'Your changes have been saved. Please note, this report has required fields that are incomplete. You will not be able to submit this report (on the Reporting Tab) until all required fields have been completed.';
                        bootbox.alert(message, function () {
                            self.validate();
                        });
                    }
                    self.performSaveCallbacks(data, valid, saveCallback);
                }
            }).fail(function (jqXHR, status, error) {

                $.unblockUI();
                // This is to detect a redirect to CAS response due to she same session timeout, which is not
                // 100% reliable using ajax (e.g. no network will give the same response).
                if (jqXHR.readyState == 0) {
                    handleSessionTimeout(localStorageFailed);
                }
                else {
                    self.displayErrors(['An unhandled error occurred: ' + error]);
                }

            });

        }).fail(function() {
            $.unblockUI();
            handleSessionTimeout(localStorageFailed);
        });
    };

    self.deleteSavedData = function() {
        amplify.store(activityStorageKey, null);
    };

    self.performSaveCallbacks = function(saveResponse, valid, saveCallback) {
        if (saveResponse) {
            $.each(this.subscribers, function(i, obj) {
                if (obj.saveCallback) {
                    obj.saveCallback(saveResponse);
                }
            });
        }
        if (saveCallback) {
            saveCallback(valid, saveResponse);
        }
    };

    autoSaveModel(self, null, {preventNavigationIfDirty:true, healthCheckUrl:options.healthCheckUrl});

    if (amplify.store(activityStorageKey)) {
        bootbox.alert("Unsaved data has been found for this form.  Please press 'Save' to keep this data or 'Cancel' to discard it");
    }
};

/**
 * Extends the Master function to support the additional site information that can be recorded in a report form.
 * @param reportId the id of the report
 * @param activityId the activity associated with the report.
 * @param reportSite the site associated with the report
 * @param featureCollection the object used to track changes to site features
 * @param config configuration for the Master function
 */
var ReportMaster = function(reportId, activityId, reportSite, featureCollection, config) {
    var self = this;
    Master.call(self, activityId, config);

    var masterToJS = self.modelAsJS;
    self.modelAsJS = function(valid) {

        var original = masterToJS(valid);
        if (original) {
            var payload = {
                reportId: reportId,
                activityId: activityId,
                activity: original
            };

            if (featureCollection) {
                var siteData = featureCollection.toSite(reportSite);
                siteData.siteId = null; // The id is ignored by the server which always uses the one in the
                // attached activity.
                payload.site = siteData;
            }

            return payload;
        }

    }
};


function ActivityHeaderViewModel (activity, site, project, metaModel, themes, config) {
    var self = this;

    var defaults = {
        projectViewUrl:fcConfig.projectViewUrl,
        siteViewUrl:fcConfig.siteViewUrl,
        featureServiceUrl:fcConfig.featureServiceUrl,
        wmsServerUrl:fcConfig.wmsServerUrl
    };
    var options = _.extend({}, defaults, config);

    var mapInitialised = false;
    self.activityId = activity.activityId;
    self.description = ko.observable(activity.description);
    self.notes = ko.observable(activity.notes);
    self.startDate = ko.observable(activity.startDate).extend({simpleDate: false});
    self.endDate = ko.observable(activity.endDate || activity.plannedEndDate).extend({simpleDate: false});
    self.plannedStartDate = ko.observable(activity.plannedStartDate).extend({simpleDate: false});
    self.plannedEndDate = ko.observable(activity.plannedEndDate).extend({simpleDate: false});
    self.projectStage = ko.observable(activity.projectStage || "");
    self.progress = ko.observable(activity.progress);
    self.mainTheme = ko.observable(activity.mainTheme);
    self.type = ko.observable(activity.type);
    self.projectId = activity.projectId;
    self.formVersion = ko.observable(activity.formVersion);
    self.transients = {};
    self.transients.site = ko.observable(site);
    self.transients.project = project;
    self.transients.outputs = [];
    self.transients.metaModel = metaModel || {};
    self.transients.activityProgressValues = ['planned','started','finished'];
    self.transients.themes = $.map(themes, function (obj, i) { return obj.name });
    self.transients.markedAsFinished = ko.observable(activity.progress === 'finished');
    self.transients.markedAsFinished.subscribe(function (finished) {
        self.progress(finished ? 'finished' : 'started');
    });

    self.confirmSiteChange = function() {

        if (metaModel.supportsSites && metaModel.supportsPhotoPoints && self.transients.photoPointModel().dirtyFlag.isDirty()) {
            return window.confirm(
                "This activity has photos attached to photo points.\n  Changing the site will delete these photos.\n  This cannot be undone.  Are you sure?"
            );
        }
        return true;
    };
    self.siteId = ko.vetoableObservable(activity.siteId, self.confirmSiteChange);

    self.siteId.subscribe(function(siteId) {

        var matchingSite = $.grep(self.transients.project.sites, function(site) { return siteId == site.siteId})[0];

        if (mapInitialised) {
            alaMap.clearFeatures();
            if (matchingSite) {
                alaMap.replaceAllFeatures([matchingSite.extent.geometry]);
            }
            self.transients.site(matchingSite);
            if (metaModel.supportsPhotoPoints) {
                self.updatePhotoPointModel(matchingSite);
            }
        }
    });
    self.goToProject = function () {
        if (self.projectId) {
            document.location.href = options.projectViewUrl + self.projectId;
        }
    };
    self.goToSite = function () {
        if (self.siteId()) {
            document.location.href = options.siteViewUrl + self.siteId();
        }
    };

    if (metaModel.supportsPhotoPoints) {
        self.transients.photoPointModel = ko.observable(new PhotoPointViewModel(site, activity));
        self.updatePhotoPointModel = function(site) {
            self.transients.photoPointModel(new PhotoPointViewModel(site, activity));
        };
    }

    self.modelForSaving = function (valid) {
        // get model as a plain javascript object
        var jsData = ko.mapping.toJS(self, {'ignore':['transients', 'dirtyFlag']});
        if (metaModel.supportsPhotoPoints) {
            jsData.photoPoints = self.transients.photoPointModel().modelForSaving();
        }
        // If we leave the site or theme undefined, it will be ignored during JSON serialisation and hence
        // will not overwrite the current value on the server.
        var possiblyUndefinedProperties = ['siteId', 'mainTheme'];

        $.each(possiblyUndefinedProperties, function(i, propertyName) {
            if (jsData[propertyName] === undefined) {
                jsData[propertyName] = '';
            }
        });
        return jsData;
    };
    self.modelAsJSON = function () {
        return JSON.stringify(self.modelForSaving());
    };

    self.selfDirtyFlag = ko.dirtyFlag(self, false);

    // make sure progress moves to started if we save any data (unless already finished)
    // (do this here so the model becomes dirty)
    self.progress(self.transients.markedAsFinished() ? 'finished' : 'started');

    self.initialiseMap = function(mapFeatures) {
        if (metaModel.supportsSites) {
            if (!mapFeatures) {
                mapFeatures = {zoomToBounds: true, zoomLimit: 15, highlightOnHover: true, features: []};
            }
            init_map_with_features({
                    mapContainer: "smallMap",
                    zoomToBounds:true,
                    zoomLimit:16,
                    featureService: options.featureServiceUrl,
                    wmsServer: options.wmsServerUrl,
                    polygonMarkerAreaKm2:-1
                },
                mapFeatures
            );
            mapInitialised = true;
        }
    };

    self.updateIdsAfterSave = function(saveResult) {
        if (metaModel.supportsPhotoPoints) {
            self.transients.photoPointModel().updatePhotoPointDocumentIds(saveResult.photoPoints);

        }
    };

    /**
     *  Takes into account changes to the photo point photo's as the default knockout dependency
     *  detection misses edits to some of the fields.
     */
    self.dirtyFlag = {
        isDirty: ko.computed(function() {
            var dirty = self.selfDirtyFlag.isDirty();
            if (!dirty && metaModel.supportsPhotoPoints) {
                dirty = self.transients.photoPointModel().dirtyFlag.isDirty();
            }
            return dirty;
        }),
        reset: function() {
            self.selfDirtyFlag.reset();
            if (metaModel.supportsPhotoPoints) {
                self.transients.photoPointModel().dirtyFlag.reset();
            }
        }
    };
};

/** Responsible for navigation at the bottom of report forms */
var ReportNavigationViewModel = function(reportMaster, activityViewModel, options) {
    var self = this;

    var anchor = $(options.anchorElementSelector);
    var navContent = $(options.navContentSelector);
    var floatingDiv = $(options.floatingNavSelector);

    anchor.appear({interval:100}).on('appear', function() {
        floatingDiv.fadeOut();
        navContent.appendTo(anchor);
    }).on("disappear", function() {
        navContent.appendTo(floatingDiv);
        floatingDiv.fadeIn();
    });
    if (!anchor.is(":appeared")) {
        anchor.trigger('disappear');
    }
    else {
        anchor.trigger("appear");
    }
    self.dirtyFlag = reportMaster.dirtyFlag;
    self.activity = activityViewModel;

    self.save = function() {
        var markAsFinished = activityViewModel.transients.markedAsFinished();
        // Only attempt to validate if the user wants to mark the activity as
        // complete.
        reportMaster.save(function(valid) {
            $.unblockUI();
            if (!valid) {
                activityViewModel.transients.markedAsFinished(false);
            }

        }, markAsFinished);
    };
    self.saveAndExit = function() {
        reportMaster.save(function() {
            self.return();
        }, false);
    };
    self.saveAndExitButtonClass = ko.computed(function() {
        return self.dirtyFlag.isDirty() ? 'btn-info' : '';
    });
    self.exitReport = function() {
        if (self.dirtyFlag.isDirty()) {
            var message = "<b>Unsaved data found</b>"+
                "<p>The form you are working on has unsaved changes. Please confirm if you would like to:</p>";
            bootbox.dialog(message,[
                {
                    label:'Save and exit',
                    class:'btn-success',
                    callback: self.saveAndExit
                },
                {
                    label:'Exit without saving',
                    class:'btn-warning',
                    callback: self.cancel
                },
                {
                    label:'Return to reporting form',
                    class:'btn-info',
                    // do nothing, just close the dialog
                    callback:function() {}
                }
            ]);
        }
        else {
            reportMaster.cancelAutosave();
            self.return();
        }
    };


    self.cancel = function() {
        reportMaster.cancelAutosave();
        self.return();
    };
    self.return = function() {
        window.location.href = options.returnTo;
    };

    self.navElementPosition = options.navElementPosition;

    /**
     * For started activities, scroll the page to the first invalid field so the user can continue working.
     * @param validationContainer a jquery object wrapping the element that the jquery validation engine was
     * attached to.
     */
    self.initialiseScrollPosition = function(validationContainer, progress) {
        if (!progress) {
            progress = self.activity.progress();
        }
        if (progress == ActivityProgress.started) {
            scrollToFirstInvalidField(validationContainer);
        }
    }
};
