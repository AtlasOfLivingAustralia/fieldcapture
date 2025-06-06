
var MONITOR_APP = 'Monitor';
/**
 * This view model backs the "Data set summary" tab that is optionally displayed on project
 * pages that support it.
 * @param dataSets array containing any data set summaries already associated with the project.
 * @param projectService instance of the project service - used to communicate with MERIT when
 * deleting data sets.
 * @param config configuration for the view model.  Must contain two entries:
 * 1) editDataSetUrl : URL for the data set summary edit page
 * 2) newDataSetUrl : URL used to delete a data set.
 * @constructor
 */
var DataSetsViewModel =function(dataSets, projectService, config) {
    var self = this;

    self.dataSets = _.map(dataSets || [], function(dataSet) {
        return new DataSetSummary(dataSet);
    });

    self.downloadProjectDataSetsUrl = config.downloadProjectDataSetsUrl;
    self.manageEMSASiteDataSetsUrl = config.manageEMSASiteDataSetsUrl;

    self.newDataSet = function() {
        window.location.href = config.newDataSetUrl;
    };

    /** Only new data sets will have a created date, return true if any of the data sets have one */
    self.supportsDateColumn = _.find(dataSets, function(dataSet) {
        return dataSet.dateCreated;
    });
    function serviceName(serviceId) {
        var service = _.find(config.services || [], function(service) {
            return service.id == serviceId
        });
        return (service && service.name);
    }

    function reportName(reportId) {
        var report = _.find(config.reports || [], function(report) {
            return report.reportId == reportId
        });
        return (report && report.name);
    }

    function isDownloadableMonitorDataSet(dataSet) {

        if (dataSet.collectionApp !== MONITOR_APP) {
            return false;
        }
        var protocolId = dataSet.protocol;
        var downloadableProtocols = config.downloadableProtocols || [];

        var isDownloadable = downloadableProtocols.indexOf(protocolId) >= 0;
        if (isDownloadable) {
            var now = moment();
            var creationDate = moment(dataSet.dateCreated);
            var minutesToIngestDataSet = config.minutesToIngestDataSet || 1;
            if (dataSet.progress !== ActivityProgress.planned) {
                if (creationDate.add(minutesToIngestDataSet, 'minutes').isBefore(now)) {
                    isDownloadable = true;
                }
            }
        }
        return isDownloadable;
    }

    self.enableProjectDataSetsDownload = _.find(dataSets, isDownloadableMonitorDataSet) != null;

    /** View model backing for a single row in the data set summary table */
    function DataSetSummary(dataSet) {

        this.editUrl = config.editDataSetUrl + '?dataSetId=' + dataSet.dataSetId;
        this.viewUrl = config.viewDataSetUrl + '?dataSetId=' + dataSet.dataSetId;
        this.name = dataSet.name;
        this.createdIn = dataSet.collectionApp === MONITOR_APP ? MONITOR_APP : 'MERIT';
        this.progress = dataSet.progress;
        this.dateCreated = ko.observable(dataSet.dateCreated).extend({simpleDate: false});
        this.lastUpdated = ko.observable(dataSet.lastUpdated).extend({simpleDate: false});
        this.service = dataSet.serviceId ? (serviceName(dataSet.serviceId) || 'Unsupported service') : '';
        this.projectOutcomes = dataSet.projectOutcomes;
        this.type = dataSet.type;
        this.report = dataSet.reportId ? reportName(dataSet.reportId) : '';
        this.reportUrl = config.viewReportUrl + '?reportId=' + dataSet.reportId;
        this.publicationStatus = dataSet.publicationStatus;

        this.readOnly = PublicationStatus.isReadOnly(dataSet.publicationStatus);
        this.deleteDataSet = function () {
            bootbox.confirm("Deleting a data set summary cannot be undone.  Are you sure?", function (yes) {
                if (yes) {
                    blockUIWithMessage("Deleting data set summary...");
                    projectService.deleteDataSet(dataSet.dataSetId).done(function () {
                        blockUIWithMessage("Refreshing page...");
                        window.location.href = config.returnToUrl;
                    });
                }
            });
        };

        /** Returns true if the data set was created in the Monitor app and is a plot selection data set */
        function isPlotSelection(dataSet) {
            var plotSelectionModelName = 'plot-selection-survey';
            return dataSet.surveyId &&
                   dataSet.surveyId.survey_metadata &&
                   dataSet.surveyId.survey_metadata.survey_details &&
                   dataSet.surveyId.survey_metadata.survey_details.survey_model === plotSelectionModelName;
        }

        this.canResync = this.createdIn == MONITOR_APP && // Resyncing only makes sense for Monitor data sets
                        !this.isReadOnly && // Once data has been published we shouldn't change it
                        !dataSet.reportId && // Once data has been copied into a report we shouldn't change it
                         dataSet.surveyId &&
                         dataSet.surveyId.coreSubmitTime &&  // If we don't have a coreSubmitTime Monitor core doesn't have any data to resync
                         !isPlotSelection(dataSet); // We don't currently support resyncing plot selection data sets

        this.resyncDataSet = function() {
            bootbox.confirm("After resyncing you will need to check any data you entered and mark the data set as finished again.\n Re-syncing a data set can take up to a minute to complete.\n  Are you sure?", function (yes) {
                if (yes) {
                    projectService.resyncDataSet(dataSet.dataSetId).done(function () {
                        blockUIWithMessage("Refreshing page...");
                        window.location.href = config.returnToUrl;
                    });
                }
            })
        };
        this.downloadUrl = null;
        if (isDownloadableMonitorDataSet(dataSet)) {
            this.downloadUrl = config.downloadDataSetUrl + '/' + dataSet.dataSetId;
        }

        if (this.createdIn === MONITOR_APP) {
            if (this.progress == ActivityProgress.planned) {
                var now = moment();
                var creationDate = moment(dataSet.dateCreated);

                if (creationDate.add(1, 'minutes').isBefore(now)) {
                    this.progress = 'sync error';
                }
                else {
                    this.progress = 'sync in progress';
                }
            }
        }
    }
};


