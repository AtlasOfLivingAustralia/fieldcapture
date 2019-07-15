/*
   Script for handling Project MERI Plan
 */
function MERIPlan(project, projectService, config) {
    var self = this;
    ReadOnlyMeriPlan.apply(this, [project, projectService, config]);

    self.approvedPlans = ko.observableArray();

    var periods = self.periods;

    self.meriPlanUploadComplete = function (e, data) {
        if (data.result) {
            self.loadMeriPlan(data.result.meriPlan);

            var message = "<p><strong>Please check whether the following MERI Plan details have been uploaded correctly. " +
                "If not, you may manually update these fields in the form.  Some items may not upload if words are misspelt or contain additional spaces</strong></p>";

            if (data.result.messages) {
                _.each(data.result.messages || [], function(messages) {
                    message += "<p><strong>"+messages.heading+"</strong></p>";
                    message +="<ul><li>";
                    message += messages.messages.join("</li><li>");
                    message += "</li></ul>";
                });
            }
            message += "<p>Please check your data is correct before submitting your plan, in particular the investment priorities and services.</p>";

            bootbox.alert(message);
            $('.meri-upload-results').popover({container:'body', trigger:'hover'});

        } else {
            self.meriPlanUploadFailed(e, data);
        }
    };

    self.loadMeriPlan = function (meriPlan) {
        var projectInfo = {
            projectId:project.projectId,
            outputTargets:meriPlan.outputTargets,
            description:meriPlan.description,
            outcomes:project.outcomes,
            priorities:project.priorities
        };

        // Detach the old DetailsViewModel from the autosave / window listener routine.
        self.meriPlan().cancelAutosave();
        self.meriPlan(new DetailsViewModel(meriPlan, projectInfo, periods, self.risks, config));
        if (meriPlan.serviceTargets && meriPlan.serviceTargets.length > 0) {
            self.meriPlan().services.services([]); // Remove the empty row loaded by default.
        }
        _.each(meriPlan.serviceTargets, function(serviceTarget) {
            self.meriPlan().services.addServiceTarget(serviceTarget);
        });
        self.risks.load(meriPlan.risks);
        self.attachFloatingSave();

    };

    self.meriPlanUploadFailed = function () {
        var message = "An error occurred while uploading your MERI plan.";
        bootbox.alert(message);
    };

    // Configuration for the jquery file upload plugin used to upload MERI plans
    self.meriPlanUploadConfig = {
        url: config.meriPlanUploadUrl,
        forceIframeTransport: false,
        done: self.meriPlanUploadComplete,
        fail: self.meriPlanUploadFailed
    };

    self.isSubmittedOrApproved = function() {
        return projectService.isSubmittedOrApproved();
    };

    self.submitChanges = function () {
        var $declaration = $(config.meriSubmissionDeclarationSelector);
        if ($declaration[0]) {
            var declarationViewModel = {

                termsAccepted: ko.observable(false),
                submitReport: function () {
                    var declarationText = $declaration.find('declaration-text').text();
                    self.submitPlan(declarationText);
                }
            };
            ko.applyBindings(declarationViewModel, $declaration[0]);
            $declaration.modal({backdrop: 'static', keyboard: true, show: true}).on('hidden', function () {
                ko.cleanNode($declaration[0]);
            });

        } else {
            self.submitPlan();
        }
    };

    self.modifyPlan = function () {
        projectService.modifyPlan();
    };
    // approve plan and handle errors
    self.approvePlan = function () {

        var planApprovalModal = config.planApprovalModel || '#meri-plan-approval-modal';
        var $planApprovalModal = $(planApprovalModal);
        var planApprovalViewModel = {
            referenceDocument: ko.observable(),
            reason:ko.observable(),
            title:'Approve MERI Plan',
            dateApproved: ko.observable(new Date()).extend({simpleDate:true}),
            buttonText: 'Approve',
            submit:function(viewModel) {
                projectService.approvePlan({
                    referenceDocument:viewModel.referenceDocument(),
                    reason: viewModel.reason(),
                    dateApproved: viewModel.dateApproved()
                });
            }
        };
        ko.applyBindings(planApprovalViewModel, $planApprovalModal[0]);
        $planApprovalModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($planApprovalModal[0])});

    };
    // reject plan and handle errors
    self.rejectPlan = function () {
        projectService.rejectPlan();
    };

    self.finishCorrections = function () {
        projectService.finishCorrections();
    };

    self.submitPlan = function(declaration) {
        projectService.submitPlan(declaration);
    };


    self.meriPlanPDF = function() {
        var url = config.meriPlanPDFUrl;
        window.open(url,'meri-plan-report');
    };

    self.unlockPlanForCorrection = function () {

        var $declaration = $(config.declarationModalSelector);
        var declarationViewModel = {

            termsAccepted: ko.observable(false),
            submitReport: function () {
                var declarationText = $declaration.find('declaration-text').text();
                projectService.unlockPlan(declarationText);
            }
        };
        ko.applyBindings(declarationViewModel, $declaration[0]);
        $declaration.modal({backdrop: 'static', keyboard: true, show: true}).on('hidden', function () {
            ko.cleanNode($declaration[0]);
        });
    };

    self.isAgricultureProject.subscribe(function () {
        // When this attribute changes, hidden form sections become visible and need help attached.
        setTimeout(function () {
            $('.helphover').popover({animation: true, trigger: 'hover'});
        }, 1);

    });

    self.meriGrantManagerActionsTemplate = ko.pureComputed(function () {
        var template = 'editablePlanTmpl';
        if (projectService.isCompleted()) {
            template = projectService.isUnlockedForDataCorrection() ? 'unlockedProjectTmpl' : 'completedProjectTmpl';
        } else {
            if (projectService.isApproved()) {
                template = 'approvedPlanTmpl';
            } else if (projectService.isSubmitted()) {
                template = 'submittedPlanTmpl';
            }
        }
        return template;
    });

    self.saveProjectDetails = function () {
        projectService.saveProjectDetails();
    };

    self.cancelProjectDetailsEdits = function () {
        self.meriPlan().cancelAutosave();

        document.location.reload(true);
    };

    if (config.meriStorageKey) {
        var savedProjectCustomDetails = amplify.store(config.meriStorageKey);
        if (savedProjectCustomDetails) {
            var serverUpdate = project.custom.details.lastUpdated;
            var restored = JSON.parse(savedProjectCustomDetails);
            var localSave = amplify.store(config.meriStorageKey + "-updated");
            $('#restoredData').show();
            if (restored.custom) {
                project.custom.details = restored.custom.details;
            }
            if (restored.outputTargets) {
                project.outputTargets = restored.outputTargets;
            }
            if (restored.risks) {
                project.risks = restored.risks;
            }


            var message = "<span class='label label-warning'>Important</span><p>You have unsaved MERI Plan changes for this project.</p>";
            if (localSave && serverUpdate) {
                var saved = moment(localSave);
                message += "<p>Your unsaved changes were made on <b>" + saved.format("LLLL") + "</b></p><p>The changes we loaded from the server when this page was refreshed were made at <b>" + moment(serverUpdate).format("LLLL") + "</b></p>";
            }
            message += "<p>Please review the changes then press the 'Save changes' button at the bottom of the page if you want to keep your unsaved changes or the 'Cancel' button if you want to discard your changes.</p>";

            bootbox.alert(message);
        }
    }

    self.isProjectDetailsSaved = ko.computed(function () {
        return (project['custom']['details'].status == 'active');
    });


    self.projectThemes = $.map(config.themes, function (theme, i) {
        return theme.name;
    });
    self.projectThemes.push("MERI & Admin");
    self.projectThemes.push("Others");

    self.obligationOptions = ['Yes', 'No'];
    var defaultRiskAndThreats = ['Blow-out in cost of project materials', 'Changes to regional boundaries affecting the project area', 'Co-investor withdrawal / investment reduction',
        'Lack of delivery partner capacity', 'Lack of delivery partner / landholder interest in project activities', 'Organisational restructure / loss of corporate knowledge', 'Organisational risk (strategic, operational, resourcing and project levels)',
        'Seasonal conditions (eg. drought, flood, etc.)', 'Timeliness of project approvals processes',
        'Workplace health & safety (eg. Project staff and / or delivery partner injury or death)', 'Land use Conflict'];
    self.threatOptions = config.riskAndThreatTypes || defaultRiskAndThreats;
    self.organisations = ['Academic/research institution', 'Australian Government Department', 'Commercial entity', 'Community group',
        'Farm/Fishing Business', 'If other, enter type', 'Indigenous Organisation', 'Individual', 'Local Government', 'Other', 'Primary Industry group',
        'School', 'State Government Organisation', 'Trust'];
    self.protectedNaturalAssests = ['Natural/Cultural assets managed', 'Threatened Species', 'Threatened Ecological Communities',
        'Migratory Species', 'Ramsar Wetland', 'World Heritage area', 'Community awareness/participation in NRM', 'Indigenous Cultural Values',
        'Indigenous Ecological Knowledge', 'Remnant Vegetation', 'Aquatic and Coastal systems including wetlands', 'Not Applicable'];

    self.addBudget = function () {
        self.meriPlan().budget.rows.push(new BudgetRowViewModel({}, periods));
    };
    self.removeBudget = function (budget) {
        self.meriPlan().budget.rows.remove(budget);
    };

    self.addObjectives = function () {
        self.meriPlan().objectives.rows.push(new GenericRowViewModel());
    };
    self.addOutcome = function () {
        self.meriPlan().objectives.rows1.push(new OutcomeRowViewModel());
    };
    self.removeObjectives = function (row) {
        self.meriPlan().objectives.rows.remove(row);
    };
    self.removeObjectivesOutcome = function (row) {
        self.meriPlan().objectives.rows1.remove(row);
    };
    self.addNationalAndRegionalPriorities = function () {
        self.meriPlan().priorities.rows.push(new GenericRowViewModel());
    };
    self.removeNationalAndRegionalPriorities = function (row) {
        self.meriPlan().priorities.rows.remove(row);
    };

    self.addKEQ = function () {
        self.meriPlan().keq.rows.push(new GenericRowViewModel());
    };
    self.removeKEQ = function (keq) {
        self.meriPlan().keq.rows.remove(keq);
    };

    self.mediaOptions = [{id: "yes", name: "Yes"}, {id: "no", name: "No"}];

    self.addEvents = function () {
        self.meriPlan().events.push(new EventsRowViewModel());
    };
    self.removeEvents = function (event) {
        self.meriPlan().events.remove(event);
    };

    self.addPartnership = function () {
        self.meriPlan().partnership.rows.push(new GenericRowViewModel());
    };
    self.removePartnership = function (partnership) {
        self.meriPlan().partnership.rows.remove(partnership);
    };

    self.addSecondaryOutcome = function () {
        self.meriPlan().outcomes.secondaryOutcomes.push(new SingleAssetOutcomeViewModel());
    };
    self.removeSecondaryOutcome = function (outcome) {
        self.meriPlan().outcomes.secondaryOutcomes.remove(outcome);
    };
    self.addMidTermOutcome = function () {
        self.meriPlan().outcomes.midTermOutcomes.push(new OutcomeRowViewModel());
    };
    self.removeMidTermOutcome = function (outcome) {
        self.meriPlan().outcomes.midTermOutcomes.remove(outcome);
    };
    self.addShortTermOutcome = function () {
        self.meriPlan().outcomes.shortTermOutcomes.push(new OutcomeRowViewModel());
    };
    self.removeShortTermOutcome = function (outcome) {
        self.meriPlan().outcomes.shortTermOutcomes.remove(outcome);
    };



    self.saveAndSubmitChanges = function(){
        self.saveMeriPlan(true);
    };

    self.saveProjectDetails = function(){
        self.saveMeriPlan(false);
    };

    // Save project details
    self.saveMeriPlan = function(enableSubmit){
        var valid =  $('#project-details-validation').validationEngine('validate');

        var meriPlan = self.meriPlan();
        meriPlan.status('active');
        meriPlan.lastUpdated = new Date().toISOStringNoMillis();
        blockUIWithMessage("Saving MERI Plan...");
        meriPlan.saveWithErrorDetection(function() {

            if(enableSubmit) {
                if (valid) {
                    blockUIWithMessage("Submitting MERI Plan...");
                    self.submitChanges();
                }
                else {
                    $.unblockUI();
                    bootbox.alert("Your MERI plan cannot be submitted until all validation errors are resolved");
                }
            }
            else if (meriPlan.name() != project.name) {
                // If the name has changed we need to reload the page so the title is updated.
                blockUIWithMessage("MERI Plan Saved.  Reloading project...");
                window.location.reload();
            }
            else {
                $.unblockUI();
            }
        }, function() {
            $.unblockUI();
        });

    };

    var $floatingSave = $('#floating-save');
    var floatingSaveVisible = false;
    function checkSaveStatus(dirty) {
        if (dirty) {
            showFloatingSave();
        }
        else {
            hideFloatingSave();
        }
    }
    function hideFloatingSave() {
        if (floatingSaveVisible) {
            $floatingSave.slideUp(400);
            floatingSaveVisible = false;
        }
    }
    function showFloatingSave() {

        if (!floatingSaveVisible) {
            $floatingSave.slideDown(400);
            floatingSaveVisible = true;
        }
    }

    var saveSubscription;

    self.attachFloatingSave = function() {

        if (saveSubscription) {
            saveSubscription.dispose();
        }
        saveSubscription = self.meriPlan().dirtyFlag.isDirty.subscribe(checkSaveStatus);
        checkSaveStatus(self.meriPlan().dirtyFlag.isDirty());
    };

    self.detachValidation = function() {
        $('#project-details-validation').validationEngine('detach');
    };

    self.attachValidation = function() {
        $('#project-details-validation').validationEngine('attach', {autoPositionUpdate:true});
    };

    self.meriPlanHistoryVisible = ko.observable(false);
    self.meriPlanHistoryInitialised = ko.observable(false);
    self.toggleMeriPlanHistory = function() {
        if (!self.meriPlanHistoryInitialised()) {
            projectService.getApprovedMeriPlanHistory().done(function(approvedPlans) {
                self.approvedPlans(approvedPlans);
                self.meriPlanHistoryInitialised(true);
            });
        }
        self.meriPlanHistoryVisible(!self.meriPlanHistoryVisible());
    };

};

