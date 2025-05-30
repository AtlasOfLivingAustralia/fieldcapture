/*
   Script for handling Project MERI Plan
 */
function MERIPlan(project, projectService, config) {
    var self = this;

    if (config.hasAdminPermission && config.meriStorageKey && project.custom && project.custom.details) {
        var savedProjectCustomDetails = amplify.store(config.meriStorageKey);
        if (savedProjectCustomDetails) {
            var serverUpdate = project.custom.details.lastUpdated;
            var restored = JSON.parse(savedProjectCustomDetails);
            var localSave = amplify.store(config.meriStorageKey + "-updated");
            $('#restoredData').show();

            if (!projectService.isProjectDetailsLocked()) {
                if (restored.custom) {
                    project.custom.details = restored.custom.details;
                }
                if (restored.outputTargets) {
                    project.outputTargets = restored.outputTargets;
                }

                var message = "<span class='unsaved-changes label label-warning'>Important</span><p>You have unsaved MERI Plan changes for this project.</p>";
                if (localSave && serverUpdate) {
                    var saved = moment(localSave);
                    message += "<p>Your unsaved changes were made on <b>" + saved.format("LLLL") + "</b></p><p>The changes we loaded from the server when this page was refreshed were made at <b>" + moment(serverUpdate).format("LLLL") + "</b></p>";
                }
                message += "<p>Please review the changes then press the 'Save changes' button at the bottom of the page if you want to keep your unsaved changes or the 'Cancel' button if you want to discard your changes.</p>";

                bootbox.alert(message);
            }
            else {
                amplify.store(config.meriStorageKey, null);
                var message = "The MERI plan for this project has been locked for editing by another user.  Any unsaved changes you have made have been discarded.";
                bootbox.alert(message);
            }
        }
    }
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
        self.meriPlan(new DetailsViewModel(meriPlan, projectInfo, periods, self.risks, self.allTargetMeasures, self.selectedTargetMeasures, config));
        if (meriPlan.serviceTargets && meriPlan.serviceTargets.length > 0) {
            self.meriPlan().services.services([]); // Remove the empty row loaded by default.
        }
        _.each(meriPlan.serviceTargets, function(serviceTarget) {
            self.meriPlan().services.addServiceTarget(serviceTarget);
        });
        self.risks.load(meriPlan.risks);
        self.applyAutoSave();
        self.attachFloatingSave();

    };

    self.meriPlanUploadFailed = function () {
        var message = "An error occurred while uploading your MERI plan.";
        bootbox.alert(message);
    };

    // Configuration for the jquery file upload plugin used to upload MERI plans
    self.meriPlanUploadConfig = {
        url: config.meriPlanUploadUrl,
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
            $declaration.modal({backdrop: 'static', keyboard: true, show: true}).on('hidden.bs.modal', function () {
                $.unblockUI()
                ko.cleanNode($declaration[0]);
            });

        } else {
            self.submitPlan();
        }
    };

    self.canModifyPlan = config.canModifyMeriPlan;
    self.modifyPlan = function () {
        if (!self.canModifyPlan) {
            return;
        }
        projectService.modifyPlan();
    };
    self.canEditStartDate = config.editProjectStartDate;
    self.externalIds = config.externalIds || [];
    self.externalIdTypes = PROJECT_EXTERNAL_ID_TYPES;
    self.validateExternalIds = function() {
        return projectService.validateExternalIds(ko.mapping.toJS(self.externalIds));
    };

    self.canApproveMeriPlan = ko.computed(function() {
        // validateExternalIds returns a non-null value if the validation fails (it contains
        // the error message to display), this is a jquery-validation-engine thing.
        return self.plannedStartDate() && !self.validateExternalIds();
    })

    // approve plan and handle errors
    self.approvePlan = function () {
        var message;
        var startDateSelector = "#project-details-validation input[data-bind*=plannedStartDate]";
        var valid =  $('#project-details-validation').validationEngine('validate');
        if (self.plannedStartDate() >= project.plannedEndDate) {
            message =  "The project start date must be before the end date";
        }
        if (message || !valid) {
            setTimeout(function() {
                $(startDateSelector).validationEngine("showPrompt", message, "topRight", true);
            }, 100);

        } else {
            if (config.requireMeriApprovalReason) {
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
                        }, {
                            externalIds: ko.mapping.toJS(self.externalIds),
                            plannedStartDate: self.plannedStartDate()
                        });
                    }
                };
                ko.applyBindings(planApprovalViewModel, $planApprovalModal[0]);
                $planApprovalModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden.bs.modal', function() {ko.cleanNode($planApprovalModal[0])});
            }
            else {
                var data = {
                    externalIds: ko.mapping.toJS(self.externalIds),
                    plannedStartDate: self.plannedStartDate()
                }
                projectService.approvePlan({dateApproved:convertToIsoDate(new Date())}, data)
            }
        }

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

    /** If a project is active (as opposed to completed or terminated) it means the MERI plan has been
     * approved at least once.  If the plan is currently approved there is no point comparing to itself.
     * @returns {*|boolean}
     */
    self.canCompareWithLatestApprovedPlan = function() {
        return projectService.isActive() && !projectService.isApproved();
    }

    self.meriPlanChanges = function() {
        var url = config.meriPlanChangesUrl;
        window.open(url,'meri-planchanges-report');
    };

    self.isPlanEditable = function() {
        return projectService.isEditable();
    }

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
        if (projectService.isCompletedOrTerminated()) {
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
        self.unlockPlanAndReload("Reloading project...");
    };

    self.isProjectDetailsSaved = ko.computed(function () {
        return (project['custom']['details'].status == 'active');
    });


    self.projectThemes = $.map(config.themes, function (theme, i) {
        return theme.name;
    });
    self.projectThemes.push("MERI & Admin");
    self.projectThemes.push("Others");

    /**
     * Returns a list of program priorities/assets that match the supplied category or categories.
     * @param category a string or array of strings of categories to match.  If not supplied all priorities will be returned.
     * @returns {Array}
     */
    self.priorityAssets = function(category) {
        var matchingPriorities = _.filter(project.priorities || [], function (priority) {
            if (_.isArray(category)) {
                return _.find(category, function(cat) { return priority.category == cat; });
            } else {
                return (!category || category == priority.category);
            }
        });
        return _.map(matchingPriorities, function(priority) {
            return priority.priority;
        });
    };

    /**
     * Returns a list of distinct asset categories available for this project.
     * Returns a list of distinct asset categories available for this project.
     * @param filter (optional) if supplied, only categories in this array will be returned.
     */
    self.assetCategories = function(filter) {
        var categories = _.map(project.priorities || [], function(priority) {
            return priority.category;
        });
        categories = _.uniq(categories);
        if (filter) {
            categories = _.filter(filter, function(category) {
                return categories.indexOf(category) >= 0;
            });
        }
        return categories;
    }

    /**
     * Returns the asset category assoociated with the supplied asset.
     * @param asset the asset to check.
     * @returns {*}
     */
    self.assetCategory = function(asset) {
        var result = _.find(project.priorities || [], function(priority) {
            return priority.priority == asset;
        });
        return result && result.category;
    };

    self.programObjectives = config.programObjectives || [];

    self.obligationOptions = ['Yes', 'No'];
    var defaultRiskAndThreats = ['Blow-out in cost of project materials', 'Changes to regional boundaries affecting the project area', 'Co-investor withdrawal / investment reduction',
        'Lack of delivery partner capacity', 'Lack of delivery partner / landholder interest in project activities', 'Organisational restructure / loss of corporate knowledge', 'Organisational risk (strategic, operational, resourcing and project levels)',
        'Seasonal conditions (eg. drought, flood, etc.)', 'Timeliness of project approvals processes',
        'Workplace health & safety (eg. Project staff and / or delivery partner injury or death)', 'Land use Conflict'];
    self.threatOptions = config.riskAndThreatTypes || defaultRiskAndThreats;
    self.organisations = ['Academic/research institution', 'Australian Government Department', 'Commercial entity', 'Community group',
        'Farm/Fishing Business', 'Indigenous Organisation', 'Individual', 'Local Government', 'Other', 'Primary Industry group',
        'School', 'State Government Organisation', 'Trust'];
    self.protectedNaturalAssests = ['Natural/Cultural assets managed', 'Threatened Species', 'Threatened Ecological Communities',
        'Migratory Species', 'Ramsar Wetland', 'World Heritage area', 'Community awareness/participation in NRM', 'Indigenous Cultural Values',
        'Indigenous Ecological Knowledge', 'Remnant Vegetation', 'Aquatic and Coastal systems including wetlands', 'Not Applicable'];
    self.controls = ['Yes', 'No'];
    self.keyThreatCodes = config.keyThreatCodes || [];
    self.priorityPlaces = config.priorityPlaces || [];
    self.monitoringProtocols = ko.observableArray();
    if (config.useServiceOutcomesModel) {
        projectService.getMonitoringProtocols().done(function(protocols) {
            if (!_.isArray(protocols)) {
                protocols = [];
            }
            // If the protocol list doesn't contain 'Other', add it.
            if (!_.find(protocols, function(protocol) { return protocol.value.toLowerCase() == 'other'; })) {
                protocols.push({label:'Other', value:'Other'});
            }
            self.monitoringProtocols(protocols);
        });
    }

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
        self.meriPlan().objectives.rows1.push(new SingleAssetOutcomeViewModel({}, config));
    };
    self.removeObjectives = function (row) {
        self.meriPlan().objectives.rows.remove(row);
    };
    self.removeObjectivesOutcome = function (row) {
        self.meriPlan().objectives.rows1.remove(row);
    };
    self.addNationalAndRegionalPriorities = function () {
        self.meriPlan().priorities.addRow();
    };
    self.removeNationalAndRegionalPriorities = function (row) {
        self.meriPlan().priorities.rows.remove(row);
    };

    /** Called by the extendedBaselineMonitoring page to associate a new monitoring indicator with a baseline */
    self.addMonitoringIndicator = function(baseline) {
        var code = baseline.code();
        self.meriPlan().monitoring.rows.push(self.meriPlan().monitoring.newRow({relatedBaseline:code}));
    }
    self.removeMonitoringIndicator = function(row) {
        self.meriPlan().monitoring.removeRow(row);
    }

    /**
     * Returns true if any Key Threat has an associated target measure that is produced by a survey service.
     * The purpose of this method is to disallow the removal of all baselines if the project is delivering survey services.
     */
    self.keyThreatsIncludesSurveyTargetMeasures = function() {
        return _.find(self.meriPlan().threats.rows() || [], function(keyThreat) {
            var scoreIds = keyThreat.relatedTargetMeasures();
            for (var i=0; i<scoreIds.length; i++) {
                var targetMeasure = _.find(self.allTargetMeasures, function (targetMeasure) {
                    return targetMeasure.scoreId == scoreIds[i];
                });
                if (projectService.isSurveyTargetMeasure(targetMeasure.score)) {
                    return true;
                }
            }
            return false;
        });
    }

    /** Called by the extendedBaselineMonitoring template to remove any monitoring indicators associated with a
     * removed baseline */
    self.removeBaseline = function(baseline) {

        if (self.meriPlan().baseline.rows().length == 1 && self.keyThreatsIncludesSurveyTargetMeasures()) {
            bootbox.alert("If the project is delivering survey services, at least one baseline must be included in the MERI plan.  To progress, please either remove all survey services from the ‘Key threat(s) and/or key threatening processes’ section, or complete the 'Monitoring methodology' section to add at least one project baseline");
            return;
        }
        var code = ko.utils.unwrapObservable(baseline.code);
        self.meriPlan().monitoring.rows.remove(function(row) {
            return ko.utils.unwrapObservable(row.relatedBaseline) == code;
        });
        self.meriPlan().baseline.removeRow(baseline);
    }
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
        self.meriPlan().partnership.addRow();
    };
    self.removePartnership = function (partnership) {
        self.meriPlan().partnership.removeRow(partnership);
    };
    self.addSecondaryOutcome = function () {
        self.meriPlan().outcomes.secondaryOutcomes.push(new SingleAssetOutcomeViewModel({}, config));
    };
    self.removeSecondaryOutcome = function (outcome) {
        self.meriPlan().outcomes.secondaryOutcomes.remove(outcome);
    };

    function removeOutcomeStatement(outcomeStatementList, outcomeToRemove) {
        var outcomeRemovalWarning = 'Deleting this outcome statement may impact other sections of the MERI Plan. Are you sure you want to delete it?';
        if (config.useServiceOutcomesModel) {
            bootbox.confirm(outcomeRemovalWarning, function(result) {
                if (result) {
                    outcomeStatementList.remove(outcomeToRemove);
                }
            });
        }
        else {
            self.meriPlan().outcomes.midTermOutcomes.remove(outcome);
        }
    }
    self.removeMidTermOutcome = function (outcome) {
        removeOutcomeStatement(self.meriPlan().outcomes.midTermOutcomes, outcome);
    };
    self.removeShortTermOutcome = function (outcome) {
        removeOutcomeStatement(self.meriPlan().outcomes.shortTermOutcomes, outcome);
    };

    function addOutcomeStatement(outcomeStatementList, codePrefix) {
        var outcomesList = outcomeStatementList();
        var index = outcomesList.length + 1;
        var code = codePrefix+index;
        while (_.find(outcomesList, function(outcome) { return outcome.code == code; })) {
            index++;
            code = codePrefix+index;
        }
        outcomeStatementList.push(new SingleAssetOutcomeViewModel({code:code}, config));
    }
    self.addMidTermOutcome = function () {
        addOutcomeStatement(self.meriPlan().outcomes.midTermOutcomes, 'MT');
    };
    self.addShortTermOutcome = function () {
        addOutcomeStatement(self.meriPlan().outcomes.shortTermOutcomes, 'ST');
    };

    self.addAsset = function() {
        self.meriPlan().assets.push(new AssetViewModel());
    };
    self.removeAsset = function(asset) {
        self.meriPlan().assets.remove(asset);
    };
    self.addControlMethod = function () {
        self.meriPlan().threatControlMethod.addRow();
    };
    self.removeControlMethod = function (threatControlMethod) {
        self.meriPlan().threatControlMethod.removeRow(threatControlMethod);
    };
    self.saveAndSubmitChanges = function(){
        self.saveMeriPlan(true);
    };

    self.saveProjectDetails = function(){
        self.saveMeriPlan(false);
    };

    self.saveMeriPlanAndUnlock = function() {
        self.saveMeriPlan(false, true);
    }


    self.selectedOutcomes = ko.pureComputed(function() {
        var outcomes = [];
        outcomes = outcomes.concat(self.meriPlan().outcomes.midTermOutcomes());
        outcomes = outcomes.concat(self.meriPlan().outcomes.shortTermOutcomes());
        return outcomes;
    }).extend({rateLimit:200});

    /** Used by the UI to render the outcome description alongside the code */
    self.renderOutcome = function(outcome) {
        var outcome2 = _.find(self.selectedOutcomes(), function(outcome1) {return outcome1.code == outcome.text});
        var description = outcome2 && outcome2.description();
        return $('<span><strong>'+outcome.text+'</strong> - ' + (description || '<i>No outcome statement supplied</i>') +'</span>');
    }

    self.unlockPlanAndReload = function(message) {
        blockUIWithMessage(message);
        window.location.href = config.removeMeriPlanEditLockUrl;
    };

    // Save project details
    self.saveMeriPlan = function(enableSubmit, unlock){

        var meriPlan = self.meriPlan();
        meriPlan.status('active');
        meriPlan.lastUpdated = new Date().toISOStringNoMillis();

        var valid = false;
        // Only mark the plan as finished if the user has ticked the checkbox and the validation routine passes.
        meriPlan.progress = ActivityProgress.started;
        var markedAsFinished = meriPlan.markAsFinished();
        if (markedAsFinished) {
            valid =  $('#project-details-validation').validationEngine('validate');
            meriPlan.markAsFinished(valid);
            meriPlan.progress = valid ? ActivityProgress.finished : ActivityProgress.started;
        }
        blockUIWithMessage("Saving MERI Plan...");

        meriPlan.saveWithErrorDetection(function() {

            if (!valid && markedAsFinished && !enableSubmit) {
                bootbox.alert("Your MERI plan cannot be marked as complete until all validation errors are resolved");
            }
            if (unlock) {
                if (!markedAsFinished || valid) {
                    self.unlockPlanAndReload("MERI Plan saved and unlocked.  Reloading project...");
                }
            }
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
            else if (ko.isObservable(meriPlan.name) && (meriPlan.name() != project.name)) {
                // If the name has changed we need to reload the page so the title is updated.
                blockUIWithMessage("MERI Plan Saved.  Reloading project...");
                window.location.reload();
            }
            else {
                $.unblockUI();
            }
        }, function(data) {
            $.unblockUI();

            if (data.noLock) {
                bootbox.alert("Another user has locked the MERI plan for editing.  Your changes cannot be saved.", function () {
                    blockUIWithMessage("Reloading page...");
                    self.meriPlan().cancelAutosave();
                    document.location.reload();
                });
            }
        });

    };

    self.applyAutoSave = function() {
        autoSaveModel(
            self.meriPlan(),
            config.projectUpdateUrl,
            {
                storageKey: config.meriStorageKey || 'meriPlan-' + project.projectId,
                autoSaveIntervalInSeconds: config.autoSaveIntervalInSeconds || 60,
                restoredDataWarningSelector: '#restoredData',
                resultsMessageSelector: '.save-details-result-placeholder',
                timeoutMessageSelector: '#timeoutMessage',
                errorMessage: "Failed to save MERI Plan: ",
                successMessage: 'MERI Plan saved',
                preventNavigationIfDirty: true,
                defaultDirtyFlag: ko.dirtyFlag,
                dirtyFlagRateLimitMs: 500,
                healthCheckUrl: config.healthCheckUrl
            });
    }

    if (!projectService.isProjectDetailsLocked()) {
        // This was in DetailsViewModel to support the (never released) MERI plan load function.
        // It's been moved back here as having in the DetailsViewModel was causing issues with the new MERI
        // plan because orphaned services get detected as dirty and the user is prompted to save them, even when
        // the page is in read only mode.
        self.applyAutoSave();
    }
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
    self.deleteApproval = function(approval) {
        bootbox.confirm("Delete this approval?  This cannot be undone.", function(yes) {

            if (yes) {
                blockUIWithMessage("Deleting approval...");
                projectService.deleteDocument(approval.documentId).done(
                    function() {
                        blockUIWithMessage("Approval deleted.  Reloading page...")
                        document.location.reload();
                    }
                ).fail(function() {
                    $.unblockUI();
                    bootbox.alert("There was an error deleting the approval");
                });
            }

        });
    }
    /**
     * Workaround to allow grant managers to supply the order number as
     * they don't have access to the project settings section.
     * @type {Observable<string>}
     */
    self.internalOrderId = ko.observable(project.internalOrderId);
    self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
    self.canApprove = function() {
        var canApprove = projectService.canApproveMeriPlan();
        if(!canApprove) {
            $('.grantManagerActionSpan').popover({content:'*At least one Tech One Project Code or SAP Internal Order must be provided before the MERI plan can be approved', placement:'top', trigger:'hover'})
        }
        return canApprove
    };
}

