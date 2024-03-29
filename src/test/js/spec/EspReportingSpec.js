describe("The ESP reporting process works slightly differently to the normal MERIT stage report submission", function () {

    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        };
        window.ecodata = { forms: {} };

    });
    afterAll(function() {
        delete window.fcConfig;
        delete window.ecodata;
    });

    beforeEach(function() {
        amplify.store('selectedReportId-p1', null);
    });
    afterEach(function() {
        amplify.store('selectedReportId-p1', null);
    });

    function buildEspProject() {
        // This is a single stage of an ESP report
        return {
            projectId:'p1',
            name:"ESP test project",
            status:'active',
            plannedStartDate:'2017-01-31T13:00:00Z',
            plannedEndDate:'2023-01-31T13:00:00Z',
            custom: {
                reportingPeriodStart:'2018-01-31T13:00:00Z',
                reportindPeriodEnd:'2019-01-31T13:00:00Z'
            },
            sites:[{
                name:'Site 1',
                siteId:'site1'
            }],
            documents:[],
            reports:[{
                name: 'Stage 1',
                publicationStatus:'not published',
                fromDate:'2018-01-31T13:00:00Z',
                toDate:'2019-01-31T13:00:00Z',
                reportId:'r1'
            },
            {
                    name: 'Stage 2',
                    publicationStatus:'published',
                    fromDate:'2019-01-31T13:00:00Z',
                    toDate:'2020-01-31T13:00:00Z',
                    reportId:'r2'
            },
                {
                    name: 'Stage 3',
                    publicationStatus:'not published',
                    fromDate:'2020-01-31T13:00:00Z',
                    toDate:'2021-01-31T13:00:00Z',
                    reportId:'r3'
                },
                {
                    name: 'Stage 4',
                    publicationStatus:'not published',
                    fromDate:'2021-01-31T13:00:00Z',
                    toDate:'2022-01-31T13:00:00Z',
                    reportId:'r4'
                },{
                    name: 'Stage 5',
                    publicationStatus:'not published',
                    fromDate:'2022-01-31T13:00:00Z',
                    toDate:'2023-01-31T13:00:00Z',
                    reportId:'r5'
                }],
            activities:[{
                activityId:'a1',
                type:"ESP PMU or Zone Report",
                plannedStartDate:'2021-01-31T13:00:00Z',
                plannedEndDate:'2022-01-31T13:00:00Z',
                progress:'planned',
                siteId:'site1',
                documents:[]
            }, {
                activityId:'a2',
                type:"ESP Species",
                plannedStartDate:'2021-01-31T13:00:00Z',
                plannedEndDate:'2022-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            }, {
                activityId:'a3',
                type:"ESP Overview",
                plannedStartDate:'2021-01-31T13:00:00Z',
                plannedEndDate:'2022-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            },
            {
                activityId:'a4',
                type:"ESP PMU or Zone Report",
                plannedStartDate:'2022-01-31T13:00:00Z',
                plannedEndDate:'2023-01-31T13:00:00Z',
                progress:'planned',
                siteId:'site1',
                documents:[]
            }, {
                activityId:'a5',
                type:"ESP Species",
                plannedStartDate:'2022-01-31T13:00:00Z',
                plannedEndDate:'2023-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            }, {
                activityId:'a6',
                type:"ESP Overview",
                plannedStartDate:'2022-01-31T13:00:00Z',
                plannedEndDate:'2023-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            }]
        };
    }

    it("An ESP project report can be submitted once all of the PMU/Zone activities are marked as finished.", function() {

        var project = buildEspProject();
        var config = {};
        var viewModel = new SimplifiedReportingViewModel(project, config);
        expect(viewModel.canViewSubmissionReport()).toBeFalsy();

        $.each(project.activities, function (i, activity) {
                activity.progress = 'finished';
        });
        // project.reports[0].publicationStatus = 'published'
        viewModel = new SimplifiedReportingViewModel(project, config);
        expect(viewModel.canViewSubmissionReport()).toBeTruthy();



    });

    it("will auto-complete the ESP species activity if the report is submitted without completing it manually", function() {
        var project = buildEspProject();
        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        ecodata.forms.a6 = {
            save:function(callback) {
                callback(true, {});
            }
        };
        var viewModel = new SimplifiedReportingViewModel(project, config);
        project.activities[3].progress = 'finished';

        var ajaxParamsForSpeciesActivity;
        spyOn($, 'ajax').and.callFake(function(params) {
            ajaxParamsForSpeciesActivity = params;
            return $.Deferred().resolve({'text':'this a a fake response'}).promise();
        });

        spyOn(ko, 'applyBindings').and.returnValue(undefined);
        $.fn.modal = function() { return {on:function() {}}};

        viewModel.submitReport();
        expect(ajaxParamsForSpeciesActivity).toEqual({
            url:config.activityUpdateUrl+'/a5',
            type:'POST',
            data: '{"activityId":"a5","outputs":[{"name":"ESP Optional Reporting","data":{},"outputNotCompleted":true}],"progress":"finished"}',
            contentType: 'application/json'

        });


    });

    it("will not attempt to submit the form if the form validation fails", function() {
        var project = buildEspProject();
        // Setup the Zone report and Species report as completed.
        project.activities[3].progress = 'finished';
        project.activities[4].progress = 'finished';

        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        var saveCalled = false;
        ecodata.forms.a6 = {
            save:function(callback) {
                saveCalled = true;
                callback(false, {});
            }
        };
        var viewModel = new SimplifiedReportingViewModel(project, config);


        var ajaxParamsForAnnualReportActivity;
        spyOn($, 'ajax').and.callFake(function(params) {
            ajaxParamsForAnnualReportActivity = params;
            return $.Deferred().resolve({'text':'this a a fake response'}).promise();
        });

        var declarationModalShown = false;
        spyOn(ko, 'applyBindings').and.returnValue(undefined);
        $.fn.modal = function() {
            declarationModalShown = true;
            return {on:function() {}};
        };

        viewModel.submitReport();
        expect(saveCalled).toBeTruthy();
        expect(declarationModalShown).toBeFalsy();
    });

    it("will submit the form if the form validation succeeds", function() {
        var project = buildEspProject();
        // Setup the Zone report and Species report as completed.
        project.activities[3].progress = 'finished';
        project.activities[4].progress = 'finished';

        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        var saveCalled = false;
        ecodata.forms.a6 = {
            save:function(callback) {
                saveCalled = true;
                callback(true, {});
            }
        };
        var viewModel = new SimplifiedReportingViewModel(project, config);


        var ajaxParamsForAnnualReportActivity;
        spyOn($, 'ajax').and.callFake(function(params) {
            ajaxParamsForAnnualReportActivity = params;
            return $.Deferred().resolve({'text':'this a a fake response'}).promise();
        });

        var declarationModalShown = false;
        spyOn(ko, 'applyBindings').and.returnValue(undefined);
        $.fn.modal = function() {
            declarationModalShown = true;
            return {on:function() {}};
        };

        viewModel.submitReport();
        expect(saveCalled).toBeTruthy();
        expect(declarationModalShown).toBeTruthy();
    });

    it("will always return a progress of finished for an activity when saving it", function() {
        var registeredModelInstanceName, registeredGetMethod, registeredIsDirtyMethod, registeredResetMethod, registeredSaveCallback;

        // Sub an implementation of the Master object with the register method.
        ecodata.forms.a1 = {
            register: function(modelInstanceName, getMethod, isDirtyMethod, resetMethod, saveCallback) {
                registeredModelInstanceName = modelInstanceName;
                registeredGetMethod = getMethod;
                registeredIsDirtyMethod = isDirtyMethod;
                registeredResetMethod = resetMethod;
                registeredSaveCallback = saveCallback;
            }
        };
        var activity = {
            activityId:'a1',
            plannedStartDate:'2018-06-30T14:00:00Z',
            plannedEndDate:'2019-06-30T14:00:00Z',

        };
        initialiseESPActivity(activity);

        expect(registeredGetMethod()).toEqual(
            {
                activityId:activity.activityId,
                startDate:activity.plannedStartDate,
                endDate:activity.plannedEndDate,
                progress:'finished'
            });
        expect(registeredIsDirtyMethod()).toBeTruthy();

        // The save will overwrite the progress with "started" if the form fails validation, but we still want
        // the getMethod to return "finished" the next time it is called.
        var result = registeredGetMethod();
        result.progress = 'started';

        expect(registeredGetMethod()).toEqual(
            {
                activityId:activity.activityId,
                startDate:activity.plannedStartDate,
                endDate:activity.plannedEndDate,
                progress:'finished'
            });

    });

    it("Test an ESP project report stages.", function() {

        var project = buildEspProject();
        var config = {showEmptyStages:true };
        var viewModel = new SimplifiedReportingViewModel(project, config);

        console.log(JSON.stringify(viewModel.stageToReport()));
        expect(viewModel.stageToReport()).toEqual("Stage 5")
        expect(viewModel.reportSelectionList.length).toEqual(5)

    });

    it("will stage a report based from the selected reporting period", function() {

        var project = buildEspProject();

        var config = {showEmptyStages:true, selectedReportId:'r2' };
        var viewModel = new SimplifiedReportingViewModel(project, config);

        expect(viewModel.stageToReport()).toEqual("Stage 2");
        expect(viewModel.reportSelectionList.length).toEqual(5);

        expect(amplify.store('selectedReportId-p1')).toEqual(config.selectedReportId);

    });

    it("will select a saved report if one has been previously selected", function() {
        var project = buildEspProject();
        amplify.store('selectedReportId-p1', "r2");
        var config = {showEmptyStages:true };
        var viewModel = new SimplifiedReportingViewModel(project, config);

        expect(viewModel.stageToReport()).toEqual("Stage 2");
    });

    it("will select as the default reporting stage the most recent report that has a to date of before the current time", function() {

        var project = buildEspProject();
        var config = {showEmptyStages:true };
        var viewModel = new SimplifiedReportingViewModel(project, config);

        expect(viewModel.stageToReport()).toEqual("Stage 5")
        expect(viewModel.reportSelectionList.length).toEqual(5)

    });

    it("the reporting period dropdown will display it's value based on the rule where the reports fromDate are less than the current date", function() {

        var project = buildEspProject();
        var config = {showEmptyStages:true };
        var viewModel = new SimplifiedReportingViewModel(project, config);

        expect(viewModel.reportSelectionList.length).toEqual(5)


    });

});