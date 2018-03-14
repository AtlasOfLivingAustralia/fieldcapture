ActivityProgress = {
    planned: 'planned',
    started: 'started',
    finished: 'finished',
    deferred: 'deferred',
    cancelled:'cancelled',
};

var PlannedActivity = function (act, isFirst, project, stage, options) {

    function lookupSiteName (siteId, siteList) {
        var site;
        if (siteId !== undefined && siteId !== '') {
            site = $.grep(siteList, function(obj, i) {
                return (obj.siteId === siteId);
            });
            if (site.length > 0) {
                return site[0].name;
            }
        }
        return '';
    }

    var defaults = {
        activityUpdateUrl:fcConfig.activityUpdateUrl,
        documentUpdateUrl:fcConfig.documentUpdateUrl,
        activityEnterDataUrl:fcConfig.activityEnterDataUrl
    };
    var config = _.defaults(options || {}, defaults);

    var self = this;
    this.activityId = act.activityId;
    this.isFirst = isFirst ? this : undefined;
    this.siteId = act.siteId;
    this.siteName = lookupSiteName(act.siteId, project.sites);
    this.type = act.type;
    this.projectStage = act.projectStage;
    this.description = act.description;
    this.hasOutputs = act.outputs && act.outputs.length;
    this.startDate = ko.observable(act.startDate).extend({simpleDate:false});
    this.endDate = ko.observable(act.endDate).extend({simpleDate:false});
    this.plannedStartDate = ko.observable(act.plannedStartDate).extend({simpleDate:false});
    this.plannedEndDate = ko.observable(act.plannedEndDate).extend({simpleDate:false});
    this.progress = ko.observable(act.progress).extend({withPrevious:act.progress});
    this.isSaving = ko.observable(false);
    this.publicationStatus = act.publicationStatus ? act.publicationStatus : 'unpublished';
    this.deferReason = ko.observable(undefined); // a reason document or undefined
    // the following handles the modal dialog for deferral/cancel reasons
    this.displayReasonModalReadOnly = ko.observable(false);
    this.deferReasonHelpText = ko.observable(function() {
        var helpText;
        if (self.progress() == 'deferred') {
            helpText = 'Reason for deferral';
        }
        else if (self.progress() == 'cancelled') {
            helpText = 'Reason for cancellation';
        }
        if (stage.canUpdateStatus()) {
            helpText += '<br><small>(Click icon to edit reason.)</small>';
        }
        return helpText;

    });

    this.displayReasonModal = ko.observable(false);

    this.displayReasonModal.trigger = ko.observable();
    this.displayReasonModal.needsToBeSaved = true; // prevents unnecessary saves when a change to progress is reverted
    this.displayReasonModal.closeReasonModal = function() {
        self.displayReasonModal(false);
        self.displayReasonModal.needsToBeSaved = true;
    };
    this.displayReasonModal.cancelReasonModal = function() {
        if (self.displayReasonModal.trigger() === 'progress_change') {
            self.displayReasonModal.needsToBeSaved = false;
            self.progress.revert();
        }
        self.displayReasonModal.closeReasonModal();
    };
    this.displayReasonModal.saveReasonDocument = function (item , event) {
        // make sure reason text has been added
        var $form = $(event.currentTarget).parents('form');
        if ($form.validationEngine('validate')) {
            if (self.displayReasonModal.trigger() === 'progress_change') {
                self.saveProgress({progress: self.progress(), activityId: self.activityId});
            }
            self.deferReason().recordOnlySave(config.documentUpdateUrl + (self.deferReason().documentId ? ('/'+self.deferReason().documentId) : ''));
            self.displayReasonModal.closeReasonModal();
        }
    };
    this.displayReasonModal.editReason = function () {
        // popup dialog for reason
        self.displayReasonModal.trigger('edit');
        self.displayReasonModal(true);
    };
    // save progress updates - with a reason document in some cases
    this.progress.subscribe(function (newValue) {
        if (!self.progress.changed()) { return; } // Cancel if value hasn't changed
        if (!self.displayReasonModal.needsToBeSaved) { return; } // Cancel if value hasn't changed

        if (newValue === 'deferred' || newValue === 'cancelled') {
            // create a reason document if one doesn't exist
            // NOTE that 'deferReason' role is used in both cases, ie refers to cancel reason as well
            if (self.deferReason() === undefined) {
                self.deferReason(new DocumentViewModel(
                    {role:'deferReason', name:'Deferred/canceled reason document'},
                    {activityId:act.activityId}));
            }
            // popup dialog for reason
            self.displayReasonModal.trigger('progress_change');
            self.displayReasonModal(true);
        } else if (self.displayReasonModal.needsToBeSaved) {

            if ((newValue === ActivityProgress.started || newValue === ActivityProgress.finished)) {
                blockUIWithMessage('Loading activity form...');
                var url = config.activityEnterDataUrl;
                document.location.href = url + "/" + self.activityId + "?returnTo=" + encodeURIComponent(here) + '&progress='+newValue;
            }
            else {
                self.saveProgress({progress: newValue, activityId: self.activityId});
            }
        }
    });

    this.isComplete = function() {
        return [ActivityProgress.finished, ActivityProgress.deferred, ActivityProgress.cancelled].indexOf(self.progress()) >= 0;
    };

    this.saveProgress = function(payload) {
        self.isSaving(true);
        // save new status
        $.ajax({
            url: config.activityUpdateUrl+"/" + self.activityId,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (data) {
                if (data.error) {
                    alert(data.detail + ' \n' + data.error);
                }
                stage.activityUpdated(self);
            },
            error: function (data) {
                bootbox.alert('The activity was not updated due to a login timeout or server error.  Please try again after the page reloads.', function() {location.reload();});
            },
            complete: function () {
                //console.log('saved progress');
                self.isSaving(false);
            }
        });
    };


    var reasonDocs = $.grep(act.documents, function(document) {
        return document.role === 'deferReason';
    });
    if (reasonDocs.length > 0) {
        self.deferReason(new DocumentViewModel(reasonDocs[0], {activityId:act.activityId/*, projectId:project.projectId*/}));
    }
    this.isApproved = function() {
        return this.publicationStatus == 'published';
    };
    this.isSubmitted = function() {
        return this.publicationStatus == 'pendingApproval';
    };

    this.editActivityUrl = function () {
        var url;
        if (stage.isReadOnly()) {
            return self.viewActivityUrl();
        }
        return stage.editActivityUrl(self.activityId);
    };
    this.viewActivityUrl = function() {
        return fcConfig.activityViewUrl + "/" + self.activityId + "?returnTo=" + encodeURIComponent(here);
    };
    this.printActivityUrl = function() {
        return fcConfig.activityPrintUrl + "/" + self.activityId;
    };
    this.siteUrl = function () {
        if (act.siteId !== '') {
            return fcConfig.siteViewUrl + '/' + act.siteId;
        }
    };
};