function ReadOnlyMeriPlan(project, projectService, config, changed) {
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
        if (projectService.isCompletedOrTerminated()) {
            if (projectService.isUnlockedForDataCorrection()) {
                result = {text: 'The plan has been unlocked for data correction', badgeClass: 'badge-warning'};
            } else {
                if (projectService.isTerminated()){
                    result = {text: 'This project is ' + project.status.toLowerCase(), badgeClass: 'badge-danger'};
                }else{
                    result = {text: 'This project is ' + project.status.toLowerCase(), badgeClass: 'badge-info'};
                }
            }
        } else {
            if (projectService.isApproved()) {
                result = {text: 'This plan has been approved', badgeClass: 'badge-success'};
            } else if (projectService.isSubmitted()) {
                result = {text: 'This plan has been submitted for approval', badgeClass: 'badge-info'};
            }
            else if (!projectService.isPlanComplete()) {
                result = {text: 'This plan has not been completed', badgeClass: 'badge-warning'};
            }
        }
        return result;
    });

    var disableFlag = ko.observable(false);
    self.isProjectDetailsLocked = ko.computed(function () {
        return projectService.isProjectDetailsLocked();
    });

    self.editMeriPlan = function() {
        window.location.href = config.editMeriPlanUrl;
    };
    var riskModel;
    if (config.useRlpRisksModel) {
        riskModel = rlpRiskModel();
    } else {
        riskModel = meritRiskModel();
    }

    // List of service / target measure
    self.allTargetMeasures = [];
    var services = config.services || [];
    for (var i=0; i<services.length; i++) {
        if (services[i].scores) {
            for (var j=0; j<services[i].scores.length; j++) {
                // Mandatory services are always included in reports and can't be marked
                // as "Not applicable".  The current use case is for project management/overheads
                // reporting and as such don't have target measures.
                if (!(services[i].mandatory)) {
                    self.allTargetMeasures.push( {
                        label:services[i].name+' - '+services[i].scores[j].label,
                        serviceId:services[i].id,
                        scoreId:services[i].scores[j].scoreId,
                        service:services[i],
                        score:services[i].scores[j],
                        value:services[i].scores[j].scoreId
                    });
                }

            }
        }
    }

    self.allTargetMeasures = _.sortBy(self.allTargetMeasures, 'label');
    self.keyThreatsTargetMeasures = function() {
        if (self.meriPlan().baseline.rows().length > 0) {
            return self.allTargetMeasures;
        }
        else {  // To report against a survey (baseline/indicator) target measure, a related baseline is required.
            return _.filter(self.allTargetMeasures, function(targetMeasure) {
                return !projectService.isSurveyTargetMeasure(targetMeasure.score);
            });
        }
    };
    self.monitoringTargetMeasures = _.filter(self.allTargetMeasures, function(targetMeasure) {
        return projectService.isMonitoringTargetMeasure(targetMeasure.score);
    });
    self.baselineTargetMeasures = _.filter(self.allTargetMeasures, function(targetMeasure) {
        return projectService.isBaselineTargetMeasure(targetMeasure.score);
    });
    /**
     * This function allows the UI to convert an array of scoreIds into the same labels
     * that are used in the editable version of the MERI plan.
     * @param scoreIds {Array} An array of scoreIds
     * @returns {string} A string containing the labels for the scoreIds
     */
    self.targetMeasureLabels = function(scoreIds) {
        var labels = [];

        scoreIds = ko.utils.unwrapObservable(scoreIds);
        for (var i=0; i<scoreIds.length; i++) {
            var scoreId = scoreIds[i];
            for (var j=0; j<self.allTargetMeasures.length; j++) {
                if (self.allTargetMeasures[j].scoreId == scoreId) {
                    labels.push(self.allTargetMeasures[j].label);
                }
            }
        }
        return labels;
    }

    _.extend(self, new Risks(project.risks, riskModel, disableFlag, config.risksStorageKey));
    self.selectedTargetMeasures = ko.observableArray();
    var details = new DetailsViewModel(project.custom.details, project, self.periods, self.risks, self.allTargetMeasures, self.selectedTargetMeasures, config);
    self.meriPlan = ko.observable(details);

    if (changed) {
        var changedDetails = new DetailsViewModel(changed.custom.details, project, self.periods, self.risks, self.allTargetMeasures, self.selectedTargetMeasures, config);
        self.meriPlanChanged = ko.observable(changedDetails);
    }

    self.detailsLastUpdated = ko.observable(project.custom.details.lastUpdated).extend({simpleDate: true});
    self.outcomeStartIndex = config.outcomeStartIndex;
    self.isAgricultureProject = ko.computed(function () {
        var agricultureOutcomeStartIndex = self.outcomeStartIndex;
        var selectedPrimaryOutcome = self.meriPlan().outcomes.primaryOutcome.description();
        var selectedOutcomeIndex = _.findIndex(project.outcomes, function (outcome) {
            return outcome.outcome == selectedPrimaryOutcome;
        });
        return selectedOutcomeIndex >= agricultureOutcomeStartIndex;
    });


    function processServicesAndOutcomes(services, outcomes, serviceOutcomeMap) {
        services = services || [];
        outcomes = outcomes || [];
        for (var j=0; j<services.length; j++) {
            var service = services[j];
            if (service) {
                if (!serviceOutcomeMap[service]) {
                    serviceOutcomeMap[service] = {};
                }
                for (var k = 0; k < outcomes.length; k++) {
                    if (outcomes[k]) {
                        serviceOutcomeMap[service][outcomes[k]] = true;
                    }
                }
            }
        }
    }
    /** All parts of the model able to specify services are collected together here */
    self.selectedServiceWatcher = ko.computed(function() {

        var services = [];
        var serviceOutcomeMap = {};
        var threats = self.meriPlan().threats.rows();
        for (var i=0; i<threats.length; i++) {
            var s = threats[i].relatedTargetMeasures();
            var o = threats[i].relatedOutcomes();
            processServicesAndOutcomes(s, o, serviceOutcomeMap);
        }


        var baseLineOutcomeMap = {}; // Tracks the outcomes related to each baseline
        var baselines = self.meriPlan().baseline.rows();
        for (var i=0; i<baselines.length; i++) {
            baseLineOutcomeMap[baselines[i].code()] = baselines[i].relatedOutcomes();
            processServicesAndOutcomes(baselines[i].relatedTargetMeasures(), baselines[i].relatedOutcomes(), serviceOutcomeMap);
        }

        var monitoring = self.meriPlan().monitoring.rows();
        for (var i=0; i<monitoring.length; i++) {
            // The outcome related to this monitoring indicator depends on the related baseline
            var monitoringOutcomes = baseLineOutcomeMap[monitoring[i].relatedBaseline()];
            processServicesAndOutcomes(monitoring[i].relatedTargetMeasures(), monitoringOutcomes, serviceOutcomeMap);
        }

        for (var prop in serviceOutcomeMap) {
            var service = _.find(self.selectedTargetMeasures(), function(selectedService) {
                return selectedService.scoreId == prop;
            });
            var newService = false;
            if (!service) {
                var serviceAndTarget = _.find(self.allTargetMeasures, function(target) {
                    return target.scoreId == prop;
                });
                service = {scoreId:prop, serviceAndTarget: serviceAndTarget, outcomes:ko.observableArray()};
                newService = true;
            }
            var outcomes = [];
            for (var outcome in serviceOutcomeMap[prop]) {
                outcomes.push(outcome);
            }
            service.outcomes(outcomes);
            if (newService) {
                self.selectedTargetMeasures.push(service);
            }
        }
        self.selectedTargetMeasures.remove(function(selectedService) {
            return !serviceOutcomeMap[selectedService.scoreId];
        });

        return services;
    }).extend({rateLimit:config.targetMeasureUpdateLimit || 1000});
    self.monitoringIndicators = function(code) {
        var relatedIndicators = _.filter(self.meriPlan().monitoring.rows(), function(row) {
            return row.relatedBaseline() == ko.utils.unwrapObservable(code);
        });
        return relatedIndicators;
    }
};