function ReadOnlyMeriPlan(project, projectService, config) {
    var self = this;
    if (!project.custom) {
        project.custom = {};
    }
    if (!project.custom.details) {
        project.custom.details = {};
    }

    self.periods = projectService.getBudgetHeaders(project);

    self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
    self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});

    self.meriPlanStatus = ko.pureComputed(function () {
        var result = {
            text: 'This plan is not yet approved',
            badgeClass: 'badge-warning'
        };
        if (projectService.isCompleted()) {
            if (projectService.isUnlockedForDataCorrection()) {
                result = {text: 'The plan has been unlocked for data correction', badgeClass: 'badge-warning'};
            } else {
                result = {text: 'This project is complete', badgeClass: 'badge-info'};
            }
        } else {
            if (projectService.isApproved()) {
                result = {text: 'This plan has been approved', badgeClass: 'badge-success'};
            } else if (projectService.isSubmitted()) {
                result = {text: 'This plan has been submitted for approval', badgeClass: 'badge-info'};
            }
        }
        return result;
    });

    var disableFlag = ko.observable(false);
    self.isProjectDetailsLocked = ko.computed(function () {
        return projectService.isProjectDetailsLocked();
    });
    var riskModel;
    if (config.useRlpTemplate) {
        disableFlag = self.isProjectDetailsLocked;
        riskModel = rlpRiskModel();
    } else {
        riskModel = meritRiskModel();
    }


    _.extend(self, new Risks(project.risks, riskModel, disableFlag, config.risksStorageKey));
    var details = new DetailsViewModel(project.custom.details, project, self.periods, self.risks, config);
    self.meriPlan = ko.observable(details);
    self.detailsLastUpdated = ko.observable(project.custom.details.lastUpdated).extend({simpleDate: true});
    self.isAgricultureProject = ko.computed(function () {
        var agricultureOutcomeStartIndex = 4;
        var selectedPrimaryOutcome = self.meriPlan().outcomes.primaryOutcome.description();
        var selectedOutcomeIndex = _.findIndex(project.outcomes, function (outcome) {
            return outcome.outcome == selectedPrimaryOutcome;
        });
        return selectedOutcomeIndex >= agricultureOutcomeStartIndex;
    });


};