/**
 * This view model backs the "Create / Edit data set summary" pages.
 * @param dataSet Existing details of the data set summary if one is being edited.
 * @param projectService instance of the project service - used to communicate with MERIT when
 * saving data sets.
 * @param options configuration for the view model.  Must contain two entries:
 * 1) returnToURL : URL to navigate to after saving or cancelling an edit.
 * 2) validationContainerSelector (optional, default '.validationEngineContainer') :
 *   CSS selector for the form element which has the jQueryValidationEngine attached.
 * @constructor
 */
var DataSetViewModel = function(dataSet, projectService, options) {
    var self = this;
    var config = _.defaults({validationContainerSelector:'.validationEngineContainer'}, options);
    dataSet = dataSet || {};
    self.dateCreated = dataSet.dateCreated;
    self.dataSetId = dataSet.dataSetId;
    self.surveyId = dataSet.surveyId; // Data set summaries created by a submission from the Monitor app will have a surveyId
    self.name = ko.observable(dataSet.name );
    self.grantId = dataSet.grantId;
    self.projectName = dataSet.projectName;
    self.programName = dataSet.programName;
    self.activityId = dataSet.activityId;
    self.programOutcome = ko.observable(dataSet.programOutcome);
    self.investmentPriorities = ko.observableArray(dataSet.investmentPriorities);
    self.otherInvestmentPriority = ko.observable(dataSet.otherInvestmentPriority);

    self.investmentOtherSelected = ko.pureComputed(function() {
        return _.contains(self.investmentPriorities(), "Other");
    });

    self.investmentOtherSelected.subscribe(function(otherSelected) {
        if (!otherSelected) {
            self.otherInvestmentPriority(undefined);
        }
    });

    self.projectBaselines = options.projectBaselines;
    self.type = ko.observable(dataSet.type);
    self.baselines = ko.observableArray(dataSet.baselines);
    self.otherDataSetType = ko.observable(dataSet.otherDataSetType);
    self.term = ko.observable(dataSet.term);
    var selectedServiceAndOutcome = _.find(options.projectOutcomes || [], function(outcome) {
        return outcome.serviceId == dataSet.serviceId && _.isEqual(outcome.outcomes, dataSet.projectOutcomes);
    });
    self.serviceAndOutcomes = ko.observable(selectedServiceAndOutcome && selectedServiceAndOutcome.label);
    self.projectProtocols = config.projectProtocols;

    self.protocol = ko.observable(dataSet.protocol);
    self.protocolLabel = ko.computed(function() {
        var protocolLabelAndValue = _.find(self.projectProtocols || [], function(protocol) {
            return protocol.value == self.protocol();
        });
        return protocolLabelAndValue ? protocolLabelAndValue.label : '';
    })
    self.projectOutcomeList = ko.observableArray(options.projectOutcomes);
    self.serviceId = ko.computed(function() {
        var selectedOutcome = _.find(options.projectOutcomes || [], function(serviceAndOutcome) {
            return serviceAndOutcome.label == self.serviceAndOutcomes();
        });
        return selectedOutcome && selectedOutcome.serviceId;
    });

    self.disableBaseline = function(e) {
        var serviceConfig = config.serviceBaselineIndicatorOptions[self.serviceId()];
        return serviceConfig ? serviceConfig.disableBaseline : false;
    };
    self.disableIndicator = function() {
        var serviceConfig = config.serviceBaselineIndicatorOptions[self.serviceId()];
        return serviceConfig ? serviceConfig.disableIndicator : false;
    };
    self.projectOutcomes = ko.computed(function() {
        var selectedOutcome = _.find(options.projectOutcomes || [], function(serviceAndOutcome) {
            return serviceAndOutcome.label == self.serviceAndOutcomes();
        });
        return selectedOutcome && selectedOutcome.outcomes;
    });
    if (dataSet.measurementTypes && !_.isArray(dataSet.measurementTypes)) {
        dataSet.measurementTypes = [dataSet.measurementTypes];
    }
    self.measurementTypes = ko.observableArray(dataSet.measurementTypes);
    self.methods = ko.observableArray(dataSet.methods);

    /** Applies a standard method description for emsa protocols */
    function syncMethodDescriptionToProtocol(protocol) {
        var emsaMethodDescription = 'See EMSA Protocols Manual: https://www.tern.org.au/emsa-protocols-manual';
        if (protocol && protocol != 'other') {
            self.methodDescription(emsaMethodDescription);
        }
        else if (self.methodDescription() == emsaMethodDescription) {
            self.methodDescription('');
        }
    }
    self.methodDescription = ko.observable(dataSet.methodDescription);
    syncMethodDescriptionToProtocol(dataSet.protocol);

    self.protocol.subscribe(function(protocol) {
        syncMethodDescriptionToProtocol(protocol);
    });


    self.collectionApp = ko.observable();
    self.location = ko.observable(dataSet.location);
    self.siteId = ko.observable(dataSet.siteId);
    self.siteUrl = options.viewSiteUrl + '/' + dataSet.siteId;
    self.startDate = ko.observable(dataSet.startDate).extend({simpleDate:false});
    self.endDate = ko.observable(dataSet.endDate).extend({simpleDate:false});
    self.endDate.subscribe(function (endDate) {
        self.endDate(endDate);
        if(endDate) {
            self.dataCollectionOngoing(null);
        }
    });
    self.addition = ko.observable(dataSet.addition);
    self.threatenedSpeciesIndex = ko.observable(dataSet.threatenedSpeciesIndex);
    self.threatenedSpeciesIndexUploadDate = ko.observable(dataSet.threatenedSpeciesIndexUploadDate).extend({simpleDate:false});
    self.publicationUrl = ko.observable(dataSet.publicationUrl);
    self.format = ko.observable();
    self.collectionApp.subscribe(function(collectionApp) {
        if (collectionApp == MONITOR_APP) {
            self.format('Database Table');
            self.publicationUrl('Biodiversity Data Repository (URL pending)');
        }
    });
    self.collectionApp(dataSet.collectionApp); // Set this after declaration to trigger the subscription above.

    if (dataSet.sensitivities && !_.isArray(dataSet.sensitivities)) {
        dataSet.sensitivities = [dataSet.sensitivities];
    }

    self.sizeInKB = ko.observable(dataSet.sizeInKB);
    self.sizeUnknown = ko.observable(dataSet.sizeUnknown);
    self.format.subscribe(function(format) {
        if (!self.sizeInKB()) {
             if (['Database Table', 'Database View', 'ESRI REST'].indexOf(format) >=0) {
                 self.sizeUnknown(true);
             }
        }
    });
    self.format(dataSet.format);
    self.sensitivities = ko.observableArray(dataSet.sensitivities);
    self.otherSensitivity = ko.observable(dataSet.otherSensitivity);
    self.progress = ko.observable(dataSet.progress);
    self.markedAsFinished = ko.observable(dataSet.progress === 'finished');
    self.markedAsFinished.subscribe(function (finished) {
        self.progress(finished ? 'finished' : 'started');
    });
    self.dataCollectionOngoing = ko.observable(dataSet.dataCollectionOngoing);
    self.dataCollectionOngoing.subscribe(function (dataCollectionOngoing) {
        if(dataCollectionOngoing) {
            $(options.endDateSelector).val(null).trigger('change');
        }
    });
    self.validateEndDate = function() {
        if (!self.dataCollectionOngoing()) {
            if (!self.endDate()) {
                return 'This field is required';
            }
            if (self.endDate() < self.startDate()) {
                return 'Date must be after '+self.startDate.formattedDate();
            }
        }
    };

    self.isAutoCreated = dataSet.surveyId != null;

    self.removeSite = function() {
        self.siteId(null);
    }
    self.validate = function() {
        return $(config.validationContainerSelector).validationEngine('validate');
    }
    self.save =  function() {
        var markAsFinished = self.markedAsFinished();
        var valid = markAsFinished ? self.validate() : true;

        if (valid) {
            var dataSet = ko.mapping.toJS(self,
                {ignore: [
                    'grantId', 'projectName', 'programName', 'validate', 'save', 'cancel',
                        'investmentOtherSelected', 'siteUrl', 'isAutoCreated', 'serviceAndOutcomes',
                        'projectOutcomeList', 'projectBaselines', 'projectProtocols', 'disableBaseline',
                        'disableIndicator', 'protocolLabel']});
            projectService.saveDataSet(dataSet).done(function() {
                // return to project
                window.location.href = config.returnToUrl;
            }).fail(function() {
                bootbox.alert("There was an error saving the data set");
            });
        }
    }

    self.cancel = function() {
        // return to project
        window.location.href = config.returnToUrl;
    }

    self.uniqueName = function() {
        var invalidNames = config.invalidNames || [];
        if (invalidNames.indexOf(self.name()) >= 0) {
            return "This name is used by another data set.  Please use a unique name";
        }
    }

    self.attachValidation = function () {
        $(config.validationContainerSelector).validationEngine();
        window.uniqueName = self.uniqueName; // Setup the validation function for the name field.
    }
};