function DetailsViewModel(o, project, budgetHeaders, risks, allServices, selectedTargetMeasures, config) {
    var self = this;
    var period = budgetHeaders;
    if (config.useRlpTemplate) {
        if (config.useServiceOutcomesModel) {
            self.serviceOutcomes = new ServiceOutcomeTargetsViewModel(o.serviceIds, project.outputTargets, budgetHeaders, allServices, selectedTargetMeasures);
        }
        else {
            self.services = new ServicesViewModel(o.serviceIds, config.services, project.outputTargets, budgetHeaders);
        }

        self.name = ko.observable(project.name);
        self.description = ko.observable(project.description);
        /* this is a quick workaround to make the MERIPLAN comparison work, using the name field above will not render the comparison
        but it's needed in the DatasetSpec integration test, it will fail otherwise due to blank project name. */
        self.nameComparison = ko.observable(o.name);
        self.descriptionComparison = ko.observable(o.description);

        self.programName = config.programName;
        self.projectEvaluationApproach = ko.observable(o.projectEvaluationApproach);
        self.relatedProjects = ko.observable(o.relatedProjects);
        // Initialise with 2 KEQ rows
        if (!o.keq) {
            o.keq = {
                rows: new Array(2)
            }
        }
    }
    self.progress = o.progress;
    self.markAsFinished = ko.observable(o.progress == ActivityProgress.finished);
    self.activities = new ActivitiesViewModel(o.activities, config.programActivities || []);
    self.status = ko.observable(o.status);
    self.obligations = ko.observable(o.obligations);
    self.policies = ko.observable(o.policies);
    self.caseStudy = ko.observable(o.caseStudy ? o.caseStudy : false);
    self.keq = new GenericViewModel(o.keq);
    self.objectives = new ObjectiveViewModel(o.objectives, config.programObjectives || []); // Used in original MERI plan template
    var outcomesConfig = {
        outcomes:project.outcomes,
        priorities:project.priorities,
        bieUrl: config.bieUrl,
        searchBieUrl: config.searchBieUrl,
        speciesListUrl: config.speciesListUrl,
        speciesImageUrl: config.speciesImageUrl,
        speciesProfileUrl: config.speciesProfileUrl
    };
    self.outcomes = new OutcomesViewModel(o.outcomes, outcomesConfig); // Use in new MERI plan template
    self.priorities = new GenericViewModel(o.priorities, ['data1', 'data2', 'data3', 'documentUrl']);
    self.implementation = new ImplementationViewModel(o.implementation);
    self.partnership = new GenericViewModel(o.partnership, ['data1', 'data2', 'data3', 'otherOrganisationType']);
    self.lastUpdated = o.lastUpdated ? o.lastUpdated : moment().format();
    self.budget = new BudgetViewModel(o.budget, period);
    self.adaptiveManagement = ko.observable(o.adaptiveManagement);
    self.rationale = ko.observable(o.rationale);
    self.baseline = new GenericViewModel(o.baseline, ['code', 'monitoringDataStatus', 'baseline',  'method', 'evidence'], 'B', ['relatedTargetMeasures', 'relatedOutcomes', 'protocols']);
    self.threats = new GenericViewModel(o.threats, ['threatCode', 'threat', 'intervention', 'evidence'], 'KT',['relatedTargetMeasures', 'relatedOutcomes']);
    self.consultation = ko.observable(o.consultation);
    self.communityEngagement = ko.observable(o.communityEngagement);
    self.threatToNativeSpecies = new GenericViewModel(o.threatToNativeSpecies, ['couldBethreatToSpecies', 'details']);
    self.threatControlMethod = new GenericViewModel(o.threatControlMethod, ['currentControlMethod', 'hasBeenSuccessful', 'methodType', 'details']);
    self.monitoring = new GenericViewModel(o.monitoring, ['relatedBaseline', 'data1', 'data2', 'evidence'], null, ['relatedTargetMeasures', 'protocols']);
    self.supportsPriorityPlace = ko.observable(o.supportsPriorityPlace);
    self.supportedPriorityPlaces = ko.observableArray(o.supportedPriorityPlaces);
    self.indigenousInvolved = ko.observable(o.indigenousInvolved);
    self.indigenousInvolvementType = ko.observable(o.indigenousInvolvementType);
    self.indigenousInvolvementComment = ko.observable(o.indigenousInvolvementComment);

    var row = [];
    o.events ? row = o.events : row.push(ko.mapping.toJS(new EventsRowViewModel()));
    self.events = ko.observableArray(_.map(row, function (obj, i) {
        return new EventsRowViewModel(obj);
    }));

    self.assets = ko.observableArray(_.map(o.assets || [{}], function(asset) {
        return new AssetViewModel(asset);
    }));

    function clearHiddenFields(jsData) {
        // Several questions have "Yes"/"No" answers
        var YES = 'Yes';
        var NO = 'No';
        // Some fields are only relevant if certain answers are selected for other fields and are otherwise hidden.
        // We clear any data for hidden fields here so they aren't saved in the database (and come out in downloads)
        if (jsData.custom.details.indigenousInvolved != YES) {
            jsData.custom.details.indigenousInvolvementType = null;
        }
        if (jsData.custom.details.indigenousInvolved != NO) {
            jsData.custom.details.indigenousInvolvementComment = null;
        }
        if (jsData.custom.details.supportsPriorityPlace != YES) {
            jsData.custom.details.supportedPriorityPlaces = null;
        }
    };
    self.modelAsJSON = function () {
        var tmp = {};
        tmp.details = ko.mapping.toJS(self);
        if (tmp.details.outcomes) {
            if (tmp.details.outcomes.selectablePrimaryOutcomes) {
                delete tmp.details.outcomes.selectablePrimaryOutcomes; // This is for dropdown population and shouldn't be saved.
            }
            if (tmp.details.outcomes.selectableSecondaryOutcomes) {
                delete tmp.details.outcomes.selectableSecondaryOutcomes; // This is for dropdown population and shouldn't be saved.
            }
        }

        var jsData = {"custom": tmp};
        clearHiddenFields(jsData);

        // For compatibility with other projects, move the targets to the top level of the data structure, if they
        // are in the MERI plan.
        if (config.useRlpTemplate) {
            var serviceData = config.useServiceOutcomesModel ? tmp.details.serviceOutcomes.toJSON() : tmp.details.services.toJSON();

            jsData.outputTargets = serviceData.targets;
            jsData.description = self.description();
            jsData.name = self.name();
            tmp.details.serviceIds = serviceData.serviceIds;
            delete tmp.details.services;
            delete tmp.details.serviceOutcomes;
        }

        var json = JSON.stringify(jsData, function (key, value) {
            return value === undefined ? "" : value;
        });
        return json;
    };

    if (config.locked) {
        autoSaveConfig.lockedEntity = project.projectId;
    }
};

