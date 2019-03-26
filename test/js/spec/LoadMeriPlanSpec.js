describe("Loading the MERI plan is handled correctly", function () {

    var meriPlanData;

    beforeAll(function () {
        meriPlanData = {
            "outcomes": {
                "primaryOutcome": {
                    "description": "Outcome 1: By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar Sites, through the implementation of priority actions.",
                    "assets": ["Asset 1"]
                },
                "secondaryOutcomes": [{
                    "description": "Outcome 2: By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved.",
                    "assets": ["Secondary asset 1"]
                }, {
                    "description": "Outcome 3: By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions.",
                    "assets": ["Secondary asset 2"]
                }, {
                    "description": "Outcome 4: By 2023, the implementation of priority actions is leading to an improvement in the condition of EPBC Act listed Threatened Ecological Communities.",
                    "assets": ["Secondary asset 3"]
                }],
                "shortTermOutcomes": [{
                    "description": "Short term outcome 1",
                    "assets": []
                }, {"description": "Short term outcome 2", "assets": []}],
                "midTermOutcomes": [{
                    "description": "Medium term outcome 1",
                    "assets": []
                }, {"description": "Medium term outcome 2", "assets": []}, {
                    "description": "Medium term outcome 3",
                    "assets": []
                }]
            },
            "description": "This is the project description",
            "threats": {
                "description": "",
                "rows": [{"threat": "Threat 1", "intervention": "Intervention 1"}, {
                    "threat": "Threat 2",
                    "intervention": "Intervention 2"
                }, {"threat": "Threat 3", "intervention": "Intervention 3"}, {
                    "threat": "Threat 4",
                    "intervention": "Intervention 4"
                }]
            },
            "rationale": "This is the project rationale",
            "projectMethodology": "This is the project methodology",
            "baseline": {
                "rows": [{"baseline": "Baseline 1", "method": "Baseline method 1"}, {
                    "baseline": "Baseline 2",
                    "method": "Baseline method 2"
                }, {"baseline": "Baseline 3", "method": "Baseline method 3"}, {
                    "baseline": "Baseline 4",
                    "method": "Baseline method 4"
                }]
            },
            "keq": {
                "rows": [{"data1": "Indicator 1", "data2": "Indicator approach 1"}, {
                    "data1": "Indicator 2",
                    "data2": "Indicator approach 2"
                }, {"data1": "Indicator 3", "data2": "Indicator approach 3"}]
            },
            "projectEvaluationApproach": "This is the project evaluation approach",
            "priorities": {
                "rows": [{
                    "data1": "Document 1",
                    "data2": "Section 1",
                    "data3": "Alignment 1"
                }, {"data1": "Document 2", "data2": "Section 2", "data3": "Alignment 2"}]
            },
            "serviceIds": [1],
            "outputTargets": [{
                "scoreId": "f8c42b45-f4b8-4001-8ab7-80d9d945b059",
                "target": "100",
                "periodTargets": [{"period": "2018/2019", "target": "1"}, {
                    "period": "2019/2020",
                    "target": "2"
                }, {"period": "2020/2021", "target": "3"}, {
                    "period": "2021/2022",
                    "target": "4"
                }, {"period": "2022/2023", "target": "5"}]
            }],
            "risks": {
                "rows": [{
                    "threat": "Natural Environment",
                    "description": "Testing description",
                    "likelihood": "Unlikely",
                    "consequence": "High",
                    "riskRating": "High",
                    "currentControl": "Testing control",
                    "residualRisk": "Medium"
                }]
            }
        };

        window.fcConfig = {
            imageLocation: '/'
        };
        window.bootbox = {
            alert: function (message) {
                return message;
            }
        };

        // These are defined in the ecodata-client-plugin which doesn't package javascript as a node module so
        // getting them for testing purposes is a bit messy, so they are just being stubbed.
        ko.dirtyFlag = function() {
            this.isDirty = ko.observable(false);
            return this;
        };


    });
    afterAll(function () {
        delete window.fcConfig;
    });

    it("should map the data returned by the meri plan upload and update the view model correctly", function () {

        var project = {};
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        viewModel.meriPlanUploadComplete({}, {result:meriPlanData});
        var meriPlanViewModel = viewModel.meriPlan();

        expect(meriPlanViewModel.description()).toBe(meriPlanData.description);
        expect(meriPlanViewModel.outcomes.primaryOutcome.description()).toBe(meriPlanData.outcomes.primaryOutcome.description);


    });

})
;