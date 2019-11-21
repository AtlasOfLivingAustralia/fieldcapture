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

    function buildEspProject() {
        // This is a single stage of an ESP report
        return {
            projectId:'p1',
            name:"ESP test project",
            status:'active',
            plannedStartDate:'2017-01-31T13:00:00Z',
            plannedEndDate:'2020-01-31T13:00:00Z',
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
                toDate:'2019-01-31T13:00:00Z'
            },
            {
                    name: 'Stage 2',
                    publicationStatus:'published',
                    fromDate:'2019-01-31T13:00:00Z',
                    toDate:'2020-01-31T13:00:00Z'
            }],
            activities:[{
                activityId:'a1',
                type:"ESP PMU or Zone Report",
                plannedStartDate:'2018-01-31T13:00:00Z',
                plannedEndDate:'2019-01-31T13:00:00Z',
                progress:'planned',
                siteId:'site1',
                documents:[]
            }, {
                activityId:'a2',
                type:"ESP Species",
                plannedStartDate:'2018-01-31T13:00:00Z',
                plannedEndDate:'2019-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            }, {
                activityId:'a3',
                type:"ESP Overview",
                plannedStartDate:'2018-01-31T13:00:00Z',
                plannedEndDate:'2019-01-31T13:00:00Z',
                progress:'planned',
                documents:[]
            }
            ]
        };
    }

    it("An ESP project report can be submitted once all of the PMU/Zone activities are marked as finished.", function() {

        var project = buildEspProject();
        var config = {};
        var viewModel = new SimplifiedReportingViewModel(project, config);
        expect(viewModel.canViewSubmissionReport()).toBeFalsy();

        project.activities[0].progress = 'finished';
        //project.reports[0].publicationStatus = 'published'
        viewModel = new SimplifiedReportingViewModel(project, config);
        expect(viewModel.canViewSubmissionReport()).toBeTruthy();



    });

    it("will auto-complete the ESP species activity if the report is submitted without completing it manually", function() {
        var project = buildEspProject();
        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        ecodata.forms.a3 = {
            save:function(callback) {
                callback(true, {});
            }
        };
        var viewModel = new SimplifiedReportingViewModel(project, config);
        project.activities[0].progress = 'finished';

        var ajaxParamsForSpeciesActivity;
        spyOn($, 'ajax').and.callFake(function(params) {
            ajaxParamsForSpeciesActivity = params;
            return $.Deferred().resolve({'text':'this a a fake response'}).promise();
        });

        spyOn(ko, 'applyBindings').and.returnValue(undefined);
        $.fn.modal = function() { return {on:function() {}}};

        viewModel.submitReport();
        expect(ajaxParamsForSpeciesActivity).toEqual({
            url:config.activityUpdateUrl+'/a2',
            type:'POST',
            data: '{"activityId":"a2","outputs":[{"name":"ESP Optional Reporting","data":{},"outputNotCompleted":true}],"progress":"finished"}',
            contentType: 'application/json'

        });


    });

    it("will not attempt to submit the form if the form validation fails", function() {
        var project = buildEspProject();
        // Setup the Zone report and Species report as completed.
        project.activities[0].progress = 'finished';
        project.activities[1].progress = 'finished';

        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        var saveCalled = false;
        ecodata.forms.a3 = {
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
        project.activities[0].progress = 'finished';
        project.activities[1].progress = 'finished';

        var config = {
            activityUpdateUrl:"/activity/ajaxUpdate"
        };
        var saveCalled = false;
        ecodata.forms.a3 = {
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
        expect(viewModel.stageToReport()).toEqual("Stage 1")
        expect(viewModel.reportableStages().length).toEqual(1)

    });




});