/** Removes nulls from arrays after toJSON is called */
function outcomesToJSON(outcomeArray) {
    return _.filter(_.map(outcomeArray, function (outcome) {
        if (_.isFunction(outcome.toJSON)) {
            return outcome.toJSON();
        }
        else {
            return ko.toJS(outcome);
        }

    }), function(outcome) { return outcome != null});
};

function ServiceOutcomeTargetsViewModel(serviceIds, outputTargets, forecastPeriods, allServices, selectedTargetMeasures) {


    var self = this;
    self.forecastPeriods = forecastPeriods;
    self.outcomeTargets = ko.observableArray();

    self.sortedOutcomeTargets = ko.computed(function() {
        return _.sortBy(self.outcomeTargets(), function(target) {
            return target.serviceLabel + target.scoreLabel;
        });
    })

    self.addOutcomeTarget = function(outputTarget) {
        self.outcomeTargets.push(new Targets(outputTarget));
    }

    self.removeOutcomeTarget = function(target) {
        self.outcomeTargets.remove(target);
    }

    function Targets(outputTarget) {
        var self = this;

        function availableOutcomes(target) {
            var outcomes = [];

            // If we aren't orphaned, we should only be able to select from outcomes that have been
            // linked to target measures elsewhere in the MERI plan.
            if (self.selectedTargetMeasure()) {
                outcomes = outcomes.concat(self.selectedTargetMeasure().outcomes());
            }

            // If we are orphaned, we need to include the previous selection so it doesn't disappear.
            var selectedOutcomes = _.flatten(_.map(self.outcomeTargets(), function (outcomeTarget) {
                if (target == outcomeTarget) {
                    return [];
                }
                return outcomeTarget.relatedOutcomes();
            }));

            return _.difference(outcomes, selectedOutcomes);
        }

        function ServiceOutcomesTarget(target) {
            var self = this;
            target = target || {};
            self.target = ko.observable(target.target);
            self.relatedOutcomes = ko.observableArray(target.relatedOutcomes);
            self.orphanedOutcomes = ko.observableArray();
            self.orphanedOutcomesError = function() {
                return 'The outcomes '+self.orphanedOutcomes().join(', ')+' are no longer linked to a target measure and should be removed from this target.';
            }
            self.availableOutcomes = ko.computed(function() {
                var selectableOutcomes = availableOutcomes(self);
                var selectedOutcomes = self.relatedOutcomes();
                var orphanedOutcomes = _.difference(selectedOutcomes, selectableOutcomes)
                self.orphanedOutcomes(orphanedOutcomes);
                return _.union(selectableOutcomes, orphanedOutcomes);
            });

            self.toJSON = function() {
                return {
                    target: self.target(),
                    relatedOutcomes: self.relatedOutcomes()
                };
            }
        }

        self.scoreId = outputTarget.scoreId;
        var scoreInfo = _.find(allServices, function(serviceTarget) {
            return serviceTarget.scoreId == outputTarget.scoreId;
        });
        self.serviceId = scoreInfo ? scoreInfo.serviceId : null;
        self.scoreLabel = scoreInfo ? scoreInfo.score.label : "Unsupported target measure";
        self.serviceLabel = scoreInfo ? scoreInfo.service.name : "Unsupported service";

        self.selectedTargetMeasure = ko.computed(function() {
            return _.find(selectedTargetMeasures(), function(service) {
                return self.scoreId == service.scoreId;
            });
        });

        // Used to trigger a validation error if this target is removed from all other sections of the MERI plan
        self.orphaned = ko.pureComputed(function() {
            return !self.selectedTargetMeasure();
        });

        self.periodTargets = _.map(forecastPeriods, function (period) {

            var existingPeriodTarget = _.find(outputTarget.periodTargets, function(periodTarget) {
                return periodTarget.period == period;
            });
            var target = existingPeriodTarget ? existingPeriodTarget.target : 0;
            return {period: period, target: ko.observable(target)};
        });

        // This needs to be declared before it's populated due to a reliance on the availableOutcomes function
        // which references this array.
        self.outcomeTargets = ko.observableArray();
        self.outcomeTargets(_.map(outputTarget.outcomeTargets || {}, function(outcomeTarget) {
            return new ServiceOutcomesTarget(outcomeTarget);
        }));
        if (self.outcomeTargets().length == 0) {
            self.outcomeTargets.push(new ServiceOutcomesTarget());
        }

        self.target = ko.pureComputed(function() {
           var target = 0;
           for (var i=0; i<self.outcomeTargets().length; i++) {
               target += Number(self.outcomeTargets()[i].target()) || 0;
           }
           return target;
        });

        self.availableOutcomes = ko.computed(function() {
            return availableOutcomes();
        });

        self.addOutcomeTarget = function() {
            self.outcomeTargets.push(new ServiceOutcomesTarget(self.scoreId, self.availableOutcomes));
        };

        self.removeOutcomeTarget = function(outcomeTarget) {
            self.outcomeTargets.remove(outcomeTarget);
        };

        self.hasData = function() {
            var hasTarget = _.find(self.outcomeTargets(), function(outcomeTarget) {
                return (outcomeTarget.target() && outcomeTarget.target() != 0);
            });
            var hasPeriodTarget = _.find(self.periodTargets, function(periodTarget) {
                return (periodTarget.target() && periodTarget.target() != 0);
            });

            return hasTarget || hasPeriodTarget;
        };

        self.toJSON = function() {
            return {
                scoreId: self.scoreId,
                target: self.target(),
                periodTargets: ko.mapping.toJS(self.periodTargets),
                outcomeTargets: _.map(self.outcomeTargets(), function(outcomeTarget) { return outcomeTarget.toJSON(); })
            }
        }
    };

    self.targetRemoved = function(target) {
        var outcomeTarget = _.find(self.outcomeTargets(), function(outcomeTarget) {
            return target.scoreId == outcomeTarget.scoreId;
        });
        if (!outcomeTarget.hasData()) {
            self.removeOutcomeTarget(outcomeTarget);
        }
    };

    self.targetAdded = function(target) {
        var outputTarget = {
            scoreId: target.scoreId,
            outcomeTargets:[
                { relatedOutcomes:target.outcomes() }
            ]
        };
        self.addOutcomeTarget(outputTarget);
    };

    self.toJSON = function() {
        return {
            targets:_.map(self.outcomeTargets(), function(outcomeTarget) {
                return outcomeTarget.toJSON();
            }),
            serviceIds:_.uniq(_.map(self.outcomeTargets(), function(outcomeTarget) {
                return outcomeTarget.serviceId;
            }))
        };
    };

    for (var i=0;i<(outputTargets || []).length; i++) {
        self.addOutcomeTarget(outputTargets[i]);
    }

    selectedTargetMeasures.subscribe(function(targetMeasures) {

        var added = _.filter(targetMeasures, function(selectedService) {
            var found = _.find(self.outcomeTargets(), function(outcomeTarget) {
                return outcomeTarget.scoreId == selectedService.scoreId;
            });
            return !found;
        });
        for (var i=0; i<added.length; i++) {
            self.targetAdded(added[i]);
        }
        var removed = _.filter(self.outcomeTargets(), function(outcomeTarget) {
            var found = _.find(targetMeasures, function(selectedService) {
                return outcomeTarget.scoreId == selectedService.scoreId;
            });
            return !found;
        });
        for (var i=0; i<removed.length; i++) {
            self.targetRemoved(removed[i]);
        }
    });

}

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

    /**
     * This function is invoked when a selected service is changed or
     * a service added or deleted.
     * It keeps the list of selected service names up to date for use
     * by the budget table.
     */
    function updateSelectedServices() {
        var array =  _.map(self.services(), function(serviceTarget) {
            var service = serviceTarget.service();
            if (service) {
                return service.name;
            }
        });
        array = _.filter(array, function(val) { return val; });
        array = _.unique(array);
        self.selectedServices(array);
    }
    var ServiceTarget = function (service, score) {
        var target = this;

        target.serviceId = ko.observable(service ? service.id : null);
        target.scoreId = ko.observable(score ? score.scoreId : null);

        target.target = ko.observable();
        target.targetDate = ko.observable().extend({simpleDate:false});

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
            return sum <= (target.target() || 0);
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
            target.targetDate(currentTarget ? currentTarget.targetDate : '');
        };

        target.toJSON = function () {
            return {
                target: target.target(),
                targetDate: target.targetDate(),
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
            updateSelectedServices();
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


    self.selectedServices = ko.observableArray();
    self.services.subscribe(updateSelectedServices);

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
        var serviceIds = _.unique(_.map(self.services(), function (service) {
            return service.serviceId();
        }));
        serviceIds = _.filter(serviceIds, function(id) {
            return id != null;
        });
        return {
            serviceIds: serviceIds,
            targets: self.outputTargets()
        }
    };
};




