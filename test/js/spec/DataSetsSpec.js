describe("The data set summaries view models behave correctly", function () {

    var projectService;
    var fcConfigBackup;
    var bootboxBackup;

    beforeAll(function () {
        fcConfigBackup = window.fcConfig;
        window.fcConfig = {};
        bootboxBackup = window.bootbox;
        window.bootbox = {
            confirm: function () {
            }
        };
        projectService = new ProjectService({}, {});

    });

    afterAll(function () {
        window.fcConfig = fcConfigBackup;
        window.bootbox = bootboxBackup;
    });


    it("The DataSetsViewModel can manipulate data set summaries for the purposes of the Data set summaries tab", function () {

        var config = {
            editDataSetUrl: '/edit',
            deleteDataSetUrl: '/delete'
        };
        var dataSets = [];

        var dataSetsSummaryVM = new DataSetsViewModel(dataSets, projectService, config);
        expect(dataSetsSummaryVM.dataSets.length).toEqual(0);

        dataSets = [
            {
                dataSetId: 'ds1',
                name: 'Data set 1'
            },
            {
                dataSetId: 'ds2',
                name: 'Data set 2'
            }];
        dataSetsSummaryVM = new DataSetsViewModel(dataSets, projectService, config);
        expect(dataSetsSummaryVM.dataSets.length).toEqual(2);
        expect(dataSetsSummaryVM.dataSets[0].name).toEqual('Data set 1');
        expect(dataSetsSummaryVM.dataSets[0].editUrl).toEqual('/edit?dataSetId=ds1');

        expect(dataSetsSummaryVM.dataSets[1].name).toEqual('Data set 2');
        expect(dataSetsSummaryVM.dataSets[1].editUrl).toEqual('/edit?dataSetId=ds2');

        var deferred = $.Deferred();
        spyOn(projectService, 'deleteDataSet').and.returnValue(deferred);
        spyOn(bootbox, 'confirm').and.callFake(function (message, callback) {
            callback();
        });

        dataSetsSummaryVM.dataSets[1].deleteDataSet();

        expect(bootbox.confirm).toHaveBeenCalled();
        expect(projectService.deleteDataSet).toHaveBeenCalledWith('ds2')
    });

    function dataSet() {
        return {
            "owner" : "Test",
            "methodDescription" : "Test method",
            "custodian" : "Test",
            "investmentPriorities" : ["Botaurus poiciloptilus (Australasian Bittern)", "Other"],
            "otherInvestmentPriority": "Test",
            "endDate" : "2020-12-02T13:00:00Z",
            "methods" : [
                "Surveying - Fauna, Flora"
            ],
            "format" : "Excel",
            "published" : "No",
            "sensitivities" : [
                "No"
            ],
            "type" : "Project progress dataset that is tracking change against an established project baseline dataset",
            "collectionApp" : "Test app",
            "collectorType" : "Other",
            "qa" : "Yes",
            "dataSetId" : "9bbed216-c3d4-4346-912b-0127a4bb53b9",
            "name" : "Test data set",
            "measurementTypes" : [
                "Abundance"
            ],
            "storageType" : "Stored internally",
            "location" : "Test",
            "programOutcome" : "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved.",
            "publicationUrl" : "https://test.com.au",
            "startDate" : "2020-11-30T13:00:00Z",
            "addition" : "Yes"
        };
    }


    it("The DataSetViewModel can manipulate data set data for the purposes of the Data set edit/create pages", function () {
        var config = {
            returnToUrl: '/project/1',
            validationContainerSelector: '.validationEngineContainer'
        };

        var dataSetsVM = new DataSetViewModel(dataSet(), projectService, config);

        var savedDataSet = null;
        spyOn(projectService, 'saveDataSet').and.callFake(function(dataSet) {
            savedDataSet = dataSet;
            return $.Deferred();
        });
        dataSetsVM.save();

        expect(projectService.saveDataSet).toHaveBeenCalled();
        expect(savedDataSet).toEqual(dataSet());


    });

    it("should able to compute the the value of investment Properties", function(){
        let config = {
            returnToUrl: '/project/1',
            validationContainerSelector: '.validationEngineContainer'
        };
        let dataSet = {"investmentPriorities" : ["Botaurus poiciloptilus (Australasian Bittern)", "Other"]}

        let dataSetsVM = new DataSetViewModel(dataSet, projectService, config);
        dataSetsVM.investmentPriorities(dataSet.investmentPriorities);
        expect(dataSetsVM.investmentOtherSelected()).toEqual(true)
    });
});