var PlanStage = function (stage, activities, planViewModel, isCurrentStage, project,today, rejectionCategories, showEmptyStages, userIsEditor, options) {

    var defaults = {
        previewStageReportUrl:fcConfig.previewStageReportUrl,
        submitReportUrl:fcConfig.submitReportUrl,
        approveReportUrl:fcConfig.approveReportUrl,
        rejectReportUrl:fcConfig.rejectReportUrl,
        deleteActivitiesUrl:fcConfig.deleteActivitiesUrl
    };
    var config = _.defaults(options || {}, defaults);

    var stageLabel = stage.name;

    // Note that the two $ transforms used to extract activities are not combined because we
    // want the index of the PlannedActivity to be relative to the filtered set of activities.
    var self = this,
        activitiesInThisStage = $.grep(activities, function (act, index) {
            return act.plannedEndDate > stage.fromDate &&  act.plannedEndDate <= stage.toDate;
        });
    this.label = stageLabel;
    self.name = stage.name;
    self.toDate = stage.toDate;
    self.fromDateLabel = stage.fromDate < project.plannedStartDate ? project.plannedStartDate : stage.fromDate;
    self.toDateLabel = stage.toDate > project.plannedEndDate ? project.plannedEndDate : stage.toDate;

    var fromDateForLabel = moment(self.fromDateLabel).add(1, 'hours').toDate();
    var toDateForLabel = moment(self.toDateLabel).subtract(1, 'hours').toDate(); // This is because the stages cut off at midnight on the 1st of each month, adding/subtracting an hour makes the labels fall onto the day before.
    this.datesLabel = convertToSimpleDate(fromDateForLabel, false) + ' - ' + convertToSimpleDate(toDateForLabel, false);
    this.isCurrentStage = isCurrentStage;
    this.isReportable = isStageReportable(project,stage);
    this.projectId = project.projectId;
    this.planViewModel = planViewModel;
    this.showEmptyStages = showEmptyStages;

    sortActivities(activitiesInThisStage);
    this.activities = $.map(activitiesInThisStage, function (act, index) {
        act.projectStage = stageLabel;
        var plannedActivity = new PlannedActivity(act, index === 0, project, self);
        return plannedActivity;
    });

    this.isApproved = function() {
        return stage.publicationStatus == 'published';
    };
    this.isSubmitted = function() {
        return stage.publicationStatus == 'pendingApproval';
    };


    this.readyForApproval = ko.computed(function() {
        return $.grep(self.activities, function (act, i) {
                return !act.isComplete();
            }).length === 0;
    }, this, {deferEvaluation: true});


    this.isComplete = project.status.match(/completed/i) && project.planStatus != PlanStatus.UNLOCKED;

    this.canSubmitReport = ko.pureComputed(function() {
        return !self.isComplete && self.readyForApproval() && !self.isApproved();
    });

    this.canApproveStage = ko.pureComputed(function() {
        return !self.isComplete && self.isSubmitted();
    });

    this.canRejectStage = ko.pureComputed(function() {
        return !self.isComplete && (self.isSubmitted() || self.isApproved());
    });

    this.submitReportHelp = ko.pureComputed(function() {
        if (self.readyForApproval()) {
            return 'Submit this stage for implementation approval.';
        }
        else {
            return 'Report cannot be submitted while activities are still open.';
        }
    });

    this.submitReport = function () {
        var declaration = $('#declaration')[0];
        var declarationViewModel = {

            termsAccepted : ko.observable(false),
            submitReport : function() {
                self.submitStage();
            }
        };
        ko.applyBindings(declarationViewModel, declaration);
        $(declaration).modal({ backdrop: 'static', keyboard: true, show: true }).on('hidden', function() {ko.cleanNode(declaration);});

    };

    this.approveOrRejectStage = function(url, title, buttonText, rejectionCategories) {
        var $reasonModal = $('#reason-modal');
        var reasonViewModel = {
            reason: ko.observable(),
            rejectionCategories:rejectionCategories,
            rejectionCategory: ko.observable(),
            title:title,
            buttonText: buttonText,
            submit:function() {
                self.updateStageStatus(url, this.reason(), this.rejectionCategory());
            }
        };
        ko.applyBindings(reasonViewModel, $reasonModal[0]);
        $reasonModal.modal({backdrop: 'static', keyboard:true, show:true}).on('hidden', function() {ko.cleanNode($reasonModal[0])});
    };

    this.submitStage = function() {
        self.updateStageStatus(config.submitReportUrl);
    };
    this.approveStage = function () {
        self.updateStageStatus(config.approveReportUrl, '', '');
    };
    this.rejectStage = function() {
        self.approveOrRejectStage(config.rejectReportUrl, 'Rejection', 'Reject', rejectionCategories);
    };
    this.deleteStage = function() {
        bootbox.confirm('<span class="label label-important">Warning!</span>  This will delete all of the activities in this stage.  This operation cannot be undone!', function(result) {
            if (result) {
                self.updateStageStatus(config.deleteActivitiesUrl);
            }
        });

    };

    this.variationModal = function() {
        $('#variation').modal("show");
    };

    this.updateStageStatus = function(url, reason, rejectionCategory) {
        var payload = {};
        payload.activityIds = $.map(self.activities, function(act, i) {
            return act.activityId;
        });
        payload.stage = stageLabel;
        payload.reason = reason || '';
        payload.category = rejectionCategory;
        payload.reportId = stage.reportId;
        payload.projectId = self.projectId;
        $.ajax({
            url: url + self.projectId,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (data) {
                if (data.error) {
                    bootbox.alert("The report could not be submited.  This may be due to a login timeout or because not all activities have been completed, deferred or cancelled.  Please try again after the page reloads.", function() {location.reload();});
                }
                else {
                    location.reload();
                }
            },
            error: function (data) {
                bootbox.alert("The report could not be submited due to a login timeout or server error.  Please try again after the page reloads.", function() {location.reload();});
            },
            complete: function () {
                //console.log('saved progress');

            }
        });
    };

    this.isReadOnly = ko.computed(function() {
        if (!userIsEditor) {
            return true;
        }
        return (planViewModel.planStatus() != PlanStatus.UNLOCKED && (self.isSubmitted() || self.isApproved()));
    });
    this.stageStatusTemplateName = ko.computed(function(){
        if (!self.activities || self.activities.length == 0) {
            return 'stageNotReportableTmpl';
        }
        if (!self.isReportable) {
            return 'stageNotReportableTmpl';
        }
        if (self.isApproved()) {
            return 'stageApprovedTmpl';
        }
        if (self.isSubmitted() && today >= project.plannedEndDate) {
            return 'stageSubmittedVariationTmpl';
        }
        if (self.isSubmitted()) {
            return 'stageSubmittedTmpl';
        }
        return 'stageNotApprovedTmpl';
    });

    this.editActivityUrl = function(activityId) {
        var url;
        if (self.canEditOutputData()) {
            url = fcConfig.activityEnterDataUrl + "/" + activityId + "?returnTo=" + encodeURIComponent(here);
            if (planViewModel.planStatus() == PlanStatus.UNLOCKED) {
                url += "&progress=corrected";
            }
        } else if (self.canEditActivity()) {
            url = fcConfig.activityEditUrl + "/" + activityId + "?returnTo=" + encodeURIComponent(here);
        }
        return url;
    };

    this.previewStage = function(){
        var status = "Report not submitted";
        if (!self.isReportable) {
            status = "Report not reportable";
        }
        else if (self.isApproved()) {
            status = "Report approved";
        }
        else if (self.isSubmitted()) {
            status = "Report submitted";
        }
        window.open(config.previewStageReportUrl+'?id='+self.projectId +'&reportId='+stage.reportId+'&status='+status, '_blank');
    };
    this.canEditActivity = ko.computed(function () {
        return !self.isReadOnly() && planViewModel.planStatus() === 'not approved';
    });
    this.canEditOutputData = ko.computed(function () {
        return !self.isReadOnly() && planViewModel.planStatus() === 'approved' || planViewModel.planStatus() == 'unlocked for correction';
    });
    this.canPrintActivity = ko.computed(function () {
        return true;
    });
    this.canDeleteActivity = ko.computed(function () {
        return !self.isReadOnly() && planViewModel.planStatus() === 'not approved';
    });
    this.canUpdateStatus = ko.computed(function () {
        return !self.isReadOnly() && planViewModel.planStatus() === 'approved';
    });

    var key = project.projectId+'-'+stageLabel+'-collapsed';
    var collapsed = amplify.store(key);
    if (collapsed == undefined || collapsed == null) {
        collapsed = self.isApproved();
    }

    this.collapsed = ko.observable(collapsed);
    this.toggleActivities = function() {
        self.collapsed(!self.collapsed());
        amplify.store(key, self.collapsed());
    };

    this.activityUpdated = function() {
        planViewModel.refreshGantChart();
    };
};