function GenericViewModel(o, propertyNames, codePrefix, arrayPropertyNames, numDefaultRows) {
    var self = this;

    if (numDefaultRows === undefined) {
        numDefaultRows = 1;
    }
    if (!o) o = {};
    self.description = ko.observable(o.description);
    self.newRow = function (row) {
        return new GenericRowViewModel(row, propertyNames, arrayPropertyNames)
    };

    function nextCode() {
        var maxCodeNumber = 1;
        for (var i=0; i<self.rows().length; i++) {
            var code = ko.utils.unwrapObservable(self.rows()[i].code);
            if (code) {
                var num = parseInt(code.substring(codePrefix.length));
                if (num > maxCodeNumber) {
                    maxCodeNumber = num;
                }
            }
        }
        return codePrefix+(maxCodeNumber+1);
    }
    function newObj() {
        var obj = {};
        if (codePrefix) {
            obj.code = nextCode();
        }
        return obj;
    }
    self.rows = ko.observableArray();

    self.addRow = function () {
        self.rows.push(self.newRow(newObj()));
    };
    self.removeRow = function (row) {
        self.rows.remove(row);
    };

    if (!o.rows) {
        o.rows = [];
        for (var i=0; i<numDefaultRows; i++) {
            self.addRow();
        }
    }
    else {
        _.each(o.rows, function (obj) {
            self.rows.push(self.newRow(obj));
        });
    }
};

