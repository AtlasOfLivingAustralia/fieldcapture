describe("Loading the MERI plan is handled correctly", function () {

    var meriPlanData;

    beforeAll(function () {
        config = {
            useRlpTemplate:true,
            healthCheckUrl:'testing',
            services: [{
                    id:1, name:"Service 1", service:{categories:[]}, scores:[{scoreId:"1", label:"Score 1"}]
                }, {
                    id:2, name:"Service 2", service:{categories:[]}, scores:[{scoreId:"2", label:"Score 2"}, {scoreId:"3", label:"Score 3"}]
                }
            ]
        };
        outputTargets = [{
            "scoreId": "1",
            "target": 6,
            "periodTargets": [
                {"period": "2018/2019", "target": "1"},
                {"period": "2019/2020", "target": "2"},
                {"period": "2020/2021", "target": "3"},
                {"period": "2021/2022", "target": "4"},
                {"period": "2022/2023", "target": "5"}],
            "outcomeTargets": [
                {"relatedOutcomes":["ST1"], "target": "1"},
                {"relatedOutcomes":["MT1"], "target": "2"},
                {"relatedOutcomes":["MT2"], "target": "3"}
            ]
        }];
        risks = {
            "rows": [{
                "threat": "Natural Environment",
                "description": "Testing description",
                "likelihood": "Unlikely",
                "consequence": "High",
                "riskRating": "High",
                "currentControl": "Testing control",
                "residualRisk": "Medium"
            }]
        };
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
                    "code":"ST1",
                    "description": "Short term outcome 1",
                    "assets": [],
                    "relatedOutcome":"Program short term outcome 1"
                }, {"description": "Short term outcome 2", "assets": []}],
                "midTermOutcomes": [{
                    "code":"MT1",
                    "description": "Medium term outcome 1",
                    "assets": [],
                    "relatedOutcome":"Program mid term outcome 1"
                }, {
                    "code":"MT2",
                    "description": "Medium term outcome 2",
                    "assets": [],
                    "relatedOutcome":"Program mid term outcome 2"
                }, {
                    "code":"MT3",
                    "description": "Medium term outcome 3",
                    "assets": [],
                    "relatedOutcome":"Program mid term outcome 2"
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
                "rows": [{
                    "code":"B1",
                    "baseline": "Baseline 1",
                    "method": "Baseline method 1",
                    "relatedOutcomes":["ST1"],
                    "relatedTargetMeasures":["1"],
                    "protocol":"p1"
                }, {
                    "code":"B2",
                    "baseline": "Baseline 2",
                    "method": "Baseline method 2",
                    "relatedOutcomes":["MT1"],
                    "relatedTargetMeasures":[],
                    "protocol":"p2"
                }, {
                    "code":"B3",
                    "baseline": "Baseline 3",
                    "method": "Baseline method 3",
                    "relatedOutcomes":["MT2"],
                    "relatedTargetMeasures":[],
                    "protocol":"p3"
                }, {
                    "code":"B4",
                    "baseline": "Baseline 4",
                    "method": "Baseline method 4",
                    "relatedOutcomes":["MT3"],
                    "relatedTargetMeasures":[],
                    "protocol":"p4"
                }]
            },
            "monitoring": {
                "rows": [{
                    "relatedBaseline":"B1",
                    "data1":"Monitoring methodology 1",
                    "data2":"Monitoring indicator 1",
                    "evidence":"Evidence 1",
                    "relatedTargetMeasures":[]
                },{
                    "relatedBaseline":"B2",
                    "data1":"Monitoring methodology 2",
                    "data2":"Monitoring indicator 2",
                    "evidence":"Evidence 2",
                    "relatedTargetMeasures":[]
                },{
                    "relatedBaseline":"B3",
                    "data1":"Monitoring methodology 3",
                    "data2":"Monitoring indicator 3",
                    "evidence":"Evidence 3",
                    "relatedTargetMeasures":[]
                },{
                    "relatedBaseline":"B4",
                    "data1":"Monitoring methodology 4",
                    "data2":"Monitoring indicator 4",
                    "evidence":"Evidence 4",
                    "relatedTargetMeasures":[]
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

        var projectService = new ProjectService(project, {userHoldsMeriPlanLock:true});

        var viewModel = new MERIPlan(project, projectService, config);

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

        var viewModel = new MERIPlan(project, projectService, config);

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

        var viewModel = new MERIPlan(project, projectService, config);

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

        var viewModel = new MERIPlan(project, projectService, config);

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

    it("should should track the names of selected services for use in the budget table", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});
        var options = {
            useRlpTemplate:true,
            healthCheckUrl:'testing',
            services:[{id:1, name:"Service 1"}, {id:2, name:"Service 2"}]
        };
        var viewModel = new MERIPlan(project, projectService, options);

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

        expect(viewModel.meriPlan().services.selectedServices()).toEqual([]);

        var row = viewModel.meriPlan().services.addServiceTarget(serviceTarget);
        expect(viewModel.meriPlan().services.selectedServices()).toEqual(['Service 1']);

        row.serviceId(2);
        expect(viewModel.meriPlan().services.selectedServices()).toEqual(['Service 2']);
    });

    it("should provide a simplified objectives model for selecting program objectives from a list", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z'
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, _.extend({programObjectives:['objective 1', 'objective 2']}, config));

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
        var viewModel = new MERIPlan(project, projectService, _.extend({programObjectives:['objective 1', 'objective 2']}, config));

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
        var viewModel = new MERIPlan(project, projectService, _.extend({programObjectives:['objective 1', 'objective 2']}, config));

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

    it("Should not use the simplified objectives if the program doesn't require selection from a list", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            custom: {
                details: {
                    objectives: {
                        rows1: [{
                            description:'objective 1',
                            assets:['asset 1']
                        },
                        {
                            description:'other objective',
                            assets:[]
                        }]
                    }
                }
            }
        };
        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, config);

        var objectivesModel = viewModel.meriPlan().objectives;
        expect(objectivesModel.simpleObjectives.otherChecked).toBeUndefined();
        expect(objectivesModel.simpleObjectives.otherValue).toBeUndefined();

        var expectedResult = {
            rows1:[{description:'objective 1', assets:['asset 1']}, {description:'other objective', assets:[]}],
            rows: [{}]
        };
        expect(JSON.parse(JSON.stringify(objectivesModel))).toEqual(expectedResult);

        viewModel.removeObjectivesOutcome(objectivesModel.rows1()[1]);
        expectedResult = {
            rows1: [{description: 'objective 1', assets: ['asset 1']}],
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
        var viewModel = new MERIPlan(project, projectService, config);
        var meriPlan = viewModel.meriPlan();

        expect(meriPlan.assets().length).toEqual(1);
        expect(meriPlan.assets()[0].description()).toEqual('asset 1')

        viewModel.addAsset();
        expect(meriPlan.assets().length).toBe(2);

        meriPlan.assets()[1].description('asset 2');

        var serialized = JSON.parse(meriPlan.modelAsJSON());
        expect(serialized.custom.details.assets).toEqual([{category: '', description:'asset 1'}, {category: '',description:'asset 2'}]);

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

        var projectService = new ProjectService(project, {});
        var viewModel = new MERIPlan(project, projectService, config);
        var serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());

        var savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.serviceIds).toEqual([]);

        project.custom.details.serviceIds = [1,2];
        project.outputTargets = [{scoreId:1}, {scoreId:2}];
        viewModel = new MERIPlan(project, projectService, config);
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
        expect(savedMeriPlan.outcomes.primaryOutcome).toBeNull();

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

    it("should be able to support single activity selection, including 'Other'", function() {
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
        viewModel.meriPlan().activities.activities.singleSelection('activity 2');
        var serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        var savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['activity 2']);

        viewModel.meriPlan().activities.activities.singleSelection('Other');
        viewModel.meriPlan().activities.activities.otherValue("Other activity");

        serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['Other activity']);

        project.custom.details.activities.activities = ['Another activity'];
        viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing', programActivities: programActivities});
        serialized = JSON.parse(viewModel.meriPlan().modelAsJSON());
        savedMeriPlan = serialized.custom.details;
        expect(savedMeriPlan.activities.activities).toEqual(['Another activity']);
        expect(viewModel.meriPlan().activities.activities.otherValue()).toEqual('Another activity');
        expect(viewModel.meriPlan().activities.activities.otherChecked()).toBeTruthy();
    });

    it("should filter selectable outcomes from the program based on the type of the outcome (primary or secondary)", function() {

        var options = {
            outcomes: [
                { outcome:"Outcome 1", "type": 'primary'},
                { outcome:"Outcome 2", "type": 'primary'},
                { outcome:"Outcome 3"},
                { outcome:"Outcome 4", "type": 'secondary'},
            ]
        };

        var viewModel = new OutcomesViewModel([], options);
        expect(viewModel.selectablePrimaryOutcomes).toEqual(["Outcome 1", "Outcome 2", "Outcome 3"]);
        expect(viewModel.selectableSecondaryOutcomes).toEqual(["Outcome 3", "Outcome 4"]);

    });


    it("should allow a outcome to be specified as default", function() {

        var options = {
            outcomes: [
                { outcome:"Outcome 1", "type": 'primary'},
                { outcome:"Outcome 2", "type": 'primary', default:true},
                { outcome:"Outcome 3"},
                { outcome:"Outcome 4", "type": 'secondary'},
            ]
        };

        var viewModel = new OutcomesViewModel({}, options);
        expect(viewModel.primaryOutcome.description()).toBe('Outcome 2');

        var outcomeData = {
            primaryOutcome: {
                description: 'Outcome 3',
                assets:[]
            }
        };
        var viewModel = new OutcomesViewModel(outcomeData, options);
        expect(viewModel.primaryOutcome.description()).toBe('Outcome 3');
    });

    it("should allow multiple priorities to be selected for an outcome if configured to do so", function() {

        var options = {
            outcomes: [
                { outcome:"Outcome 1", "type": 'primary', supportsMultiplePrioritiesAsPrimary:true},
                { outcome:"Outcome 2", "type": 'primary', default:true},
                { outcome:"Outcome 3", supportsMultiplePrioritiesAsSecondary:true},
                { outcome:"Outcome 4", "type": 'secondary'},
            ]
        };

        var viewModel = new OutcomesViewModel({}, options);
        expect(viewModel.primaryOutcome.description()).toBe('Outcome 2');
        expect(viewModel.primaryOutcomeSupportsMultiplePriorities()).toBeFalsy();

        viewModel.primaryOutcome.description(options.outcomes[0].outcome);
        expect(viewModel.primaryOutcomeSupportsMultiplePriorities()).toBeTruthy();

        expect(viewModel.secondaryOutcomeSupportsMultiplePriorities("Outcome 1")).toBeFalsy();
        expect(viewModel.secondaryOutcomeSupportsMultiplePriorities("Outcome 2")).toBeFalsy();
        expect(viewModel.secondaryOutcomeSupportsMultiplePriorities("Outcome 3")).toBeTruthy();
        expect(viewModel.secondaryOutcomeSupportsMultiplePriorities("Outcome 4")).toBeFalsy();

    });

    it("should not serialize the attributes used only for display configuration", function() {

        var options = {
            outcomes: [
                { outcome:"Outcome 1", "type": 'primary', supportsMultiplePrioritiesAsPrimary:true},
                { outcome:"Outcome 2", "type": 'primary', default:true},
                { outcome:"Outcome 3"},
                { outcome:"Outcome 4", "type": 'secondary'},
            ],
            otherOutcomes: []
        };

        var viewModel = new OutcomesViewModel({}, options);

        var serialized = JSON.parse(JSON.stringify(viewModel));
        expect(serialized).toEqual({"primaryOutcome":{"description":"Outcome 2","assets":[]},"secondaryOutcomes":[],"shortTermOutcomes":[],"midTermOutcomes":[], otherOutcomes:[]});

    });

    it("provides a flat list of project assets for use as a select list by the assets section", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            priorities:[
                {"category":"Cat 1", "priority":"Priority 1"},
                {"category":"Cat 1", "priority":"Priority 2"},
                {"category":"Cat 2", "priority":"Priority 3"}
            ]
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        expect(viewModel.priorityAssets()).toEqual(["Priority 1", "Priority 2", "Priority 3"]);
        expect(viewModel.priorityAssets("Cat 1")).toEqual(["Priority 1", "Priority 2"]);
        expect(viewModel.priorityAssets("Cat 2")).toEqual(["Priority 3"]);
        expect(viewModel.priorityAssets(["Cat 1", "Cat 2"])).toEqual(["Priority 1", "Priority 2", "Priority 3"]);

    });

    it("provides a list of asset categories for use as a select list by the assets section", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            priorities:[
                {"category":"Cat 1", "priority":"Priority 1"},
                {"category":"Cat 1", "priority":"Priority 2"},
                {"category":"Cat 2", "priority":"Priority 3"},
                {"category":"Cat 3", "priority":"Priority 4"}
            ]
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        expect(viewModel.assetCategories()).toEqual(["Cat 1", "Cat 2", "Cat 3"]);
        expect(viewModel.assetCategories(["Cat 1"])).toEqual(["Cat 1"]);
        // Note filter order is preserved.
        expect(viewModel.assetCategories(["Cat 2", "Cat 1"])).toEqual(["Cat 2", "Cat 1"]);
        expect(viewModel.assetCategories(["Cat 3", "Cat 4", "Cat 2"])).toEqual(["Cat 3", "Cat 2"]);

    });

    it("can return the category an asset falls into", function() {
        var project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2021-06-30T00:00:00Z',
            priorities:[
                {"category":"Cat 1", "priority":"Priority 1"},
                {"category":"Cat 1", "priority":"Priority 2"},
                {"category":"Cat 2", "priority":"Priority 3"},
                {"category":"Cat 3", "priority":"Priority 4"}
            ]
        };
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        expect(viewModel.assetCategory()).toBeUndefined();
        expect(viewModel.assetCategory("Not in list")).toBeUndefined();
        expect(viewModel.assetCategory("Priority 1")).toEqual("Cat 1");
        expect(viewModel.assetCategory("Priority 2")).toEqual("Cat 1");
        expect(viewModel.assetCategory("Priority 3")).toEqual("Cat 2");
        expect(viewModel.assetCategory("Priority 4")).toEqual("Cat 3");

    });

    it("Can manage MERI plan partnership information", function() {
        var project = {
            plannedStartDate: '2018-07-01T00:00:00Z',
            plannedEndDate: '2021-06-30T00:00:00Z',
            custom: {
                details: {
                    partnership: {
                        rows: [
                            {data1:'Partner 1', data2:'Advice', data3:'Research', otherOrganisationType:null},
                            {data1:'Partner 2', data2:'Partner', data3:'Other', otherOrganisationType:"Test"},
                        ]
                    }
                }
            }
        }
        var projectService = new ProjectService(project, {});

        var viewModel = new MERIPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'});

        expect(viewModel.meriPlan().partnership.rows().length).toEqual(2);
        var serialized = JSON.stringify(ko.mapping.toJS(viewModel.meriPlan().partnership));
        expect(JSON.parse(serialized)).toEqual(project.custom.details.partnership);

        viewModel.addPartnership();
        expect(viewModel.meriPlan().partnership.rows().length).toEqual(3);

        viewModel.removePartnership(viewModel.meriPlan().partnership.rows()[2]);
        var serialized = JSON.stringify(ko.mapping.toJS(viewModel.meriPlan().partnership));
        expect(JSON.parse(serialized)).toEqual(project.custom.details.partnership);

    });

    it('Can manage relationships between service target measures and outcomes', function () {

        let project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2023-06-30T00:00:00Z',
            custom:{details:meriPlanData},
            outputTargets: outputTargets
        };

        let projectService = new ProjectService(project, {})
        let viewModel = new MERIPlan(project, projectService, _.extend({targetMeasureUpdateLimit:0, useServiceOutcomesModel:true}, config));
        let meriPlan = viewModel.meriPlan();

        const results = meriPlan.serviceOutcomes.toJSON();
        expect(results.serviceIds).toEqual([1]);
        expect(results.targets).toEqual(project.outputTargets);

        meriPlan.baseline.rows()[1].relatedTargetMeasures(["3"]);
        viewModel.selectedServiceWatcher(); // Because this computed is throttled to 1/s we need to manually force it in the test
        expect(meriPlan.serviceOutcomes.outcomeTargets().length).toEqual(2);
        let newOutcomeTarget = meriPlan.serviceOutcomes.outcomeTargets()[1];
        expect(newOutcomeTarget.scoreId).toEqual("3")
        expect(newOutcomeTarget.serviceLabel).toEqual("Service 2");
        expect(newOutcomeTarget.scoreLabel).toEqual("Score 3");
        expect(newOutcomeTarget.orphaned()).toBeFalse();
        expect(newOutcomeTarget.outcomeTargets().length).toEqual(1);
        expect(newOutcomeTarget.outcomeTargets()[0].relatedOutcomes()).toEqual(["MT1"]);
        expect(newOutcomeTarget.availableOutcomes()).toEqual([]);

        meriPlan.threats.rows()[0].relatedOutcomes(["ST1", "MT1"]);
        meriPlan.threats.rows()[0].relatedTargetMeasures(["2"]);
        viewModel.selectedServiceWatcher();
        expect(meriPlan.serviceOutcomes.outcomeTargets().length).toEqual(3);
        newOutcomeTarget = meriPlan.serviceOutcomes.outcomeTargets()[2];
        expect(newOutcomeTarget.scoreId).toEqual("2")
        expect(newOutcomeTarget.serviceLabel).toEqual("Service 2");
        expect(newOutcomeTarget.scoreLabel).toEqual("Score 2");
        expect(newOutcomeTarget.orphaned()).toBeFalse();
        expect(newOutcomeTarget.outcomeTargets().length).toEqual(1);
        expect(newOutcomeTarget.outcomeTargets()[0].relatedOutcomes()).toEqual(["ST1", "MT1"]);

    });

    it('should check if the project is terminated', function () {
        let project = {
            status: "terminated"
        }
        let projectService = new ProjectService(project, {})
        let readOnlyMeriPlan = new ReadOnlyMeriPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'} )
        expect(readOnlyMeriPlan.meriPlanStatus().text).toEqual("This project is terminated")
    });

    it('should check if the project is completed', function () {
        let project = {
            status: "completed"
        }
        let projectService = new ProjectService(project, {})
        let readOnlyMeriPlan = new ReadOnlyMeriPlan(project, projectService, {useRlpTemplate:true, healthCheckUrl:'testing'} )
        expect(readOnlyMeriPlan.meriPlanStatus().text).toEqual("This project is completed")
    });

    it("should clear fields that are hidden by the MERI plan template before saving", function() {
        let project = {
            plannedStartDate:'2018-07-01T00:00:00Z',
            plannedEndDate:'2023-06-30T00:00:00Z',
            custom:{details:meriPlanData},
            outputTargets: outputTargets
        };

        let projectService = new ProjectService(project, {})
        let viewModel = new MERIPlan(project, projectService, _.extend({targetMeasureUpdateLimit:0, useServiceOutcomesModel:true}, config));
        let meriPlan = viewModel.meriPlan();

        meriPlan.indigenousInvolved("Yes");
        meriPlan.indigenousInvolvementType("Leading");
        meriPlan.indigenousInvolvementComment("Comment");

        let json = meriPlan.modelAsJSON();
        let js = JSON.parse(json).custom.details;

        expect(js.indigenousInvolved).toEqual("Yes");
        expect(js.indigenousInvolvementType).toEqual("Leading");
        expect(js.indigenousInvolvementComment).toBeNull();
        expect(js.supportsPriorityPlace).toBeFalsy()
        expect(js.supportedPriorityPlaces).toBeFalsy();


        meriPlan.indigenousInvolved("No");
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.indigenousInvolvementType).toBeNull();
        expect(js.indigenousInvolvementComment).toEqual("Comment");

        meriPlan.indigenousInvolved(null);
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.indigenousInvolvementType).toBeNull();
        expect(js.indigenousInvolvementComment).toBeNull();

        meriPlan.supportsPriorityPlace("Yes");
        meriPlan.supportedPriorityPlaces(["Place 1", "Place 2"]);
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.supportsPriorityPlace).toEqual("Yes")
        expect(js.supportedPriorityPlaces).toEqual(["Place 1", "Place 2"]);

        meriPlan.supportsPriorityPlace("No");
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.supportsPriorityPlace).toEqual("No")
        expect(js.supportedPriorityPlaces).toBeNull();

        meriPlan.supportsPriorityPlace("Yes");
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.supportsPriorityPlace).toEqual("Yes")
        expect(js.supportedPriorityPlaces).toEqual(["Place 1", "Place 2"]);

        meriPlan.supportsPriorityPlace(undefined);
        js = JSON.parse(meriPlan.modelAsJSON()).custom.details;
        expect(js.supportsPriorityPlace).toBeFalsy();
        expect(js.supportedPriorityPlaces).toBeNull();

    });

});