function DetailsViewModel(o, project, budgetHeaders, risks, config) {
    var self = this;
    var period = budgetHeaders;
    if (config.useRlpTemplate) {
        self.services = new ServicesViewModel(o.serviceIds, config.services, project.outputTargets, period);
        self.description = ko.observable(project.description);
        self.name = ko.observable(project.name);
        self.projectEvaluationApproach = ko.observable(o.projectEvaluationApproach);
        // Initialise with 2 KEQ rows
        if (!o.keq) {
            o.keq = {
                rows: new Array(2)
            }
        }
    }
    self.status = ko.observable(o.status);
    self.obligations = ko.observable(o.obligations);
    self.policies = ko.observable(o.policies);
    self.caseStudy = ko.observable(o.caseStudy ? o.caseStudy : false);
    self.keq = new GenericViewModel(o.keq);
    self.objectives = new ObjectiveViewModel(o.objectives); // Used in original MERI plan template
    self.outcomes = new OutcomesViewModel(o.outcomes, {outcomes:project.outcomes, priorities:project.priorities}); // Use in new MERI plan template
    self.priorities = new GenericViewModel(o.priorities);
    self.implementation = new ImplementationViewModel(o.implementation);
    self.partnership = new GenericViewModel(o.partnership);
    self.lastUpdated = o.lastUpdated ? o.lastUpdated : moment().format();
    self.budget = new BudgetViewModel(o.budget, period);

    self.rationale = ko.observable(o.rationale);
    self.baseline = new GenericViewModel(o.baseline, ['baseline', 'method']);
    self.threats = new GenericViewModel(o.threats, ['threat', 'intervention']);

    var row = [];
    o.events ? row = o.events : row.push(ko.mapping.toJS(new EventsRowViewModel()));
    self.events = ko.observableArray($.map(row, function (obj, i) {
        return new EventsRowViewModel(obj);
    }));

    self.modelAsJSON = function () {
        var tmp = {};
        tmp.details = ko.mapping.toJS(self);
        if (tmp.details.outcomes && tmp.details.outcomes.selectableOutcomes) {
            delete tmp.details.outcomes.selectableOutcomes; // This is for dropdown population and shouldn't be saved.
        }

        var jsData = {"custom": tmp};

        // For compatibility with other projects, move the targets to the top level of the data structure, if they
        // are in the MERI plan.
        if (config.useRlpTemplate) {
            var serviceData = tmp.details.services.toJSON();
            jsData.risks = ko.mapping.toJS(risks);

            jsData.outputTargets = serviceData.targets;
            jsData.description = self.description();
            jsData.name = self.name();
            tmp.details.serviceIds = serviceData.serviceIds;
            delete tmp.details.services;
        }

        var json = JSON.stringify(jsData, function (key, value) {
            return value === undefined ? "" : value;
        });
        return json;
    };

    autoSaveModel(
        self,
        config.projectUpdateUrl,
        {
            storageKey:config.meriStorageKey || 'meriPlan-'+project.projectId,
            autoSaveIntervalInSeconds:config.autoSaveIntervalInSeconds || 60,
            restoredDataWarningSelector:'#restoredData',
            resultsMessageSelector:'.save-details-result-placeholder',
            timeoutMessageSelector:'#timeoutMessage',
            errorMessage:"Failed to save MERI Plan: ",
            successMessage: 'MERI Plan saved',
            preventNavigationIfDirty:true,
            defaultDirtyFlag:ko.dirtyFlag,
            healthCheckUrl:config.healthCheckUrl
        });
};