function GenericRowViewModel(o, propertyNames, arrayPropertyNames) {
    var self = this;
    if (!o) o = {};
    if (!propertyNames || propertyNames.length == 0) {
        propertyNames = ['data1', 'data2', 'data3'];
    }
    for (var i = 0; i < propertyNames.length; i++) {
        self[propertyNames[i]] = ko.observable(o[propertyNames[i]]);
    }
    if (arrayPropertyNames) {
        for (var i = 0; i < arrayPropertyNames.length; i++) {
            self[arrayPropertyNames[i]] = ko.observableArray(o[arrayPropertyNames[i]]);
        }
    }
};

function ObjectiveViewModel(o, programObjectives) {
    var self = this;
    if (!o) o = {};

    var row = [];
    o.rows ? row = o.rows : row.push(ko.mapping.toJS(new GenericRowViewModel()));
    self.rows = ko.observableArray(_.map(row, function (obj, i) {
        return new GenericRowViewModel(obj);
    }));

    var row1 = [];
    o.rows1 ? row1 = o.rows1 : row1.push(ko.mapping.toJS(new SingleAssetOutcomeViewModel()));
    self.rows1 = ko.observableArray(_.map(row1, function (obj, i) {
        return new SingleAssetOutcomeViewModel(obj);
    })).extend({removeNullsOnSave:true});

    /**
     * This pure computed observable provides a mapping from a simple array of selected program objectives to
     * the structure used to store the objectives in the database.
     */
    self.simpleObjectives = ko.computed({
        read:function() {
            return _.filter(_.map(self.rows1(), function(row) {
                return row.description();
            }), function(value) {
                return value && value != '' &&  programObjectives.indexOf(value) >= 0;
            });
        },
        write: function(values) {
            // Ignore empty and null values, such as the one pre-populated in the default row above.
            values = values.filter(function(value) { return value && value != '' &&  programObjectives.indexOf(value) >= 0;});

            while (self.rows1().length > values.length) {
                self.rows1.splice(self.rows1.length-1, 1);
            }

            for (var i=0; i<values.length; i++) {
                if (self.rows1().length <= i) {
                    self.rows1.push(new SingleAssetOutcomeViewModel({description:values[i]}));
                }
                else {
                    self.rows1()[i].description(values[i]);
                }
            }
        }
    });

    if (programObjectives && programObjectives.length > 0) {

        var otherObjectives = _.filter(_.map(self.rows1(), function (row) {
            return row.description();
        }), function (value) {
            return value && value != '' && programObjectives.indexOf(value) < 0;
        });
        self.simpleObjectives.otherChecked = ko.observable(otherObjectives.length > 0);
        self.simpleObjectives.otherValue = ko.observable(otherObjectives.length > 0 ? otherObjectives[0] : undefined);
        self.simpleObjectives.otherChecked.subscribe(function (value) {
            if (!value) {
                self.simpleObjectives(self.simpleObjectives()); // This clears the other value.
                self.simpleObjectives.otherValue(undefined);
            }
        });
    }
    self.toJSON = function () {
        var js = {
            rows1: outcomesToJSON(self.rows1()),
            rows: ko.toJS(self.rows())
        }
        if (self.simpleObjectives.otherChecked && self.simpleObjectives.otherChecked() && self.simpleObjectives.otherValue()) {
            js.rows1.push({description:self.simpleObjectives.otherValue(), assets:[]});
        }
        return js;
    };
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
    if (!outcomes.primaryOutcome) {
        outcomes.primaryOutcome = {
            description: null, asset: ''
        };
    }
    if (!outcomes.shortTermOutcomes) {
        outcomes.shortTermOutcomes = [{
            code:"ST1", description: null, assets: []
        }];
    }
    if (!outcomes.secondaryOutcomes) {
        outcomes.secondaryOutcomes = [{
            description: null, asset: ''
        }]
    }

    if (!outcomes.otherOutcomes){
        outcomes.otherOutcomes = []
    }

    /**
     * Filters the program outcomes specified in config.outcomes based on the outcome type.
     * Outcomes can be optionally 'primary' or 'secondary'.  Outcomes with no type are both
     * primary and secondary.
     *
     * @param outcomes the list of available outcomes to be filtered.  Outcomes are defined by a program.
     * @param type the type to filter.  Outcomes matching the supplied type will be returned
     * @param includeUntyped if true, outcomes with no type will be included in the result.
     */
    function filterByType(outcomes, type, includeUntyped) {
        return _.filter(outcomes, function (outcome) {
            return (includeUntyped && !outcome.type) || outcome.type == type;
        })
    }

    /** Selects outcomes of the supplied type and returns an array of strings to use for user selection */
    function selectableOutcomes(outcomes, type, includeUntyped) {
        var selected = filterByType(outcomes, type, includeUntyped);
        return _.map(selected, function (outcome) {
            return outcome.outcome;
        });
    }

    var PRIMARY_OUTCOMES = 'primary';
    var SECONDARY_OUTCOMES = 'secondary';
    var MEDIUM_TERM_OUTCOMES = 'medium';
    var SHORT_TERM_OUTCOMES = 'short';
    self.selectablePrimaryOutcomes = selectableOutcomes(config.outcomes, PRIMARY_OUTCOMES, true);
    self.selectableSecondaryOutcomes = selectableOutcomes(config.outcomes, SECONDARY_OUTCOMES, true);
    self.selectableMidTermOutcomes = selectableOutcomes(config.outcomes, MEDIUM_TERM_OUTCOMES, false);
    self.selectableShortTermOutcomes = selectableOutcomes(config.outcomes, SHORT_TERM_OUTCOMES, false);

    // If the program has specified a default primary outcome, and the project has not yet selected an outcome,
    // set the default.
    if (!outcomes.primaryOutcome.description) {
        var defaultOutcome = _.find(filterByType(config.outcomes, PRIMARY_OUTCOMES, true), function (outcome) {
            return outcome.default == true;
        });
        if (defaultOutcome) {
            outcomes.primaryOutcome.description = defaultOutcome.outcome;
        }
    }
    self.listOfOtherOutcomeCategory = function (category) {
        var outcomes = [];
        config.outcomes.forEach(function (outcome) {
            if (outcome.category === category) {
                outcomes.push(outcome.outcome)
            }
        });
        return outcomes;
    };

    self.selectedOtherOutcomesByCategory = function(category){
        var selectedOutcome = [];
        outcomes.otherOutcomes.forEach(function (otherOutcomes) {
            var listOfOutcomes = self.listOfOtherOutcomeCategory(category);
           listOfOutcomes.forEach(function (outcomes){
               if (otherOutcomes === outcomes){
                   selectedOutcome.push(outcomes)
               }
           })
        })
        return selectedOutcome;
    }

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

    var supportsConfiguration = function(outcomeText, configItemName) {
        var outcome = _.find(config.outcomes, function (outcome) {
            return outcome.outcome == outcomeText;
        });
        return outcome && outcome[configItemName];
    }
    self.primaryOutcomeSupportsMultiplePriorities = ko.pureComputed(function() {
        var outcomeText = self.primaryOutcome.description();
        return supportsConfiguration(outcomeText, 'supportsMultiplePrioritiesAsPrimary')
    });
    self.secondaryOutcomeSupportsMultiplePriorities = function(outcomeText) {
        return supportsConfiguration(outcomeText, 'supportsMultiplePrioritiesAsSecondary')
    };

    self.supportsSpeciesSearch = function(outcomeText) {
        return supportsConfiguration(outcomeText, 'supportsSpeciesSearch')
    };


    config.supportsSpeciesSearch = _.find(filterByType(config.outcomes, PRIMARY_OUTCOMES, true), function(outcome) {
        return outcome.supportsSpeciesSearch;
    });
    self.primaryOutcome = new SingleAssetOutcomeViewModel(outcomes.primaryOutcome, config);

    config.supportsSpeciesSearch = _.find(filterByType(config.outcomes, SECONDARY_OUTCOMES, true), function(outcome) {
        return outcome.supportsSpeciesSearch;
    });
    self.secondaryOutcomes = ko.observableArray(_.map(outcomes.secondaryOutcomes || [], function (outcome) {
        return new SingleAssetOutcomeViewModel(outcome, config)
    }));
    config.supportsSpeciesSearch = false;
    self.shortTermOutcomes = ko.observableArray(_.map(outcomes.shortTermOutcomes || [], function (outcome) {
        return new SingleAssetOutcomeViewModel(outcome);
    }));
    self.midTermOutcomes = ko.observableArray(_.map(outcomes.midTermOutcomes || [], function (outcome) {
        return new SingleAssetOutcomeViewModel(outcome);
    }));
    self.otherOutcomes = ko.observableArray(outcomes.otherOutcomes);

    self.selectedPrimaryAndSecondaryPriorities = ko.pureComputed(function() {
        var priorities = [];
        if (self.primaryOutcome.assets && self.primaryOutcome.assets().length > 0) {
            priorities = priorities.concat(self.primaryOutcome.assets());
        }
        if (self.secondaryOutcomes() && self.secondaryOutcomes().length > 0) {
            for (var i=0; i<self.secondaryOutcomes().length; i++) {
                if (self.secondaryOutcomes()[i].assets && self.secondaryOutcomes()[i].assets().length > 0) {
                    priorities = priorities.concat(self.secondaryOutcomes()[i].assets());
                }
            }

        }

        return _.uniq(priorities);
    }).extend({ rateLimit: 50 });

    self.toJSON = function () {
        // Calls toJSON on each outcome and strips out nulls from the resulting array.
        return {
            primaryOutcome: self.primaryOutcome.toJSON(),
            secondaryOutcomes: outcomesToJSON(self.secondaryOutcomes()),
            shortTermOutcomes: outcomesToJSON(self.shortTermOutcomes()),
            midTermOutcomes: outcomesToJSON(self.midTermOutcomes()),
            otherOutcomes: self.otherOutcomes()
        }
    }
}