function ProjectActivitiesTabViewModel(activities, reports, outputTargets, targetMetadata, project, programModel, today, options, userIsEditor, userIsGrantManager) {

    var self = this;
    _.extend(self, new PlanViewModel(activities, reports, outputTargets, targetMetadata, project, today, options, userIsEditor, userIsGrantManager));
    var minProjectStart = '2013-01-01T13:00:00Z', canModifyProjectStart = false;
    $.each(programModel.programs, function(i, program) {
        if (project.associatedProgram == program.name) {
            canModifyProjectStart = !program.projectDatesContracted; // The project dates aren't constrained by the contract dates.

            $.each(program.subprograms, function(j, subprogram) {
                if (project.associatedSubProgram == subprogram.name) {
                    minProjectStart = subprogram.startDate || minProjectStart;
                    return false;
                }
            });
            return false;
        }
    });

    // Project date changes by user.
    this.canModifyProjectStart = canModifyProjectStart;

    self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate:false});
    self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate:false});
    self.autoUpdateEndDate = ko.observable(true);

    self.changeProjectDates = function() {
        $('#changeProjectDates').modal({backdrop:'static'});
        $('#projectDatesForm').validationEngine();
    };

    self.plannedStartDate.subscribeChanged(function(oldStartDate, newStartDate) {

        if (self.autoUpdateEndDate()) {
            var end = moment(self.plannedEndDate());
            var duration = moment(newStartDate).diff(moment(oldStartDate), 'days');
            end.subtract(duration, 'days');
            self.plannedEndDate(convertToIsoDate(end.toDate()));
        }
    }, null, "beforeChange");

    var originalDuration = moment(project.plannedStartDate).diff(moment(project.plannedEndDate), 'days');
    self.showDurationWarning = ko.computed(function() {
        var duration = moment(self.plannedStartDate()).diff(moment(self.plannedEndDate()), 'days');
        return Math.abs(duration - originalDuration) >= 7;
    });

    // Window scoped for use by jquery validation engine
    window.validateProjectStartDate = function() {
        var value = self.plannedStartDate();
        var endDate = self.plannedEndDate();
        if (value == project.plannedStartDate && endDate == project.plannedEndDate) {
            return 'The dates have not changed';
        }
        var maxProjectStart = project.contractStartDate;
        if (maxProjectStart && value > maxProjectStart) {
            return 'The date must be on or before the contract start date - '+convertToSimpleDate(maxProjectStart);
        }
        if (minProjectStart && value < minProjectStart) {
            return 'The date must be on or after '+convertToSimpleDate(minProjectStart);
        }
    };
    self.saveProjectDates = function() {

        var result = $('#projectDatesForm').validationEngine('validate');
        if (result) {
            $('#changeProjectDates').modal('hide');
            var payload = {projectId: project.projectId, plannedStartDate: self.plannedStartDate(), plannedEndDate: self.plannedEndDate()};
            blockUIWithMessage("Updating project dates...");
            $.ajax({
                url: config.updateProjectDatesUrl + project.projectId,
                type: 'POST',
                data: JSON.stringify(payload),
                contentType: 'application/json'
            }).done(function(data) {
                document.location.reload();
            }).fail(function(data) {
                showAlert("Unable to update the project dates.",
                    "alert-error","status-update-error-placeholder");
                $.unblockUI();
            });
        }
    };
    self.cancelChangeProjectDates = function() {
        $('#changeProjectDates').modal('hide');
    };



    // Project reports
    var defaultReportStage = self.currentProjectStage;
    if (defaultReportStage == 'unknown' && self.stages && self.stages.length > 0) {
        defaultReportStage = self.stages[self.stages.length-1].label;
    }
    self.configureProjectReport = function() {
        $('#projectReportOptions').modal({backdrop:'static'});
    };
    self.reportFromStage = ko.observable(defaultReportStage);
    self.reportToStage = ko.observable(defaultReportStage);
    self.projectReportSections = [
        {value:'Images', text:'Images', default:true},
        {value:'Blog', text:'Blog', default:true},
        {value:'Activity status summary', text:'Activity status summary', default:true},
        {value:'Supporting documents', text:'Supporting documents', default:true},
        {value:'Project outcomes', text:'Project outcomes', default:true},
        {value:'Progress against output targets', text: 'Progress against output targets', default:true},
        {value:'Progress of outputs without targets', text:'Progress of outputs without targets', default:false},
        {value:'Stage report', text:'Stage report', help:'Displays the most recent ‘Progress, Outcomes and Learning’ activity for the period selected. If you have selected the Progress against activities option below, this will already include the ‘Progress, Outcomes and Learning’ activity.', default:false },
        {value:'Project risks', text:'Project risks', default:true},
        {value:'Project risks changes', text:'Project risks changes', help:'Displays all risks created or modified in the reporting period selected.', default:false},
        {value:'Progress against activities', text:'Progress against activities', help:'Includes all activity reporting data for the selected stage(s).  This will only display started or finished activities.', default:true}];

    self.reportIncludedSections = ko.observableArray();
    for (var i=0; i<self.projectReportSections.length; i++) {
        if (self.projectReportSections[i].default) {
            self.reportIncludedSections.push(self.projectReportSections[i].value);
        }
    }
    self.disabledSection = function(section) {
        return section.value == 'Stage report' && self.reportIncludedSections.indexOf('Progress against activities') >= 0;
    };
    self.reportIncludedSections.subscribe(function() {
        if (self.reportIncludedSections.indexOf('Progress against activities') >= 0) {
            if (self.reportIncludedSections.indexOf('Stage report') >= 0) {
                self.reportIncludedSections.splice(self.reportIncludedSections.indexOf('Stage report'), 1);
            }
        }
    });

    self.reportableStages = ko.computed(function() {
        var stages = [];
        $.each(self.stages || [], function(i, stage) {
            stages.push(stage.label);
        });
        return stages;
    });
    self.reportableToStages = ko.computed(function() {
        var stages = [];
        var started = false;
        $.each(self.stages || [], function(i, stage) {
            if (stage.label == self.reportFromStage()) {
                started = true;
            }
            if (started) {
                stages.push(stage.label);
            }

        });
        return stages;
    });
    self.orientation = ko.observable('portrait');
    self.generateProjectReport = function(url) {

        var url = url + '?fromStage='+self.reportFromStage()+'&toStage='+self.reportToStage();
        for (var i=0; i<self.reportIncludedSections().length; i++) {
            url+='&sections='+self.reportIncludedSections()[i];
        }
        url+='&orientation='+self.orientation();
        window.open(url,'project-report');
        $('#projectReportOptions').modal('hide');
    };
    self.generateProjectReportHTML = function() {
        self.generateProjectReport(fcConfig.projectReportUrl);
    };
    self.generateProjectReportPDF = function() {
        self.generateProjectReport(fcConfig.projectReportPDFUrl);
    };

    self.cancelGenerateReport = function() {
        $('#projectReportOptions').modal('hide');
    };

    this.submitReport = function (e) {

        $('#declaration').modal('show');
    };

    self.saveOutputTargets = function() {
        var result;
        if (self.canEditOutputTargets()) {
            if ($('#outputTargetsContainer').validationEngine('validate')) {
                return outputTargetHelper.saveOutputTargets();

            } else {
                // clear the saving indicator when validation fails
                $.each(self.outputTargets(), function (i, target) {
                    target.clearSaving();
                });
            }
        }
    };

};