/**
 * The view model responsible for managing the selection of project services and their output targets.
 *
 * @param serviceIds Array of the ids of the current services being used by the project
 * @param allServices Array containing the full list of available services
 * @param outputTargets The current project targets
 * @param periods An array of periods, each of which require a target to be set
 */
function ServicesViewModel(serviceIds, allServices, outputTargets, periods) {
    var self = this;

    allServices = _.sortBy(allServices || [], function (service) {
        return service.name
    });

    outputTargets = outputTargets || [];

    var ServiceTarget = function (service, score) {
        var target = this;

        target.serviceId = ko.observable(service ? service.id : null);
        target.scoreId = ko.observable(score ? score.scoreId : null);

        target.target = ko.observable();

        target.periodTargets = _.map(periods, function (period) {
            return {period: period, target: ko.observable(0)}
        });

        target.minimumTargetsValid = ko.pureComputed(function () {
            var sum = 0;
            _.each(target.periodTargets, function (periodTarget) {
                if (Number(periodTarget.target())) {
                    sum += Number(periodTarget.target());
                }
            });
            return sum <= (target.target() || 0) ? 'valid' : '';
        });

        target.updateTargets = function () {

            // Don't auto-update the target if one has already been specified.
            if (target.target()) {
                return;
            }
            var currentTarget = _.find(outputTargets, function (outputTarget) {
                return target.scoreId() == outputTarget.scoreId;
            });
            _.each(periods, function (period, i) {
                var periodTarget = 0;
                if (currentTarget) {
                    var currentPeriodTarget = _.find(currentTarget.periodTargets || [], function (periodTarget) {
                        return periodTarget.period == period;
                    }) || {};
                    periodTarget = currentPeriodTarget.target;
                }
                target.periodTargets[i].target(periodTarget || 0);
            });
            target.target(currentTarget ? currentTarget.target || 0 : 0);
        };

        target.toJSON = function () {
            return {
                target: target.target(),
                scoreId: target.scoreId(),
                periodTargets: ko.toJS(target.periodTargets)
            };
        };

        target.service = function () {
            return _.find(allServices, function (service) {
                return service.id == target.serviceId();
            })
        };

        target.score = function () {
            var score = null;
            var service = target.service();
            if (service) {
                score = _.find(service.scores, function (score) {
                    return score.scoreId == target.scoreId();
                });
            }
            return score;
        };

        target.selectableScores = ko.pureComputed(function () {
            if (!target.serviceId()) {
                return [];
            }
            var availableScores = self.availableScoresForService(target.service());
            if (target.scoreId()) {
                availableScores.push(target.score());
            }

            return _.sortBy(availableScores, function (score) {
                return score.label
            });
        });
        target.selectableServices = ko.pureComputed(function () {
            var services = self.availableServices();
            if (target.serviceId()) {
                var found = _.find(services, function (service) {
                    return service.id == target.serviceId();
                });
                if (!found) {
                    services.push(target.service());
                }

            }
            return services;

        });

        target.serviceId.subscribe(function () {
            target.scoreId(null);
        });

        target.scoreId.subscribe(function () {
            target.updateTargets();
        });

        target.updateTargets();
    };

    self.periods = periods;

    self.services = ko.observableArray();
    self.addService = function () {
        self.services.push(new ServiceTarget());
    };

    /**
     * Method to programatically add a pre-populated service target - used for the MERI plan load.
     * @param serviceTarget example:
     *  {
            serviceId:1,
            scoreId:1,
            target:100,
            periodTargets:[
                {period:'2018/2019', target:1},
                {period:'2019/2020', target:2},
                {period:'2020/2021', target:2}
            ]
        }
     * @returns {ServiceTarget}
     */
    self.addServiceTarget = function(serviceTarget) {
        var serviceTargetRow = new ServiceTarget();
        serviceTargetRow.serviceId(serviceTarget.serviceId);
        serviceTargetRow.scoreId(serviceTarget.scoreId);
        serviceTargetRow.target(serviceTarget.target);
        _.each(periods || [], function(period) {

            var periodTarget = _.find(serviceTargetRow.periodTargets || [], function(pt) {
                return pt.period == period;
            });
            var periodTargetValue = _.find(serviceTarget.periodTargets || [], function(pt) {
                return pt.period == period;
            });
            if (periodTarget && periodTargetValue) {
                periodTarget.target(periodTargetValue.target);
            }

        });

        self.services.push(serviceTargetRow);
        return serviceTargetRow;
    };

    self.removeService = function (service) {
        self.services.remove(service);
    };

    /**
     * Once all of the scores for a service have been assigned targets, don't allow new rows to select that score.
     */
    self.availableServices = function () {
        return _.reject(allServices, function (service) {
            return self.availableScoresForService(service).length == 0;
        });
    };

    self.availableScoresForService = function (service) {
        if (!service || !service.scores) {
            return [];
        }
        return _.reject(service.scores, function (score) {
            return _.find(self.services(), function (target) {
                return target.score() ? target.score().scoreId == score.scoreId : false;
            })
        });
    };


    // Populate the model from existing data.
    for (var i = 0; i < outputTargets.length; i++) {

        var score = null;
        var service = _.find(allServices, function (service) {
            return _.find(service.scores, function (serviceScore) {
                if (serviceScore.scoreId == outputTargets[i].scoreId) {
                    score = serviceScore;
                }
                ;
                return score;
            })
        });

        self.services.push(new ServiceTarget(service, score));
    }
    if (!outputTargets || outputTargets.length == 0) {
        self.addService();
    }
    self.outputTargets = function () {
        var outputTargets = [];
        _.each(self.services(), function (target) {
            outputTargets.push(target.toJSON());
        });
        return outputTargets;
    };

    self.toJSON = function () {
        return {
            serviceIds: _.unique(_.map(self.services(), function (service) {
                return service.serviceId()
            })),
            targets: self.outputTargets()
        }
    };
};