/** Supports Methodology and Project Design and Delivery sections */
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

function links() {
    fromOutcome = ko.observable();
    toOutcome = ko.observable();
}

function AssetViewModel(asset) {
    var self = this;
    if (!asset) {
        asset = {};
    }
    self.category = ko.observable(asset.category);
    self.description = ko.observable(asset.description);
}

function SingleAssetOutcomeViewModel(o, config) {
    var self = this;
    if (!o) o = {};

    self.code = o.code;
    self.description = ko.observable(o.description);
    if (!o.assets || !_.isArray(o.assets)) o.assets = [];
    self.assets = ko.observableArray(o.assets);

    self.asset = ko.pureComputed({
        read: function () {
            var assets = self.assets();
            if (!assets || assets.length == 0) {
                return undefined;
            }
            return self.assets()[0];
        },
        write: function (value) {
            self.assets([value]);
        },
        owner: self
    });

    if (config && config.supportsSpeciesSearch) {
        var options = {
            bieUrl: config.bieUrl,
            searchBieUrl: config.searchBieUrl,
            speciesListUrl: config.speciesListUrl,
            speciesImageUrl: config.speciesImageUrl,
            speciesProfileUrl: config.speciesProfileUrl
        };

        self.speciesAsset = new SpeciesViewModel(o.speciesAsset || {}, options, {});
        // Need to subscribe to an event that fires after all of the fields of the speciesAsset have been loaded.
        self.speciesAsset.transients.textFieldValue.subscribe(function () {

            if (!self.speciesAsset.transients.editing()) {
                var scientificName = self.speciesAsset.scientificName();
                var commonName = self.speciesAsset.commonName();

                var assetName;
                if (scientificName && commonName) {
                    assetName = scientificName + ' (' + commonName + ')';
                } else if (scientificName) {
                    assetName = scientificName;
                } else {
                    assetName = commonName;
                }
                self.asset(assetName);
            }
        });
    }

    self.relatedOutcome = ko.observable(o.relatedOutcome);

    self.toJSON = function () {
        // If the user hasn't entered any data, return null.
        // The code is auto-populated so is not included in
        // the comparison.
        if (!self.description() &&
            self.assets().length == 0 &&
            !self.relatedOutcome()) {
            return null;
        }
        var json = {
            code: self.code,
            description: self.description(),
            assets: self.assets(),
            relatedOutcome: self.relatedOutcome()
        };
        if (self.speciesAsset) {
            json.speciesAsset = self.speciesAsset.name() ? self.speciesAsset.toJSON() : null
        }
        return json;
    };
};

