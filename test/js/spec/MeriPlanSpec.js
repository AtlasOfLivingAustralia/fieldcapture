describe("Loading the MERI plan is handled correctly", function () {

    var meriPlanData;

    beforeAll(function () {
        $.fn.popover = function(){};
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

        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        viewModel.meriPlanUploadComplete({}, {result:{meriPlan:meriPlanData, messages:[]}});
        var meriPlanViewModel = viewModel.meriPlan();

        expect(meriPlanViewModel.description()).toBe(meriPlanData.description);
        expect(meriPlanViewModel.outcomes.primaryOutcome.description()).toBe(meriPlanData.outcomes.primaryOutcome.description);


    });


    it("should allow service targets to be loaded programatically to support MERI plan loads", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        var serviceTarget = {
            serviceId:1,
            scoreId:1,
            target:100,
            periodTargets:[
                {period:'2018/2019', target:1},
                {period:'2019/2020', target:2},
                {period:'2020/2021', target:3}
            ]
        };

        var row = viewModel.meriPlan().services.addServiceTarget(serviceTarget);

        expect(row.serviceId()).toEqual(serviceTarget.serviceId);
        expect(row.scoreId()).toEqual(serviceTarget.scoreId);
        expect(row.target()).toEqual(100);

        expect(row.periodTargets.length).toEqual(3);
        expect(row.periodTargets[0].target()).toEqual(1);
        expect(row.periodTargets[1].target()).toEqual(2);
        expect(row.periodTargets[2].target()).toEqual(3);


    });

    it("should not clear targets when changing the score id so as to support MERI plan loads with bad data", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        var serviceTarget = {
            serviceId:1,
            scoreId:1,
            target:100,
            periodTargets:[
                {period:'2018/2019', target:1},
                {period:'2019/2020', target:2},
                {period:'2020/2021', target:3}
            ]
        };

        var row = viewModel.meriPlan().services.addServiceTarget(serviceTarget);
        expect(row.target()).toEqual(100);

        row.scoreId(2);
        expect(row.target()).toEqual(100);

    });

    it("should trigger a warning when the sum of the annual targets is greater than the overall target", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        var serviceTarget = {
            serviceId:1,
            scoreId:1,
            target:100,
            periodTargets:[
                {period:'2018/2019', target:1},
                {period:'2019/2020', target:2},
                {period:'2020/2021', target:3}
            ]
        };

        var row = viewModel.meriPlan().services.addServiceTarget(serviceTarget);
        expect(row.minimumTargetsValid()).toBeTruthy();

        row.target(1);
        expect(row.minimumTargetsValid()).toBeFalsy();
    });

    it("should provide a simplified objectives model for selecting program objectives from a list", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', programObjectives:['objective 1', 'objective 2']});

        var objectivesModel = viewModel.meriPlan().objectives;

        objectivesModel.simpleObjectives(["objective 1", "objective 2"]);
        expect(objectivesModel.rows1().length).toBe(2);
        expect(objectivesModel.rows1()[0].description()).toBe("objective 1");
        expect(objectivesModel.rows1()[1].description()).toBe("objective 2");

        expect(objectivesModel.simpleObjectives()).toEqual(["objective 1", "objective 2"]);


        objectivesModel.simpleObjectives(["objective 2"]);
        expect(objectivesModel.rows1().length).toBe(1);
        expect(objectivesModel.rows1()[0].description()).toBe("objective 2");

        objectivesModel.simpleObjectives([]);
        expect(objectivesModel.rows1().length).toBe(0);

        objectivesModel.simpleObjectives(["objective 1", "objective 2"]);
        expect(objectivesModel.rows1().length).toBe(2);
        expect(objectivesModel.rows1()[0].description()).toBe("objective 1");
        expect(objectivesModel.rows1()[1].description()).toBe("objective 2");

        // Empty values should be ignored
        objectivesModel.simpleObjectives(["", null, "objective 1", "objective 2"]);
        expect(objectivesModel.rows1().length).toBe(2);
        expect(objectivesModel.rows1()[0].description()).toBe("objective 1");
        expect(objectivesModel.rows1()[1].description()).toBe("objective 2");

    });

    it("should not serialize the simpleobjectives computed observable", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', programObjectives:['objective 1', 'objective 2']});

        var objectivesModel = viewModel.meriPlan().objectives;
        objectivesModel.simpleObjectives(["objective 1", "objective 2"]);


        var expectedResult = {
            rows1:[{description:'objective 1', assets:[]}, {description:'objective 2', assets:[]}],
            rows: [{}]
        };
        expect(JSON.parse(JSON.stringify(objectivesModel))).toEqual(expectedResult);

        objectivesModel.simpleObjectives.otherChecked(true);
        objectivesModel.simpleObjectives.otherValue("Other objective");

        var expectedResultWithOther = {
            rows1:[{description:'objective 1', assets:[]}, {description:'objective 2', assets:[]}, {description:'Other objective', assets:[]}],
            rows: [{}]
        };
        expect(JSON.parse(JSON.stringify(objectivesModel))).toEqual(expectedResultWithOther);

        objectivesModel.simpleObjectives.otherChecked(false);
        expect(JSON.parse(JSON.stringify(objectivesModel))).toEqual(expectedResult);

    });

    it("should pre-populate the program and other objectives from saved data", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                    objectives: {
                        rows1: [{
                            description:'objective 1'
                        },
                        {
                            description:'other objective'
                        }]
                    }
                }
            }
        };
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', programObjectives:['objective 1', 'objective 2']});

        var objectivesModel = viewModel.meriPlan().objectives;
        expect(objectivesModel.simpleObjectives.otherChecked()).toBeTrue();
        expect(objectivesModel.simpleObjectives.otherValue()).toEqual('other objective');
        expect(objectivesModel.simpleObjectives()).toEqual(['objective 1']);

        objectivesModel.simpleObjectives.otherChecked(false);
        expect(objectivesModel.simpleObjectives.otherValue()).toBeUndefined();

        var expectedResult = {
            rows1:[{description:'objective 1', assets:[]}],
            rows: [{}]
        };
        expect(JSON.parse(JSON.stringify(objectivesModel))).toEqual(expectedResult);
    });

    it("Should allow assets to be recorded", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                    assets:[{description:'asset 1'}]
                }
            }
        };
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});
        var meriPlan = viewModel.meriPlan();

        expect(meriPlan.assets().length).toEqual(1);
        expect(meriPlan.assets()[0].description()).toEqual('asset 1')

        viewModel.addAsset();
        expect(meriPlan.assets().length).toBe(2);

        meriPlan.assets()[1].description('asset 2');

        var serialized = JSON.parse(meriPlan.modelAsJSON());
        expect(serialized.custom.details.assets).toEqual([{description:'asset 1'}, {description:'asset 2'}]);

        viewModel.removeAsset(meriPlan.assets()[0]);
        expect(meriPlan.assets().length).toBe(1);

    });

    it("The services should be serialized to an array of ids", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                }
            }
        };
        var services = [
            {id:1, name:"Service 1", scores:[{scoreId:1}]}, {id:2, name:"Service 2", scores:[{scoreId:2}]}
        ];
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});
        var serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());

        var savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.serviceIds).toEqual([]);

        project.custom.details.serviceIds = [1,2];
        project.outputTargets = [{scoreId:1}, {scoreId:2}];
        viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', services:services});
        serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.serviceIds).toEqual([1,2]);


    });

    it("should remove null outcomes when serialized", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                }
            }
        };

        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        expect(viewModel.meriPlan().outcomes.primaryOutcome.description()).toBeNull();

        var serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());

        var savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.outcomes.primaryOutcome).toEqual({});

    });

    it("should be able to support activity selection, including 'Other'", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                    activities: {
                        activities:['activity 1']
                    }
                }
            }
        };
        var programActivities = ['activity 1', 'activity 2', 'activity 3'];
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', programActivities: programActivities});

        expect(viewModel.meriPlan().activities.activities()).toEqual(['activity 1']);
        viewModel.meriPlan().activities.activities(['activity 2']);
        var serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        var savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['activity 2']);

        viewModel.meriPlan().activities.activities.otherChecked(true);
        viewModel.meriPlan().activities.activities.otherValue("Other");

        serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['activity 2', 'Other']);

        viewModel.meriPlan().activities.activities.otherChecked(false);
        expect(viewModel.meriPlan().activities.activities.otherValue()).toBeFalsy();

        serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['activity 2']);


    });

})
;