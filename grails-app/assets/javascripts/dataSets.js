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

    /** View model backing for a single row in the data set summary table */
    function DataSetSummary(dataSet) {

        this.editUrl = config.editDataSetUrl + '?dataSetId='+dataSet.dataSetId;
        this.name = dataSet.name;
        this.progress = dataSet.progress;
        this.deleteDataSet = function() {
            bootbox.confirm("Are you sure?", function() {
                projectService.deleteDataSet(dataSet.dataSetId).done(function() {
                    blockUIWithMessage("Refreshing page...");
                    window.location.href = config.returnToUrl;
                });
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

    var config = _.defaults({validationContainerSelector:'.validationEngineContainer'}, options);
    $(config.validationContainerSelector).validationEngine();

    dataSet = dataSet || {};
    self.dataSetId = dataSet.dataSetId;
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

    self.type = ko.observable(dataSet.type);

    if (dataSet.measurementTypes && !_.isArray(dataSet.measurementTypes)) {
        dataSet.measurementTypes = [dataSet.measurementTypes];
    }
    self.measurementTypes = ko.observableArray(dataSet.measurementTypes);
    self.methods = ko.observableArray(dataSet.methods);
    self.methodDescription = ko.observable(dataSet.methodDescription);
    self.collectionApp = ko.observable(dataSet.collectionApp);
    self.location = ko.observable(dataSet.location);
    self.startDate = ko.observable(dataSet.startDate).extend({simpleDate:false});
    self.endDate = ko.observable(dataSet.endDate).extend({simpleDate:false});
    self.addition = ko.observable(dataSet.addition);
    self.collectorType = ko.observable(dataSet.collectorType);
    self.qa = ko.observable(dataSet.qa);
    self.published = ko.observable(dataSet.published);
    self.storageType = ko.observable(dataSet.storageType);
    self.publicationUrl = ko.observable(dataSet.publicationUrl);
    self.format = ko.observable(dataSet.format);
    if (dataSet.sensitivities && !_.isArray(dataSet.sensitivities)) {
        dataSet.sensitivities = [dataSet.sensitivities];
    }
    self.sensitivities = ko.observableArray(dataSet.sensitivities);
    self.owner = ko.observable(dataSet.owner);
    self.custodian = ko.observable(dataSet.custodian);
    self.progress = ko.observable(dataSet.progress);
    self.markedAsFinished = ko.observable(dataSet.progress === 'finished');
    self.markedAsFinished.subscribe(function (finished) {
        self.progress(finished ? 'finished' : 'started');
    });

    self.validate = function() {
        return $(config.validationContainerSelector).validationEngine('validate');
    }
    self.save =  function() {
        var markAsFinished = self.markedAsFinished();
        var valid = markAsFinished ? self.validate() : true;

        if (valid) {
            var dataSet = ko.mapping.toJS(self,
                {ignore: ['grantId', 'projectName', 'programName', 'validate', 'save', 'cancel', 'investmentOtherSelected']});
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
};