function PlanViewModel(activities, reports, outputTargets, targetMetadata, project, today, options, userIsEditor, userIsGrantManager) {

    var defaults = {
        updateProjectDatesUrl:fcConfig.updateProjectDatesUrl,
        projectUpdateUrl:fcConfig.projectUpdateUrl,
        activityDeleteUrl:fcConfig.activityDeleteUrl,
        showEmptyStages: project.associatedProgram != 'Green Army'
    };
    var config = _.defaults(options, defaults);
    var self = this;

    this.userIsCaseManager = ko.observable(userIsGrantManager);
    this.planStatus = ko.observable(project.planStatus || 'not approved');
    this.isApproved = ko.computed(function () {
        return (self.planStatus() === 'approved');
    });

    this.isPlanEditable = ko.computed(function() {
        return self.planStatus()==='not approved'
    });

    this.currentDate = ko.observable(new Date().toISOStringNoMillis()); // mechanism for testing behaviour at different dates
    this.currentProjectStage = findStageFromDate(reports,this.currentDate());


    this.loadActivities = function (activities) {
        var stages = [];
        var unallocatedActivities = _.clone(activities);  // Activities are removed from this array when added to a stage.

        // group activities by stage
        $.each(reports, function (index, stageReport) {
            if (stageReport.fromDate < project.plannedEndDate && stageReport.toDate > project.plannedStartDate) {
                var stage = new PlanStage(stageReport, unallocatedActivities, self, stageReport.name === self.currentProjectStage, project,today, config.rejectionCategories, config.showEmptyStages, userIsEditor);
                stages.push(stage);

                // Remove any activities that have been allocated to the stage.
                unallocatedActivities = _.reject(unallocatedActivities, function(activity) {
                    var activityAllocatedToStage = _.find(stage.activities, function(stageActivity) {
                        return stageActivity.activityId == activity.activityId;
                    });
                    return activityAllocatedToStage;
                });
            }
        });

        return stages;
    };

    // This exists to allow the full activity set to be used to do output target checks when activities are deleted
    // but to only display a subset of activities (e.g. those relevant to a particular site).
    var displayedActivities = activities;
    if (config.activityDisplayFilter) {
        displayedActivities = _.filter(activities, config.activityDisplayFilter);
    }
    self.stages = self.loadActivities(displayedActivities);
    self.currentStageReadyForApproval = ko.computed(function () {
        var currPlanStage = $.grep(self.stages, function(stage) {
            return stage.label === self.currentProjectStage;
        });
        return currPlanStage.length > 0 ? currPlanStage[0].readyForApproval() : false;
    });
    self.progressOptions = [ActivityProgress.planned, ActivityProgress.started, ActivityProgress.finished, ActivityProgress.cancelled, ActivityProgress.deferred];
    self.newActivity = function () {
        var context = '',
            projectId = project.projectId,
            returnTo = '?returnTo=' + encodeURIComponent(document.location.href);
        if (projectId) {
            context += '&projectId=' + projectId;
        }
        if (config.defaultSiteId) {
            context += '&siteId=' + config.defaultSiteId;
        }
        document.location.href = fcConfig.activityCreateUrl + returnTo + context;
    };

    self.descriptionExpanded = ko.observable(false);
    self.toggleDescriptions = function() {
        self.descriptionExpanded(!self.descriptionExpanded());
        self.adjustTruncations();
    };

    this.getGanttData = function () {
        var values = [],
            previousStage = '',
            hasAnyValidPlannedEndDate = false;
        $.each(self.stages, function (i, stage) {
            $.each(stage.activities, function (j, act) {
                var statusClass = 'gantt-' + act.progress(),
                    startDate = act.plannedStartDate.date().getTime(),
                    endDate = act.plannedEndDate.date().getTime();
                if (!isNaN(startDate)) {
                    values.push({
                        name:act.projectStage === previousStage ? '' : act.projectStage,
                        desc:act.type,
                        values: [{
                            label: act.type,
                            from: "/Date(" + startDate + ")/",
                            to: "/Date(" + endDate + ")/",
                            customClass: statusClass,
                            dataObj: act
                        }]
                    });
                }
                hasAnyValidPlannedEndDate |= !isNaN(endDate);
                previousStage = act.projectStage;
            });
        });
        // don't return any data if there is no valid end date because the lib will throw an error
        return hasAnyValidPlannedEndDate ? values : [];
    };

    this.refreshGantChart = function() {
        var ganttData = self.getGanttData();
        if (ganttData.length > 0) {
            $("#gantt-container").gantt({
                source: ganttData,
                navigate: "keys",
                scale: "weeks",
                itemsPerPage: 30
            });
        }
    };

    self.canEditOutputTargets = ko.computed(function() {
        return userIsEditor && self.planStatus() === PlanStatus.NOT_APPROVED;
    });

    var outputTargetHelper = new OutputTargets(activities, outputTargets, self.canEditOutputTargets, targetMetadata, config);
    $.extend(self, outputTargetHelper);

    self.deleteActivity = function (activity) {
        // confirm first
        // If the activitity is the only way to contribute to an output target, we need to warn the user
        // and clear the target if necessary.

        var message = "Delete this activity? Are you sure?";
        if (!self.safeToRemove(activity.type)) {
            message = "An output target exists for this activity.  If you delete it the output target will be removed.  Are you sure?";
        }

        bootbox.confirm(message, function(result) {
            if (result) {
                $.getJSON(config.activityDeleteUrl + '/' + activity.activityId,
                    function (data) {
                        if (data.code < 400) {
                            if (self.onlyActivityOfType(activity.type)) {
                                self.removeTargetsAssociatedWithActivityType(activity.type);
                                var result = self.saveOutputTargets();
                                if (result) {
                                    result.done(function() {
                                        document.location.reload();
                                    })
                                }
                                else {
                                    document.location.reload();
                                }
                            }
                            else {
                                document.location.reload();
                            }


                        } else {
                            alert("Failed to delete activity - error " + data.code);
                        }
                    });
            }
        });
    };

    self.adjustTruncations = function() {
        function truncate (cellWidth, originalTextWidth, originalText) {
            var fractionThatFits = cellWidth/originalTextWidth,
                truncationPoint = Math.floor(originalText.length * fractionThatFits) - 4;
            return originalText.substr(0,truncationPoint) + '..';
        }
        $('.truncate').each( function () {
            var $span = $(this),
                text = $span.html(),
                textWidth = $span.textWidth(),
                textLength = text.length,
                original = $span.data('truncation');
            // store original values if first time in
            if (original === undefined) {
                original = {
                    text: text,
                    textWidth: textWidth,
                    textLength: textLength
                };
                $span.data('truncation',original);
            }
            if (!self.descriptionExpanded()) {
                var cellWidth = $span.parent().width(),
                    isTruncated = original.text !== text;

                if (cellWidth > 0 && textWidth > cellWidth) {
                    $span.attr('title',original.text);
                    $span.html(truncate(cellWidth, original.textWidth, original.text));
                } else if (isTruncated && cellWidth > textWidth + 4) {
                    // check whether the text can be fully expanded
                    if (original.textWidth < cellWidth) {
                        $span.html(original.text);
                        $span.removeAttr('title');
                    } else {
                        $span.html(truncate(cellWidth, original.textWidth, original.text));
                    }
                }
            }
            else {
                $span.html(original.text);
                $span.removeAttr('title');
            }
        });
    };

    var timer;
    $(window).resize(function () {
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(self.adjustTruncations, 50);
    });
};