function ActivitiesViewModel(activities, programActivities) {
    var self = this;

    if (!activities) {
        activities = {activities:[]};
    }
    var matchingActivities = _.filter(activities.activities, function(activity) {
        return activity && activity != '' &&  programActivities.indexOf(activity) >= 0;
    });
    var otherActivities =_.filter(activities.activities, function(activity) {
        return activity && activity != '' &&  programActivities.indexOf(activity) < 0;
    });
    self.activities = ko.observableArray(matchingActivities);
    self.activities.otherChecked = ko.observable(otherActivities.length > 0);
    self.activities.otherValue = ko.observable( otherActivities.length > 0 ? otherActivities[0] : undefined);
    self.activities.otherChecked.subscribe(function(value) {
        if (!value) {
            self.activities.otherValue(undefined);
        }
    });
    var otherLabel = 'Other';
    self.activities.selectableActivities = function() {
        var activities = programActivities.slice();
        activities.push(otherLabel);
        return activities;
    }();

    // This variable can be bound to a single select and will use
    // the activities array as storage.  This is used when the
    // singleSelection attribute is set in the template.
    self.activities.singleSelection = ko.computed({
        read: function() {
            var value = matchingActivities.length > 0 ? matchingActivities[0] : undefined;
            if (!value && self.activities.otherValue()) {
                value = otherLabel;
            }
            return value;
        },
        write: function(value) {
            if (value != otherLabel) {
                if (self.activities().length == 0) {
                    self.activities().push(value);
                }
                else {
                    self.activities()[0] = value;
                }
                self.activities.otherChecked(false);
            }
            else {
                self.activities([]);
                self.activities.otherChecked(true);
            }

        }
    });
    self.toJSON = function () {
        var js = ko.mapping.toJS(self);
        if (self.activities.otherChecked() && self.activities.otherValue()) {
            js.activities.push(self.activities.otherValue());
        }
        return js;
    };
}

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
        return report.publicationStatus != 'pendingApproval' &&
            report.publicationStatus != 'published' &&
            toDate < now && (!dueDate || dueDate >= now); // Due date is temporarily optional.
    };

    self.isOverdue = function () {
        return report.publicationStatus != 'pendingApproval' &&
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