function GenericViewModel(o, propertyNames) {
    var self = this;
    if (!o) o = {};
    self.description = ko.observable(o.description);
    self.newRow = function (row) {
        return new GenericRowViewModel(row, propertyNames)
    };
    var row = [];
    o.rows ? row = o.rows : row.push(ko.mapping.toJS(self.newRow()));


    self.rows = ko.observableArray($.map(row, function (obj, i) {
        return self.newRow(obj);
    }));
    self.addRow = function () {
        self.rows.push(self.newRow());
    };
    self.removeRow = function (row) {
        self.rows.remove(row);
    };

};

function GenericRowViewModel(o, propertyNames) {
    var self = this;
    if (!o) o = {};
    if (!propertyNames || propertyNames.length == 0) {
        propertyNames = ['data1', 'data2', 'data3'];
    }
    for (var i = 0; i < propertyNames.length; i++) {
        self[propertyNames[i]] = ko.observable(o[propertyNames[i]]);
    }
};

function ObjectiveViewModel(o) {
    var self = this;
    if (!o) o = {};

    var row = [];
    o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
    self.rows = ko.observableArray($.map(row, function (obj, i) {
        return new GenericRowViewModel(obj);
    }));

    var row1 = [];
    o.rows1 ? row1 = o.rows1 : row1.push(ko.mapping.toJS(new OutcomeRowViewModel()));
    self.rows1 = ko.observableArray($.map(row1, function (obj, i) {
        return new OutcomeRowViewModel(obj);
    }));
};

/**
 * Categories project outcomes into primary, secondary, mid-term and short-term outcomes.
 * @param outcomes existing outcome data, if any.
 * @param config {outcomes:<all available outcomes>, priorities:<priorities selectable by this project>}
 */
