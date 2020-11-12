var DataSetsViewModel =function(dataSets, projectService, config) {
    var self = this;

    self.dataSets = _.map(dataSets || [], function(dataSet) {
        return new DataSetSummary(dataSet);
    })

    self.newDataSet = function() {
        window.location.url = config.newDataSetUrl;
    };


    function DataSetSummary(dataSet) {

        this.editUrl = config.editDataSetUrl + dataSet.dataSetId;
        this.name = dataSet.name;
        this.deleteDataSet = function() {
            bootbox.confirm("Are you sure?", function() {
                projectService.deleteDataSet(dataSet.dataSetId);
            });
        };
    }

};



var DataSetViewModel = function(dataSet, projectService, options) {
    var self = this;
    dataSet = dataSet || {};
    self.dataSetId = dataSet.dataSetId;
    self.name = ko.observable(dataSet.name );
    self.grantId = dataSet.grantId;
    self.projectName = dataSet.projectName;
    self.programName = dataSet.programName;
    self.description = ko.observable(dataSet.description);
    self.programOutcome = ko.observable(dataSet.outcome);
    self.investmentPriority = ko.observable(dataSet.startDate ? dataSet.startDate :  startDate).extend({simpleDate:false});
    self.type = ko.observable(dataSet.type);
    self.types = function() {
        return ["Outcome baseline", "Outcome change", "Standalone"];
    }
    self.measurementTypes = ko.observable(dataSet.measurementTypes);

    self.method = ko.observable(dataSet.method);
    self.collectionApp = ko.observable(dataSet.collectionApp);

    self.startDate = ko.observable(dataSet.startDate).extend({simpleDate:false});
    self.endDate = ko.observable(dataSet.endDate).extend({simpleDate:false});

    self.collector = ko.observable(dataSet.collector);
    self.qa = ko.observable(dataSet.qa);
    self.published = ko.observable(dataSet.published);
    self.curator = ko.observable(dataSet.curator);
    self.publicationUrl = ko.observable(dataSet.publicationUrl);
    self.format = ko.observable(dataSet.format);

    self.save =  function() {
        var dataSet = ko.mapping.toJS(self);
        projectService.saveDataSet(dataSet).done(function() {
            // return to project
        }).fail(function() {
            // show error
        });
    }

    self.cancel = function() {
        // return to project
    }
};