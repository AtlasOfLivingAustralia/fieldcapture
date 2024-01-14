
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

        this.deleteDataSet = function () {
            bootbox.confirm("Are you sure?", function (yes) {
                if (yes) {
                    projectService.deleteDataSet(dataSet.dataSetId).done(function () {
                        blockUIWithMessage("Refreshing page...");
                        window.location.href = config.returnToUrl;
                    });
                }
            });
        };
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

    dataSet = dataSet || {};
    self.dataSetId = dataSet.dataSetId;
    self.surveyId = dataSet.surveyId; // Data set summaries created by a submission from the Monitor app will have a surveyId
    self.name = ko.observable(dataSet.name );
    self.grantId = dataSet.grantId;
    self.projectName = dataSet.projectName;
    self.programName = dataSet.programName;
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
    self.projectOutcomeList = ko.observableArray(options.projectOutcomes);
    self.serviceId = ko.computed(function() {
        var selectedOutcome = _.find(options.projectOutcomes || [], function(serviceAndOutcome) {
            return serviceAndOutcome.label == self.serviceAndOutcomes();
        });
        return selectedOutcome && selectedOutcome.serviceId;
    });
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
    self.otherMeasurementType = ko.observable(dataSet.otherMeasurementType);
    self.methods = ko.observableArray(dataSet.methods);
    self.methodDescription = ko.observable(dataSet.methodDescription);
    self.protocol.subscribe(function(protocol) {
        if (protocol && protocol != 'other') {
            self.methodDescription('See EMSA Protocols Manual: https://www.tern.org.au/emsa-protocols-manual');
        }
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
            self.sizeUnknown(['Database Table', 'Database View', 'ESRI REST'].indexOf(format) >=0);
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
        self.dataCollectionOngoing(dataCollectionOngoing);
        if(dataCollectionOngoing) {
            $(options.endDateSelector).val(null).trigger('change');
        }
    });

    self.isAutoCreated = dataSet.surveyId != null;

    self.validate = function() {
        return $(config.validationContainerSelector).validationEngine('validate');
    }
    self.save =  function() {
        var markAsFinished = self.markedAsFinished();
        var valid = markAsFinished ? self.validate() : true;

        if (valid) {
            var dataSet = ko.mapping.toJS(self,
                {ignore: ['grantId', 'projectName', 'programName', 'validate', 'save', 'cancel', 'investmentOtherSelected', 'siteUrl', 'isAutoCreated', 'serviceAndOutcomes', 'projectOutcomeList', 'projectBaselines', 'projectProtocols']});
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

    self.attachValidation = function () {
        var config = _.defaults({validationContainerSelector:'.validationEngineContainer'}, options);
        $(config.validationContainerSelector).validationEngine();
    }
};
