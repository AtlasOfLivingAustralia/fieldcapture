describe("The ESP reporting process works slightly differently to the normal MERIT stage report submission", function () {

    beforeAll(function() {
        window.fcConfig = {
            imageLocation:'/'
        }
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
            plannedStartDate:'2018-01-31T13:00:00Z',
            plannedEndDate:'2019-01-31T13:00:00Z',
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
                publicationStatus:'not published',
                fromDate:'2018-01-31T13:00:00Z',
                toDate:'2019-01-31T13:00:00Z'
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

});