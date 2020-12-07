var DataSetsViewModel =function(dataSets, projectService, config) {
    var self = this;

    self.dataSets = _.map(dataSets || [], function(dataSet) {
        return new DataSetSummary(dataSet);
    });

    self.newDataSet = function() {
        window.location.href = config.newDataSetUrl;
    };


    function DataSetSummary(dataSet) {

        this.editUrl = config.editDataSetUrl + '?dataSetId='+dataSet.dataSetId;
        this.name = dataSet.name;
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
    self.description = ko.observable(dataSet.description);
    self.programOutcome = ko.observable(dataSet.programOutcome);
    self.investmentPriority = ko.observable(dataSet.investmentPriority);
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

    self.validate = function() {
        return $(config.validationContainerSelector).validationEngine('validate');
    }
    self.save =  function() {
        var valid = self.validate();

        if (valid) {
            var dataSet = ko.mapping.toJS(self);
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