function OutcomesViewModel(outcomes, config) {
    var self = this;
    if (!outcomes) {
        outcomes = {};
    }
    var outcomeToViewModel = function (outcome) {
        return new OutcomeRowViewModel(outcome);
    };

    if (!outcomes.primaryOutcome) {
        outcomes.primaryOutcome = {
            description: null, asset: ''
        };
    }
    if (!outcomes.shortTermOutcomes) {
        outcomes.shortTermOutcomes = [{
            description: null, assets: []
        }];
    }
    if (!outcomes.secondaryOutcomes) {
        outcomes.secondaryOutcomes = [{
            description: null, asset: ''
        }]
    }

    self.selectableOutcomes = _.map(config.outcomes, function (outcome) {
        return outcome.outcome;
    });

    self.outcomePriorities = function (outcomeText) {

        var outcome = _.find(config.outcomes, function (outcome) {
            return outcome.outcome == outcomeText;
        });
        if (!outcome) {
            return [];
        }
        var priorities = [];
        _.each(config.priorities, function (priority) {
            _.each(outcome.priorities, function (outcomePriority) {
                if (priority.category == outcomePriority.category) {
                    priorities.push(priority.priority);
                }
            });

        });
        return priorities;
    };

    self.primaryOutcome = new SingleAssetOutcomeViewModel(outcomes.primaryOutcome);
    self.secondaryOutcomes = ko.observableArray(_.map(outcomes.secondaryOutcomes || [], function (outcome) {
        return new SingleAssetOutcomeViewModel(outcome)
    }));
    self.shortTermOutcomes = ko.observableArray(_.map(outcomes.shortTermOutcomes || [], function (outcome) {
        return new SingleAssetOutcomeViewModel(outcome)
    }));
    self.midTermOutcomes = ko.observableArray(_.map(outcomes.midTermOutcomes || [], outcomeToViewModel));

}


function ImplementationViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.description = ko.observable(o.description);
};

function EventsRowViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.name = ko.observable(o.name);
    self.description = ko.observable(o.description);
    self.media = ko.observable(o.media);
    self.type = ko.observable(o.type || '');
    self.funding = ko.observable(o.funding).extend({numericString: 0}).extend({currency: true});
    self.scheduledDate = ko.observable(o.scheduledDate).extend({simpleDate: false});
    self.grantAnnouncementDate = ko.observable(o.grantAnnouncementDate);
};

function OutcomeRowViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.description = ko.observable(o.description);
    if (!o.assets) o.assets = [];
    self.assets = ko.observableArray(o.assets);
};

function SingleAssetOutcomeViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.description = ko.observable(o.description);
    if (!o.assets || !_.isArray(o.assets)) o.assets = [];
    self.assets = ko.observableArray(o.assets);

    self.asset = ko.pureComputed({
        read: function () {
            if (self.assets().length == 0) {
                return undefined;
            }
            return self.assets()[0];
        },
        write: function (value) {
            self.assets([value]);
        },
        owner: self
    });
    self.description.subscribe(function () {
        self.assets([]);
    });
    self.toJSON = function () {
        return {
            description: self.description(),
            assets: self.assets()
        }
    };
};

function BudgetViewModel(o, period) {
    var self = this;
    if (!o) o = {};

    self.overallTotal = ko.observable(0.0);

    var headerArr = [];
    for (i = 0; i < period.length; i++) {
        headerArr.push({"data": period[i]});
    }
    self.headers = ko.observableArray(headerArr);

    var row = [];
    o.rows ? row = o.rows : row.push(ko.mapping.toJS(new BudgetRowViewModel({}, period)));
    self.rows = ko.observableArray($.map(row, function (obj, i) {
        // Headers don't match with previously stored headers, adjust rows accordingly.
        if (o.headers && period && o.headers.length != period.length) {
            var updatedRow = [];
            for (i = 0; i < period.length; i++) {
                var index = -1;

                for (j = 0; j < o.headers.length; j++) {
                    if (period[i] == o.headers[j].data) {
                        index = j;
                        break;
                    }
                }
                updatedRow.push(index != -1 ? obj.costs[index] : 0.0)
                index = -1;
            }
            obj.costs = updatedRow;
        }

        return new BudgetRowViewModel(obj, period);
    }));

    self.overallTotal = ko.computed(function () {
        var total = 0.0;
        ko.utils.arrayForEach(this.rows(), function (row) {
            if (row.rowTotal()) {
                total += parseFloat(row.rowTotal());
            }
        });
        return total;
    }, this).extend({currency: {}});

    var allBudgetTotal = [];
    for (i = 0; i < period.length; i++) {
        allBudgetTotal.push(new BudgetTotalViewModel(this.rows, i));
    }
    self.columnTotal = ko.observableArray(allBudgetTotal);

    self.addRow = function () {
        self.rows.push(new BudgetRowViewModel({}, period));
    }
};

function BudgetTotalViewModel(rows, index) {
    var self = this;
    self.data = ko.computed(function () {
        var total = 0.0;
        ko.utils.arrayForEach(rows(), function (row) {
            if (row.costs()[index]) {
                total += parseFloat(row.costs()[index].dollar());
            }
        });
        return total;
    }, this).extend({currency: {}});
};


function BudgetRowViewModel(o, period) {
    var self = this;
    if (!o) o = {};
    self.shortLabel = ko.observable(o.shortLabel);
    self.description = ko.observable(o.description);

    var arr = [];
    for (i = 0; i < period.length; i++)
        arr.push(ko.mapping.toJS(new FloatViewModel()));

    //Incase if timeline is generated.
    if (o.costs && o.costs.length != arr.length) {
        o.costs = arr;
    }
    o.costs ? arr = o.costs : arr;
    self.costs = ko.observableArray($.map(arr, function (obj, i) {
        return new FloatViewModel(obj);
    }));

    self.rowTotal = ko.computed(function () {
        var total = 0.0;
        ko.utils.arrayForEach(this.costs(), function (cost) {
            if (cost.dollar())
                total += parseFloat(cost.dollar());
        });
        return total;
    }, this).extend({currency: {}});
};