function ProjectReportingTabViewModel(project, today, config) {
    var self = this;

    self.planStatus = ko.observable(PlanStatus.APPROVED);
    self.loadActivities = function (activities, reports) {
        var stages = [];
        var unallocatedActivities = _.clone(activities);  // Activities are removed from this array when added to a stage.

        // group activities by stage
        $.each(reports, function (index, stageReport) {
            if (stageReport.fromDate < project.plannedEndDate && stageReport.toDate > project.plannedStartDate) {
                var stage = new PlanStage(stageReport, unallocatedActivities, self, stageReport.name === self.currentProjectStage, project, today, [], true, false);

                stages.push(stage);

                // Remove any activities that have been allocated to the stage.
                unallocatedActivities = _.reject(unallocatedActivities, function(activity) {
                    var activityAllocatedToStage = _.find(stage.activities, function(stageActivity) {
                        return stageActivity.activityId == activity.activityId;
                    });
                    return activityAllocatedToStage;
                });

                if (stage.activities && stage.activities.length == 1) {
                    stage.reportType = stage.activities[0].type;
                }
                else {
                    stage.reportType = "Default";
                }
            }
        });

        return stages;
    };

    self.openReport = function(data) {
        if (data.activities && data.activities.length == 1) {
            // Report with a single activity, use that...
            document.location.href = config.activityEnterDataUrl+'/'+data.activities[0].activityId;
        }
        else {
            document.location.href = config.openReportUrl;
        }
    };
    self.reports = self.loadActivities(project.activities, project.reports);

}