function FloatViewModel(o) {
    var self = this;
    if (!o) o = {};
    self.dollar = ko.observable(o.dollar ? o.dollar : 0.0).extend({numericString: 2}).extend({currency: {}});
};

function limitText(field, maxChar) {
    $(field).attr('maxlength', maxChar);
}

var EditAnnouncementsViewModel = function (grid, events) {
    var self = this;
    self.modifiedProjects = ko.observableArray([]);
    self.events = events.slice();

    var eventProperties = ['eventName', 'eventDescription', 'funding', 'eventDate', 'grantAnnouncementDate', 'eventType'];
    var projectProperties = ['projectId', 'grantId', 'name'];
    var properties = projectProperties.concat(eventProperties);

    function copyEvent(event) {
        var copy = {};
        for (var i = 0; i < eventProperties.length; i++) {
            copy[eventProperties[i]] = event[eventProperties[i]] || '';
        }
        return copy;
    }

    function compareEvents(event1, event2) {

        for (var i = 0; i < properties.length; i++) {
            if (!compare(event1[properties[i]], event2[properties[i]])) {
                return false;
            }
        }
        return true;
    }

    /** Compares 2 strings, treating falsely as equal */
    function compare(s1, s2) {
        return (!s1 && !s2) || (s1 == s2);
    }

    function sortEvent(event1, event2) {
        var returnValue = 0;
        var propertyIndex = 0;
        while (returnValue == 0) {
            returnValue = sortByProperty(event1, event2, properties[propertyIndex]);
            propertyIndex++;
        }
        return returnValue;
    }

    function sortByProperty(event1, event2, property) {
        if (event1[property] > event2[property]) {
            return 1;
        }
        if (event2[property] > event1[property]) {
            return -1;
        }
        return 0;
    }

    function compareProjectEvents(projectEvents1, projectEvents2) {

        if (projectEvents1.length != projectEvents2.length) {
            return false;
        }

        for (var i = 0; i < projectEvents1.length; i++) {
            if (!compareEvents(projectEvents1[i], projectEvents2[i])) {
                return false;
            }
        }
        return true;
    }

    self.showBulkUploadOptions = ko.observable(false);
    self.toggleBulkUploadOptions = function () {
        self.showBulkUploadOptions(!self.showBulkUploadOptions());
    };

    self.dirtyFlag = {
        isDirty: ko.computed(function () {
            return self.modifiedProjects().length > 0;
        }),
        reset: function () {
            self.modifiedProjects([]);
        }
    };

    function projectModified(projectId) {
        if (self.modifiedProjects().indexOf(projectId) < 0) {
            self.modifiedProjects.push(projectId);
        }
    }

    function revalidateAll() {
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();
    }

    self.findProjectIdForEvent = function (event) {
        for (var i = 0; i < events.length; i++) {
            if (events[i].grantId == event.grantId && events[i].name == event.name) {
                return events[i].projectId;
            }
        }
        return null;
    };

    /**
     * Replaces all of the existing events with the supplied array.
     */
    self.updateEvents = function (newEvents) {
        var i;

        for (i = 0; i < newEvents.length; i++) {
            var projectId = self.findProjectIdForEvent(newEvents[i]);
            if (projectId) {
                newEvents[i].projectId = projectId;
            } else {
                newEvents[i].grantId = undefined;
                newEvents[i].name = undefined;
            }
        }

        var groupedExistingEvents = {};
        var existingProjectIds = [];
        for (i = 0; i < events.length; i++) {
            if (!groupedExistingEvents[events[i].projectId]) {
                groupedExistingEvents[events[i].projectId] = [];
                existingProjectIds.push(events[i].projectId);
            }
            groupedExistingEvents[events[i].projectId].push(events[i]);
        }

        var groupedNewEvents = {};
        var newProjectIds = [];
        for (i = 0; i < newEvents.length; i++) {
            if (!groupedNewEvents[newEvents[i].projectId]) {
                groupedNewEvents[newEvents[i].projectId] = [];
                newProjectIds.push(newEvents[i].projectId);
            }
            groupedNewEvents[newEvents[i].projectId].push(newEvents[i]);
        }

        for (i = 0; i < existingProjectIds.length; i++) {
            if ((newProjectIds.indexOf(existingProjectIds[i]) < 0) ||
                (!compareProjectEvents(groupedExistingEvents[existingProjectIds[i]], groupedNewEvents[existingProjectIds[i]]))) {
                projectModified(existingProjectIds[i]);
            }
        }

        self.events = newEvents;
        grid.setData(self.events);
        revalidateAll();

        self.validate();
    };

    self.modelAsJSON = function () {
        var projects = [];
        for (var i = 0; i < self.modifiedProjects().length; i++) {
            var projectAnnouncements = {projectId: self.modifiedProjects()[i], announcements: []};
            for (var j = 0; j < self.events.length; j++) {
                if (self.events[j].projectId == self.modifiedProjects()[i]) {
                    projectAnnouncements.announcements.push(copyEvent(self.events[j]));
                }

            }
            projects.push(projectAnnouncements);
        }
        return JSON.stringify(projects);
    };

    self.cancel = function () {
        self.cancelAutosave();
        document.location.href = fcConfig.organisationViewUrl;
    };

    self.save = function () {
        Slick.GlobalEditorLock.commitCurrentEdit();
        if (self.validate()) {
            self.saveWithErrorDetection(function () {
                document.location.href = fcConfig.organisationViewUrl;
            });
        }
    };

    self.insertRow = function (index) {
        var event = events[index];
        projectModified(event.projectId);
        self.events.splice(index + 1, 0, {projectId: event.projectId, name: event.name, grantId: event.grantId});
        revalidateAll();
    };

    self.deleteRow = function (index) {
        bootbox.confirm("Are you sure you want to delete this announcement?", function (ok) {
            if (ok) {
                var deleted = self.events.splice(index, 1);
                projectModified(deleted[0].projectId);
                revalidateAll();
            }
        });
    };

    self.addRow = function (item, args) {
        self.events.push(item);
        if (item.name) {
            self.projectNameEdited(item, args);
        }
        revalidateAll();
    };

    self.eventEdited = function (event, args) {
        projectModified(event.projectId);
        if (args.cell == 1) {
            self.projectNameEdited(event, args);
            grid.invalidateRow(args.row);
            grid.render();
        }

    };

    self.projectNameEdited = function (event, args) {
        // The project has been changed.
        for (var i = 0; i < self.events.length; i++) {
            if (self.events[i].name == event.name) {
                event.projectId = self.events[i].projectId;
                event.grantId = self.events[i].grantId;
                projectModified(event.projectId); // Both the previous and new projects have been modified.
                break;
            }
        }
    };

    self.validate = function () {
        var valid = true;
        var firstErrorPos = 0;
        var columns = grid.getColumns();
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].validationRules) {
                var validationFunctions = parseValidationString(columns[i].validationRules);

                for (var project = 0; project < self.modifiedProjects().length; project++) {
                    for (var j = 0; j < self.events.length; j++) {
                        if (self.events[j].projectId == self.modifiedProjects()[project]) {
                            var field = columns[i]['field'];
                            var value = self.events[j][field];

                            for (var k = 0; k < validationFunctions.length; k++) {
                                var result = validationFunctions[k](field, value);
                                if (!result.valid) {
                                    valid = false;
                                    var columnIdx = columnIndex(result.field, grid.getColumns());
                                    var node = grid.getCellNode(j, columnIdx);
                                    if (node) {
                                        var errorPos = $(node).offset().top;
                                        firstErrorPos = Math.min(firstErrorPos, errorPos);
                                        validationSupport.addPrompt($(node), 'event' + j, result.field, result.error);
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
        if (!valid) {
            window.scroll(0, firstErrorPos);
        }
        return valid;
    };

    // Attach event handlers to the grid
    grid.onAddNewRow.subscribe(function (e, args) {
        var item = args.item;
        self.addRow(item, args);
    });
    grid.onCellChange.subscribe(function (e, args) {
        self.eventEdited(args.item, args);
    });

    grid.onClick.subscribe(function (e) {
        if ($(e.target).hasClass('add-row')) {
            self.insertRow(grid.getCellFromEvent(e).row);
        } else if ($(e.target).hasClass('remove-row')) {
            self.deleteRow(grid.getCellFromEvent(e).row);
        }
    });
    grid.onSort.subscribe(function (e, args) {
        var cols = args.sortCols;
        self.events.sort(function (dataRow1, dataRow2) {
            for (var i = 0, l = cols.length; i < l; i++) {
                var field = cols[i].sortCol.field;
                var sign = cols[i].sortAsc ? 1 : -1;
                var value1 = dataRow1[field], value2 = dataRow2[field];
                var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
            }
            return 0;
        });
        grid.invalidate();
        grid.render();
    });
    grid.setData(self.events);
};

var Report = function (report) {
    var now = new Date().toISOStringNoMillis();

    var self = this;
    var fromDate = report.fromDate;
    var toDate = report.toDate;
    var dueDate = report.dueDate;
    var name = report.name;
    var description = report.description;

    self.name = name;
    self.toDate = report.toDate;
    self.fromDate = report.fromDate;
    self.reportId = report.reportId;

    self.isSubmitted = function () {
        return report.publicationStatus == 'pendingApproval';
    };

    self.isApproved = function () {
        return report.publicationStatus == 'published';
    };


    self.isCurrent = function () {

        return report.publicationStatus != 'pendingApproval' &&
            report.publicationStatus != 'published' &&
            fromDate < now && toDate >= now;
    };

    self.isDue = function () {
        return report.activityCount > 0 && report.publicationStatus != 'pendingApproval' &&
            report.publicationStatus != 'published' &&
            toDate < now && (!dueDate || dueDate >= now); // Due date is temporarily optional.
    };

    self.isOverdue = function () {
        return report.activityCount > 0 && report.publicationStatus != 'pendingApproval' &&
            report.publicationStatus != 'published' &&
            dueDate && dueDate < now;
    };

    self.status = function () {
        if (self.isOverdue()) {
            return name + ' overdue by ' + Math.round(self.overdueDelta()) + ' day(s)';
        }
        if (self.isDue()) {
            var status = name + ' due';
            if (dueDate) {
                status += ' on ' + convertToSimpleDate(report.dueDate, false);
            }
            return status;
        }
        if (self.isSubmitted()) {
            return name + ' submitted for approval';
        }

        if (self.isCurrent()) {
            return name + ' in progress';
        }
        if (report.activityCount == 0) {
            return name + ' has no activities to report';
        }

        return '';
    };

    self.submissionDelta = function () {
        if (!dueDate) {
            return 0;
        }
        var submitted = moment(report.dateSubmitted);
        var due = moment(report.dueDate);

        return submitted.diff(due, 'days');

    };

    self.overdueDelta = function () {
        if (!dueDate) {
            return 0;
        }
        var due = moment(report.dueDate);

        return moment(now).diff(due, 'days');

    };

    self.getHistory = function () {
        var result = '';
        for (var i = 0; i < report.statusChangeHistory.length; i++) {
            result += '<li>' + report.name + ' ' + report.statusChangeHistory[i].status + ' by ' + report.statusChangeHistory[i].changedBy + ' on ' + convertToSimpleDate(report.statusChangeHistory[i].dateChanged, false);
        }

        return result;
    };

};
