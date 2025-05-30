//= require tab-init.js
//= require wms
//= require mapWithFeatures.js
//= require fancybox/js/jquery.fancybox
//= require @danielfarrell/bootstrap-combobox/js/bootstrap-combobox.js
//= require jquery.shorten/jquery.shorten.js
//= require jquery-appear-original/index.js
//= require thumbnail.scroller/2.0.3/jquery.mThumbnailScroller.js
//= require jquery.columnizer/jquery.columnizer.js
//= require @taitems/jquery-gantt/js/jquery.fn.gantt.js
//= require knockout-repeat/2.1/knockout-repeat.js
//= require attach-document-no-ui.js
//= require jquery-file-download/jquery.fileDownload.js
//= require document.js
//= require meriplan.js
//= require budget.js
//= require risks.js
//= require sites.js
//= require activity.js
//= require projectActivityPlan.js
//= require blog
//= require dataSets
//= require projectService
//= require components.js
//= require_self
//= require prettytextdiff/jquery.pretty-text-diff.min.js
//= require prettytextdiff/diff_match_patch.js
//= require htmldiff.js

/*
    Utilities for managing project representations.
 */
/**
 * Returns the stage within the timeline that contains the specified date.
 * @param stages array of stage reports for the project.
 * @param UTCDateStr date must be an ISO8601 string
 * @returns {string}
 */
function findStageFromDate (stages, UTCDateStr) {
    var stage = 'unknown';
    // try a simple lexical comparison
    $.each(stages, function (i, period) {
        if (UTCDateStr > period.fromDate && UTCDateStr <= period.toDate) {
            stage = period.name;
        }
    });
    return stage;
}

/**
 * Returns stage report status.
 * @param project
 * @param stage
 * @returns {boolean}
 */
function isStageReportable (project, stage) {

    var now =  new Date().toISOStringNoMillis();
    // We want projects that finish before the end of the current reporting period to be able to be reported on
    // without having to wait for the scheduled reporting period.  (e.g. reporting period is 1 July / 1 Jan but the
    // project finishes in October)
    return stage.toDate < now || project.plannedEndDate < now;
}

function isValid(p, a) {
	 a = a.split(".");
	 for (i in a) {
		var key = a[i];
		if (p[key] == null || p[key] == undefined){
			return '';
		}
		p = p[key];
	 }
	 return p;
}

function ProjectViewModel(project) {
    project.geographicInfo = project.geographicInfo || {};
    var self = this;
    // documents
    var docDefaults = newDocumentDefaults(project);

    var documentSettings = {
        maxStages: docDefaults.maxStages,
        stages: [],
        reports: [],
        owner: {
            projectId: project.projectId
        },
        documentUpdateUrl: fcConfig.documentUpdateUrl,
        documentDeleteUrl: fcConfig.documentDeleteUrl
    };
    //Associate project document to stages.
    for(var i = 0; i < docDefaults.maxStages; i++){
        documentSettings.stages.push((i+1))
    }

    _.sortBy(project.reports,function(report){return report.name})
        .forEach(function(report){
            documentSettings.reports.push( {name: report.name, reportId:report.reportId })}
        )

    _.extend(self, new EditableDocumentsViewModel(documentSettings));
    self.externalIds = ko.observableArray(_.map(project.externalIds, function (externalId) {
        return {
            idType: ko.observable(externalId.idType),
            externalId: ko.observable(externalId.externalId)
        };
    }));
    self.externalIdTypes = PROJECT_EXTERNAL_ID_TYPES;

    self.transients = self.transients || {};

    self.name = ko.observable(project.name);
    self.programId = ko.observable(project.programId);
    self.aim = ko.observable(project.aim);
    self.description = ko.observable(project.description).extend({markdown:true});
    self.externalId = ko.observable(project.externalId);
    self.grantId = ko.observable(project.grantId);
    self.manager = ko.observable(project.manager);
    self.comment = ko.observable(project.comment);
    self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
    self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
    self.funding = ko.observable(project.funding).extend({currency:{}});
    self.fundingVerificationDate = ko.observable(project.fundingVerificationDate).extend({simpleDate: false});
    self.verifyFunding = function() {
        self.fundingVerificationDate.date(new Date());
    };
    self.funding.subscribe(function() {
        self.verifyFunding();
    });

    self.regenerateProjectTimeline = ko.observable(false);
    self.projectDatesChanged = ko.computed(function() {
        return project.plannedStartDate != self.plannedStartDate() ||
            project.plannedEndDate != self.plannedEndDate();
    });
    var currentStatus = project.status || ProjectStatus.ACTIVE;
    self.status = ko.observable(currentStatus.toLowerCase());
    self.projectStatus = [{id: ProjectStatus.APPLICATION, name:'Application'}, {id: ProjectStatus.ACTIVE, name:'Active'},{id: ProjectStatus.COMPLETED, name:'Completed'},{id:ProjectStatus.DELETED, name:'Deleted'}, {id:ProjectStatus.TERMINATED, name: "Terminated"}];

    self.terminationReason = ko.observable(project.terminationReason);

    self.status.subscribe(function (newStatus) {
        if (newStatus !== ProjectStatus.TERMINATED){
            self.terminationReason(undefined)
        }
    });

    self.associatedOrgs = ko.observable(project.associatedOrgs);

    self.associatedProgram = ko.observable(); // don't initialise yet - we want the change to trigger dependents
    self.associatedSubProgram = ko.observable(project.associatedSubProgram);
    self.newsAndEvents = ko.observable(project.newsAndEvents).extend({markdown:true});
    self.projectStories = ko.observable(project.projectStories).extend({markdown:true});
    self.dataSharing = ko.observable(project.isDataSharing? "Enabled": "Disabled");
    self.dataSharingLicense = ko.observable(project.dataSharingLicense);
    self.difficulty = ko.observable(project.difficulty);
    self.gear = ko.observable(project.gear);
    self.getInvolved = ko.observable(project.getInvolved).extend({markdown:true});
    self.hasParticipantCost = ko.observable(project.hasParticipantCost);
    self.hasTeachingMaterials = ko.observable(project.hasTeachingMaterials);
    self.isCitizenScience = ko.observable(project.isCitizenScience);
    self.isDIY = ko.observable(project.isDIY);
    self.isExternal = ko.observable(project.isExternal);
    self.isMERIT = ko.observable(project.isMERIT);
    self.isMetadataSharing = ko.observable(project.isMetadataSharing);
    self.isSuitableForChildren = ko.observable(project.isSuitableForChildren);
    self.keywords = ko.observable(project.keywords);
    self.projectPrivacy = ko.observable(project.projectPrivacy);
    self.projectSiteId = project.projectSiteId;
    self.projectType = ko.observable(project.projectType);
    self.scienceType = ko.observable(project.scienceType);
    self.task = ko.observable(project.task);
    self.tags = ko.observableArray(project.tags || []);
    self.urlWeb = ko.observable(project.urlWeb).extend({url:true});
    self.contractStartDate = ko.observable(project.contractStartDate).extend({simpleDate: false});
    self.contractEndDate = ko.observable(project.contractEndDate).extend({simpleDate: false});
    self.geographicInfo = {
        nationwide: ko.observable(project.geographicInfo.nationwide || false),
        statewide: ko.observable(project.geographicInfo.statewide || false),
        overridePrimaryElectorate: ko.observable(project.geographicInfo.overridePrimaryElectorate || false),
        overridePrimaryState: ko.observable(project.geographicInfo.overridePrimaryState || false),
        primaryState: ko.observable(project.geographicInfo.primaryState),
        primaryElectorate: ko.observable(project.geographicInfo.primaryElectorate),
        otherStates: ko.observableArray(project.geographicInfo.otherStates || []),
        otherExcludedStates: ko.observableArray(project.geographicInfo.otherExcludedStates || []),
        otherElectorates: ko.observableArray(project.geographicInfo.otherElectorates || []),
        otherExcludedElectorates: ko.observableArray(project.geographicInfo.otherExcludedElectorates || [])
    };
    self.geographicInfo.nationwide.subscribe(function(newValue) {
        if (newValue) {
            self.geographicInfo.statewide(false);
            self.geographicInfo.primaryState("");
            self.geographicInfo.primaryElectorate("");
            self.geographicInfo.otherStates([]);
            self.geographicInfo.otherElectorates([]);
            self.geographicInfo.otherExcludedStates([]);
            self.geographicInfo.otherExcludedElectorates([]);
        }
    });

    self.geographicInfo.statewide.subscribe(function(newValue) {
        if (newValue) {
            self.geographicInfo.nationwide(false);
            self.geographicInfo.primaryElectorate("");
            self.geographicInfo.otherStates([]);
            self.geographicInfo.otherElectorates([]);
            self.geographicInfo.otherExcludedStates([]);
            self.geographicInfo.otherExcludedElectorates([]);
        }
    });

    // if overriding primary electorate, then we must override primary state by default.
    self.geographicInfo.overridePrimaryElectorate.subscribe(function(newValue) {
        if (newValue) {
            self.geographicInfo.overridePrimaryState(true);
        }
    })

    self.geographicInfo.primaryElectorate.subscribe(function(newValue) {
        if (newValue) {
            var electorate = findElectorate(newValue);
            if (electorate && electorate.state && electorate.state.length > 0) {
                self.geographicInfo.primaryState(electorate.state[0]);
                // if state is set to primary state, remove it from other states
                if (self.geographicInfo.otherStates.indexOf(electorate.state[0]) > -1) {
                    self.geographicInfo.otherStates.remove(electorate.state[0]);
                }
            }
        }
    });

    // automatically add states of selected electorates to other states field
    self.geographicInfo.otherElectorates.subscribe(function(newValue) {
        if (newValue) {
            var otherElectorates = self.geographicInfo.otherElectorates();
            otherElectorates && _.each(otherElectorates, function(name) {
                var electorate = findElectorate(name);
                var states = electorate && electorate.state;
                _.each(states, function(state) {
                    if (state && self.geographicInfo.otherStates.indexOf(state) === -1 && self.geographicInfo.primaryState() !== state) {
                        self.geographicInfo.otherStates.push(state);
                    }
                })
            });
        }
    });

    self.transients.programs = [];
    self.transients.subprograms = {};
    self.transients.subprogramsToDisplay = ko.computed(function () {
        return self.transients.subprograms[self.associatedProgram()];
    });
    self.transients.fixedProjectDuration = ko.observable(false);


    function findElectorate(electorateName) {
        var electorates = self.transients.electorates.originalElectorateList;
        return electorates && _.find(electorates, function(electorate) {
            return electorate.name === electorateName;
        });
    };

    function findStatesElectoratesBelong (electorates) {
        var states = []
        electorates && electorates.forEach(function(electorate) {
            var electorateObj = findElectorate(electorate);
            electorateObj && electorateObj.state && electorateObj.state.forEach (function (state) {
                if (states.indexOf(state) === -1) {
                    states.push.apply(states, electorateObj.state)
                }
            });
        });

        return states;
    }

    var isBeforeToday = function(date) {
        return moment(date) < moment().startOf('day');
    };
    var calculateDurationInDays = function(startDate, endDate) {
        var start = moment(startDate);
        var end = moment(endDate);
        var days = end.diff(start, 'days');
        return days < 0? 0: days;
    };
    var calculateDuration = function(startDate, endDate) {
        if (!startDate || !endDate) {
            return '';
        }
        return Math.ceil(calculateDurationInDays(startDate, endDate)/7);
    };
    var calculateEndDate = function(startDate, duration) {
        var start =  moment(startDate);
        var end = start.add(duration*7, 'days');
        return end.toDate().toISOStringNoMillis();
    };

    self.contractDatesFixed = ko.computed(function() {
        var programs = (self.transients.programsModel && self.transients.programsModel.programs) || [];
        var program = self.associatedProgram(); // Checked outside the loop to force the dependency checker to register this variable (the first time this is computed, the array is empty)
        var contractDatesFixed = true;
        for (var i=0; i<programs.length; i++) {
            if (programs[i].name === program) {
                contractDatesFixed = programs[i].projectDatesContracted;
                break;
            }
        }
        self.transients.fixedProjectDuration(!contractDatesFixed);
        return contractDatesFixed;
    });

    self.transients.daysRemaining = ko.pureComputed(function() {
        var end = self.plannedEndDate();
        return end? isBeforeToday(end)? 0: calculateDurationInDays(undefined, end) + 1: -1;
    });
    self.transients.daysSince = ko.pureComputed(function() {
        var startDate = self.plannedStartDate();
        if (!startDate) return -1;
        var start = moment(startDate);
        var today = moment();
        return today.diff(start, 'days');
    });
    self.transients.daysTotal = ko.pureComputed(function() {
        return self.plannedEndDate()? calculateDurationInDays(self.plannedStartDate(), self.plannedEndDate()): -1;
    });
    self.daysStatus = ko.pureComputed(function(){
        return self.transients.daysRemaining()? "active": "ended";
    });
    self.transients.since = ko.pureComputed(function(){
        var daysSince = self.transients.daysSince();
        if (daysSince < 0) {
            daysSince = -daysSince;
            if (daysSince === 1) return "tomorrow";
            if (daysSince < 30) return "in " + daysSince + " days";
            if (daysSince < 32) return "in about a month";
            if (daysSince < 365) return "in " + (daysSince / 30).toFixed(1) + " months";
            if (daysSince === 365) return "in one year";
            return "in " + (daysSince / 365).toFixed(1) + " years";
        }
        if (daysSince === 0) return "today";
        if (daysSince === 1) return "yesterday";
        if (daysSince < 30) return daysSince + " days ago";
        if (daysSince < 32) return "about a month ago";
        if (daysSince < 365) return (daysSince / 30).toFixed(1) + " months ago";
        if (daysSince === 365) return "one year ago";
        return (daysSince / 365).toFixed(1) + " years ago";
    });
    var updatingDurations = false; // Flag to prevent endless loops during change of end date / duration.
    self.transients.plannedDuration = ko.observable(calculateDuration(self.plannedStartDate(), self.plannedEndDate()));
    self.transients.plannedDuration.subscribe(function(newDuration) {
        if (updatingDurations) {
            return;
        }
        try {
            updatingDurations = true;
            self.plannedEndDate(calculateEndDate(self.plannedStartDate(), newDuration));
        }
        finally {
            updatingDurations = false;
        }
    });

    self.plannedEndDate.subscribe(function(newEndDate) {
        if (updatingDurations) {
            return;
        }
        try {
            updatingDurations = true;
            self.transients.plannedDuration(calculateDuration(self.plannedStartDate(), newEndDate));
        }
        finally {
            updatingDurations = false;
        }
    });

    self.plannedStartDate.subscribe(function(newStartDate) {
        if (updatingDurations) {
            return;
        }
        if (!self.transients.fixedProjectDuration()) {
            if (!self.plannedEndDate()) {
                return;
            }
            try {
                updatingDurations = true;
                self.transients.plannedDuration(calculateDuration(newStartDate, self.plannedEndDate()));
            }
            finally {
                updatingDurations = false;
            }
        }
        else {
            if (!self.transients.plannedDuration()) {
                return;
            }
            try {
                updatingDurations = true;
                self.plannedEndDate(calculateEndDate(newStartDate, self.transients.plannedDuration()));
            }
            finally {
                updatingDurations = false;
            }
        }
    });

    self.transients.contractDuration = ko.observable(calculateDuration(self.contractStartDate(), self.contractEndDate()));
    self.transients.contractDuration.subscribe(function(newDuration) {
        if (updatingDurations) {
            return;
        }
        if (!self.contractStartDate()) {
            return;
        }
        try {
            updatingDurations = true;
            self.contractEndDate(calculateEndDate(self.contractStartDate(), newDuration));
        }
        finally {
            updatingDurations = false;
        }
    });


    self.contractEndDate.subscribe(function(newEndDate) {
        if (updatingDurations) {
            return;
        }
        if (!self.contractStartDate()) {
            return;
        }
        try {
            updatingDurations = true;
            self.transients.contractDuration(calculateDuration(self.contractStartDate(), newEndDate));
        }
        finally {
            updatingDurations = false;
        }
    });

    self.contractStartDate.subscribe(function(newStartDate) {
        if (updatingDurations) {
            return;
        }
        if (self.contractDatesFixed()) {
            if (!self.contractEndDate()) {
                return;
            }
            try {
                updatingDurations = true;
                self.transients.contractDuration(calculateDuration(newStartDate, self.contractEndDate()));
            }
            finally {
                updatingDurations = false;
            }
        }
        else {
            if (!self.transients.contractDuration()) {
                return;
            }
            try {
                updatingDurations = true;
                self.contractEndDate(calculateEndDate(newStartDate, self.transients.contractDuration()));
            }
            finally {
                updatingDurations = false;
            }
        }
    });

    self.transients.projectId = project.projectId;
    self.transients.currentAssociatedOrgs = ko.pureComputed(function() {
        return _.filter(self.associatedOrgs(), function(org) {
            var toDate = ko.utils.unwrapObservable(org.toDate);
            var fromDate = ko.utils.unwrapObservable(org.fromDate);
            return (!toDate || toDate >= new Date().toISOStringNoMillis()) && (!fromDate || fromDate <= new Date().toISOStringNoMillis());

        });
    });

    self.loadPrograms = function (programsModel) {
        self.transients.programsModel = programsModel;
        $.each(programsModel.programs, function (i, program) {
            if (program.readOnly && self.associatedProgram() != program.name) {
                return;
            }
            self.transients.programs.push(program.name);
            self.transients.subprograms[program.name] = $.map(program.subprograms,function (obj, i){return obj.name});
        });
        self.associatedProgram(project.associatedProgram); // to trigger the computation of sub-programs
    };
    self.transients.removeAll = function (source, toRemove) {
        for(var i = 0; i < toRemove.length; i++) {
            var index = source.indexOf(toRemove[i]);
            if (index > -1) {
                source.splice(index, 1);
            }
        }

        return source
    }

    self.transients.states = ko.observableArray([]);
    self.transients.statesUnavailableForSelection = function (included) {
        var result = [],
            primaryState = self.geographicInfo.primaryState(),
            otherStates = self.geographicInfo.otherStates() || [],
            excludedStates = self.geographicInfo.otherExcludedStates() || [];

        if (primaryState)
            result.push(primaryState)
        if (!included)
            result.push.apply(result, otherStates)
        else
            result.push.apply(result, excludedStates)
        return result
    }
    self.transients.states.statesToIncludeOrExclude = function(include) {
        var toRemove = self.transients.statesUnavailableForSelection(include), states = self.transients.states().concat([]);
        return self.transients.removeAll(states, toRemove);
    };
    self.transients.states.statesToInclude = ko.computed(function() {
        return self.transients.states.statesToIncludeOrExclude(true);
    });
    self.transients.states.statesToExclude = ko.computed(function() {
        return self.transients.states.statesToIncludeOrExclude(false);
    });
    self.transients.electorates = ko.observableArray([]);
    self.transients.electoratesUnavailableForSelection = function (included) {
        var result = [],
            primaryElectorate = self.geographicInfo.primaryElectorate(),
            otherElectorates = self.geographicInfo.otherElectorates() || [],
            excludedElectorates = self.geographicInfo.otherExcludedElectorates() || [];

        if (primaryElectorate)
            result.push(primaryElectorate)
        if (!included)
            result.push.apply(result, otherElectorates)
        else
            result.push.apply(result, excludedElectorates)
        return result
    }
    self.transients.electorates.electoratesToIncludeOrExclude = function(include) {
        var toRemove = self.transients.electoratesUnavailableForSelection(include), source = self.transients.electorates().concat([]);
        return self.transients.removeAll(source, toRemove);
    };
    self.transients.electorates.electoratesToInclude = ko.computed(function() {
        return self.transients.electorates.electoratesToIncludeOrExclude(true);
    });
    self.transients.electorates.electoratesToExclude = ko.computed(function() {
        return self.transients.electorates.electoratesToIncludeOrExclude(false);
    });

    self.loadStatesAndElectorates = function() {
        var promise1 = $.getJSON(fcConfig.listOfStatesUrl, function(data) {
            var states = [];
            $.each(data, function(i, state) {
                states.push(state.name);
            });

            self.transients.states(states);
        });

        var promse2 = $.getJSON(fcConfig.listOfElectoratesUrl, function(data) {
            var electorates = [];
            $.each(data, function(i, electorate) {
                electorates.push(electorate.name);
            });

            self.transients.electorates(electorates);
            self.transients.electorates.originalElectorateList = data;
        });

        $.when(promise1, promse2).done(self.loadGeographicInfo);
    }

    self.loadGeographicInfo = function () {
        self.geographicInfo.nationwide(project.geographicInfo.nationwide);
        self.geographicInfo.statewide(project.geographicInfo.statewide);
        self.geographicInfo.overridePrimaryElectorate(project.geographicInfo.overridePrimaryElectorate);
        self.geographicInfo.overridePrimaryElectorate(project.geographicInfo.overridePrimaryElectorate);
        self.geographicInfo.primaryState(project.geographicInfo.primaryState);
        self.geographicInfo.primaryElectorate(project.geographicInfo.primaryElectorate);
        self.geographicInfo.otherStates(project.geographicInfo.otherStates);
        self.geographicInfo.otherElectorates(project.geographicInfo.otherElectorates);
        self.geographicInfo.otherExcludedStates(project.geographicInfo.otherExcludedStates);
        self.geographicInfo.otherExcludedElectorates(project.geographicInfo.otherExcludedElectorates);
    }

    self.toJS = function() {
        var toIgnore = self.ignore; // document properties to ignore.
        toIgnore.concat(['transients', 'daysStatus', 'projectDatesChanged', 'collectoryInstitutionId', 'ignore', 'projectStatus']);
        return ko.mapping.toJS(self, {ignore:toIgnore});
    };

    self.modelAsJSON = function() {
        return JSON.stringify(self.toJS());
    };

    if (project.documents) {
        self.loadDocuments(project.documents);
    }

    if (project.links) {
        $.each(project.links, function(i, link) {
            self.addLink(link.role, link.url);
        });
    }
};

function newDocumentDefaults(project, stageReportPrefix) {
    var reports = project.reports || [];
    var stageRegexp = new RegExp(stageReportPrefix+'(\d+)');
    var stageCount = 0;
    for (var i=0; i<reports.length; i++) {
        if (reports[i].type == 'Activity') {
            stageCount++
        }
    }

    var maxStages = stageCount;
    var currentStage  = findStageFromDate(reports, new Date().toISOStringNoMillis());
    currentStage = stageNumberFromStage(currentStage);

    return {role:'information', maxStages: maxStages, stage:currentStage};
}


/* data structures for handling output targets */
Output = function (name, scores, existingTargets, changeCallback) {
    var self = this;
    this.name = name;
    this.outcomeTarget = ko.observable(function () {
        // find any existing outcome value for this output
        var outcomeValue = "";
        $.each(existingTargets || [], function (j, existingTarget) {
            if (existingTarget.outcomeTarget && existingTarget.outputLabel === self.name) {
                outcomeValue = existingTarget.outcomeTarget;
                return false; // end the loop
            }
        });
        return outcomeValue;
    }());
    this.outcomeTarget.subscribe(function() {
        if (_.isFunction(changeCallback)) {
            changeCallback(self);
        }
    });
    this.scores = $.map(scores, function (score, index) {
        var targetValue = 0;
        var matchingTarget = _.find(existingTargets, function(target) { return target.scoreId == score.scoreId} );
        if (matchingTarget) {
            targetValue = matchingTarget.target;
        }
        var target =  new OutputTarget(score, name, targetValue, index === 0);
        target.target.subscribe(function() {
            if (_.isFunction(changeCallback)) {
                changeCallback(self);
            }

        });
        return target;
    });
    this.isSaving = ko.observable(false);
};
Output.prototype.toJSON = function () {
    // we need to produce a flat target structure (for backwards compatibility)
    var self = this,
        targets = $.map(this.scores, function (score) {
            var js = score.toJSON();

            return js;
        });
    // add the outcome target
    targets.push({outputLabel:self.name, outcomeTarget: self.outcomeTarget()});
    return targets;
};
Output.prototype.clearSaving = function () {
    this.isSaving(false);
    $.each(this.scores, function (i, score) { score.isSaving(false) });
};

OutputTarget = function (score, outputName, value, isFirst) {
    var self = this;
    this.outputLabel = outputName;
    this.scoreLabel = score.label;
    this.target = ko.observable(value).extend({numericString:1});
    this.isSaving = ko.observable(false);
    this.isFirst = isFirst;
    this.units = score.units;
    this.scoreId = score.scoreId;
};
OutputTarget.prototype.toJSON = function () {
    var clone = ko.toJS(this);
    delete clone.isSaving;
    delete clone.isFirst;
    return clone;
};

var Outcome = function (target) {
    var self = this;
    this.outputLabel = target.outputLabel;
    this.outcomeText = target.outcomeText;
    this.isSaving = ko.observable(false);
};

Outcome.prototype.toJSON = function () {
    var clone = ko.toJS(this);
    delete clone.isSaving;
    return clone;
};

function OutputTargetService(config) {
    var self = this;

    self.saveOutputTargets = function(outputTargets) {
        var targets = [];
        $.each(outputTargets, function (i, target) {
            $.merge(targets, target.toJSON());
        });

        var json = JSON.stringify({outputTargets:targets});

        return $.ajax({
            url: config.saveTargetsUrl,
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success: function (data) {
                if (data.error) {
                    alert(data.detail + ' \n' + data.error);
                }
            },
            error: function (data) {
                alert('An unhandled error occurred: ' + data.status);
            },
            complete: function(data) {
                $.each(outputTargets, function(i, target) {
                    // The timeout is here to ensure the save indicator is visible long enough for the
                    // user to notice.
                    setTimeout(function(){target.clearSaving();}, 1000);
                });
            }
        });

    };

    self.getScoresForProject = function() {
        return $.getJSON(config.projectScoresUrl);
    };
};

function OutputTargets(activities, targets, targetsEditable, scores, config) {

    var self = this;
    var outputTargetService = new OutputTargetService(config);

    var defaults = {
        saveTargetsUrl: fcConfig.projectUpdateUrl
    };
    var options = $.extend(defaults, config);

    var activityTypes = _.uniq(_.pluck(activities, 'type'));

    // Find all scores that are derived from the supplied activities.
    var relevantScores = _.filter(scores, function(score) {
        return _.some(score.entityTypes, function(scoreActivity) {
            return _.contains(activityTypes, scoreActivity);
        });
    });

    self.targetsEditable = targetsEditable;

    self.findTargetByScore = function(score) {
        var target = null;
        _.find(self.outputTargets(), function(outputTarget) {
            target = _.find(outputTarget.scores, function(target) {
                return target.scoreId == score.scoreId;
            });
            return target;
        });
        return target;
    };

    self.findOutputTargetByScore = function(score) {
       return _.find(self.outputTargets(), function(outputTarget) {
            return _.find(outputTarget.scores, function(target) {
                return target.scoreId == score.scoreId;
            });
        });
    };

    self.containsAny = function(list1, list2) {
        return _.some(list1, function(item1) {
            return _.contains(list2, item1);
        });
    };

    self.safeToRemove = function(activityType) {

        var result = true;
        if (self.onlyActivityOfType(activityType)) { // If there is more than 1 activity of the same type, it's safe to remove the activity
            var scoresByActivity = _.filter(scores, function(score) {
                return _.contains(score.entityTypes, activityType);
            });

            // Check first if the score has a target, and if so, if any other activities can contribute to this target
            result = !_.some(scoresByActivity, function(score) {
                var target = self.findTargetByScore(score);
                var hasTarget = (target && target.target() && target.target() != '0');
                if (!hasTarget) {
                    return false;
                }
                var otherActivities = _.reject(score.entityTypes, function(type) { return type == activityType});

                return !self.containsAny(otherActivities, activityTypes);
            });
        }
        return result;
    };

    self.onlyActivityOfType = function(activityType) {
        var activitiesByType = _.filter(activities, function(activity) { return activity.type == activityType });
        return activitiesByType && activitiesByType.length == 1;
    };

    self.removeTargetsAssociatedWithActivityType = function(activityType) {
        var scoresForActivity = _.filter(scores, function(score) {
            return _.contains(score.entityTypes, activityType);
        });
        $.each(scoresForActivity, function(i, score) {
            var otherActivityTypes = _.filter(score.entityTypes, function (type) {
                return type != activityType
            });
            var otherActivities = _.filter(activities, function (activity) {
                return _.contains(otherActivityTypes, activity.type);
            });
            if (otherActivities.length == 0) {
                var outputTarget = self.findOutputTargetByScore(score);
                if (outputTarget) {
                    outputTarget.scores = _.reject(outputTarget.scores, function(target) { return target.scoreId == score.scoreId });
                    if (outputTarget.scores.length == 0) {
                        self.outputTargets(_.reject(self.outputTargets(), function(t) { return t === outputTarget} ));
                    }
                }

            }
        });
    };

    self.outputTargets = ko.observableArray([]);

    self.saveOutputTargets = function() {
        outputTargetService.saveOutputTargets(self.outputTargets());
    };

    function onChange(output) {
        if (self.targetsEditable()) {
            output.isSaving(true);
            self.saveOutputTargets();
        }
    }
    self.loadOutputTargets = function () {
        var scoresByOutputType = _.groupBy(relevantScores, function(score) {
            return score.outputType;
        });
        _.each(scoresByOutputType, function(scoresForOutputType, outputType) {

            self.outputTargets.push(new Output(outputType, scoresForOutputType, targets, onChange));
        });
    }();

}

/**
 * Star/Unstar project for user - send AJAX and update UI
 *
 * @param boolean isProjectStarredByUser
 */
function toggleStarred(isProjectStarredByUser, userId, projectId) {
    var basUrl = fcConfig.starProjectUrl;
    var query = "?userId="+userId+"&projectId="+projectId;
    if (isProjectStarredByUser) {
        // remove star
        $.getJSON(basUrl + "/remove" + query, function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                $("#starBtn i").removeClass("fa-star").addClass("fa-star-o");
                $("#starBtn span").text("Add to favourites");
            }
        }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
    } else {
        // add star
        $.getJSON(basUrl + "/add" + query, function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                $("#starBtn i").removeClass("fa-star-o").addClass("fa-star");
                $("#starBtn span").text("Remove from favourites");
            }
        }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
    }
}

// custom validator to ensure that only one of two fields is populated
function exclusive (field, rules, i, options) {
    var otherFieldId = rules[i+2], // get the id of the other field
        otherValue = $('#'+otherFieldId).val(),
        thisValue = field.val(),
        message = rules[i+3];
    // checking thisValue is technically redundant as this validator is only called
    // if there is a value in the field
    if (otherValue !== '' && thisValue !== '') {
        return message;
    } else {
        return true;
    }
};

function ProjectPageViewModel(project, sites, activities, userRoles, config) {
    var self = this;

    var projectService = new ProjectService(project, config);
    _.extend(this, projectService);
    _.extend(this, new ProjectViewModel(project));

    self.organisationSearchUrl = config.organisationSearchUrl;
    self.organisationViewUrl = config.organisationViewUrl;

    self.internalOrderId = ko.observable(project.internalOrderId);
    self.userIsCaseManager = ko.observable(userRoles.grantManager);
    self.userIsAdmin = ko.observable(userRoles.admin);
    self.promote = [{id: 'yes', name:'Yes'},{id:'no',name:'No'}];
    self.promoteOnHomepage = ko.observable(project.promoteOnHomepage);
    self.planStatus = ko.observable(project.planStatus);
    self.mapLoaded = ko.observable(false);
    self.transients.variation = ko.observable();
    self.alaHarvest = ko.observable(project.alaHarvest ? true : false);
    self.alaHarvest.subscribe(function(newValue) {
        var data = {alaHarvest: newValue};
        self.saveProjectDataWithoutValidation(data);
    });
    self.transients.yesNoOptions = ["Yes","No"];
    self.transients.alaHarvest = ko.computed({
        read: function () {
            return self.alaHarvest() ? 'Yes' : 'No';
        },
        write: function (newValue) {
            if (newValue === 'Yes') {
                self.alaHarvest(true);
            } else if (newValue === 'No') {
                self.alaHarvest(false);
            }
        }
    });

    self.transients.projectTags = _.map(config.projectTags, function(tag) {
       return {
           id:tag.term,
           text:tag.term,
           description:tag.description
       };
    });

    self.transients.startDateInvalid = ko.observable(false);
    self.transients.disableSave = ko.pureComputed(function() {
        return self.transients.startDateInvalid();
    });

    // Options for project date changes
    self.changeActivityDates = ko.observable(false);
    self.changeActivityDates.subscribe(function(value) {
        self.transients.fixedProjectDuration(value);
    });
    self.includeSubmittedReports = ko.observable(false);
    self.includeSubmittedReports.subscribe(function(value) {

        // The only way submitted reports are allowed to change in activity based reporting projects
        // is if all of the activites are moved along with the project start date
        if (value && config.activityBasedReporting) {
            self.changeActivityDates(true);
        }
    });
    self.dateChangeReason = ko.observable();
    self.keepReportEndDates = ko.observable(!config.activityBasedReporting);

    self.transients.selectOrganisation = function(data){
        self.transients.organisation({organisationId:data.source.organisationId, name:data.label});
    };

    self.transients.selectServiceProviderOrganisation = function(data){
        self.transients.serviceProviderOrganisation({organisationId:data.source.organisationId, name:data.label});
    };
    self.allYears = function(startYear) {
        var currentYear = new Date().getFullYear(), years = [];
        startYear = startYear || 2010;
        while ( startYear <= currentYear+10 ) {
            years.push(startYear++);
        }
        return years;
    };
    self.years = [];
    self.years = self.allYears();

    self.canEditStartDate = ko.computed(function() {
        return !project.hasApprovedOrSubmittedReports || self.includeSubmittedReports();
    });

    self.validateExternalIds = function() {
        if (self.status() != ProjectStatus.APPLICATION) {
            return projectService.validateExternalIds(ko.mapping.toJS(self.externalIds));
        }
    }

    var meriPlanConfig = _.extend({}, config, {
        declarationModalSelector: '#unlockPlan',
        meriSubmissionDeclarationSelector: '#meriSubmissionDeclaration',
        editProjectStartDate: self.canEditStartDate,
        externalIds: self.externalIds,
        canModifyMeriPlan: config.canModifyMeriPlan,
        bieUrl: config.bieUrl,
        searchBieUrl: config.searchBieUrl,
        speciesListUrl: config.speciesListUrl,
        speciesImageUrl: config.speciesImageUrl,
        speciesProfileUrl: config.speciesProfileUrl,
        hasAdminPermission: userRoles.admin || userRoles.grantManager
    });
    self.meriPlan = new MERIPlan(project, projectService, meriPlanConfig);

    self.validateProjectEndDate = function() {

        var endDate = self.plannedEndDate();
        if (endDate <= self.plannedStartDate()) {
            return "The project end date must be after the start date";
        }
        if (!self.changeActivityDates()) {

            if (config.minimumProjectEndDate && config.minimumProjectEndDate !== '' && (endDate < config.minimumProjectEndDate)) {
                return "The project end date must be after "+convertToSimpleDate(config.minimumProjectEndDate);
            }
        }

    };

    /** Formats / pretty-prints the saved config JSON for display */
    var savedProjectConfig = project.config && vkbeautify.json(project.config);

    self.config = ko.observable(savedProjectConfig);

    /** Saves project config */
    self.saveConfiguration = function() {
        var config = null;
        try {
            config = JSON.parse(self.config());
        }
        catch (e) {
            bootbox.alert("Invalid JSON");
            return;
        }

        var jsData = {
            config: config
        };
        projectService.saveProjectData(jsData);
    };

    self.saveSettings = function () {
        var jsData = {
            name: self.name(),
            description: self.description(),
            externalId: self.externalId(),
            grantId: self.grantId(),
            manager: self.manager(),
            comment: self.comment(),
            plannedStartDate: self.plannedStartDate(),
            plannedEndDate: self.plannedEndDate(),
            contractStartDate: self.contractStartDate(),
            contractEndDate: self.contractEndDate(),
            associatedOrgs: self.associatedOrgs(),
            associatedProgram: self.associatedProgram(),
            associatedSubProgram: self.associatedSubProgram(),
            programId: self.programId(),
            funding: new Number(self.funding()),
            fundingVerificationDate: self.fundingVerificationDate() || null, // Convert empty string to null
            status: self.status(),
            terminationReason: self.terminationReason(),
            promoteOnHomepage: self.promoteOnHomepage(),
            externalIds: ko.mapping.toJS(self.externalIds),
            geographicInfo: ko.mapping.toJS(self.geographicInfo),
            options: {
                changeActivityDates: self.changeActivityDates(),
                includeSubmittedReports: self.includeSubmittedReports(),
                keepReportEndDates: self.keepReportEndDates(),
                dateChangeReason: self.dateChangeReason()
            }
        };
        projectService.saveProjectData(jsData);

    };

    self.tagsChanged = ko.computed(function() {
        return !_.isEqual(self.tags(), project.tags);
    });
    self.formatTag = function(tag) {

        return $("<span>"+tag.text + '</span><i class="pull-right">'+tag.description+"</i>");
    };

    self.saveTags = function() {
        projectService.saveProjectDataWithoutValidation({tags:self.tags()});
    }

    self.initialiseSitesTab = function(options) {
        var defaults = {
            featureServiceUrl:fcConfig.featureServiceUrl,
            wmsServerUrl:fcConfig.wmsServerUrl,
            sitesPhotoPointsUrl:fcConfig.sitesPhotoPointsUrl,
            bindingElementId:'sitesList',
            userIsEditor:false,
            sitesTableSelector:'#sites-table',
            selectAllSelector:'#select-all-sites',
            photoPointSelector:'#site-photo-points',
            loadingSpinnerSelector:'#img-spinner',
            photoScrollerSelector:'.photo-slider'
        };

        var config = _.defaults(options, defaults);

        var mapOptions = {
            zoomToBounds:true,
            zoomLimit:16,
            highlightOnHover:true,
            features:[],
            featureServiceUrl: config.featureServiceUrl,
            wmsServerUrl: config.wmsServerUrl,
            leafletIconPath:options.leafletIconPath,
            useAlaMap: config.useAlaMap,
            useGoogleBaseMap: config.useGoogleBaseMap,
            fullscreenControl:false
        };

        var map = createMap(mapOptions);

        var sitesViewModel = new SitesViewModel(project.sites, map, options.mapFeatures, options.userIsEditor, project.projectId);
        ko.applyBindings(sitesViewModel, document.getElementById(options.bindingElementId));
        var $sitesTable = $(options.sitesTableSelector);
        var tableApi = $sitesTable.DataTable( {
                "columnDefs": [
                    {
                        "targets": 0,
                        "orderable": false,
                        "searchable": false,
                        "width":"2em"
                    },
                    {
                        "targets": 1,
                        "orderable": false,
                        "searchable": false,
                        "width":"4em"
                    },
                    {
                        "targets":2,
                        "orderable": false,
                        "searchable": true,
                        "width": "2em",
                        "visible":config.showSiteType
                    },
                    {
                        "targets": 3,
                        "orderable": false,
                        "searchable": true

                    },
                    {
                        "targets":4,
                        "orderData":[5],
                        "width":"6em",
                        "searchable": false,
                        "orderable":true
                    },
                    {
                        "targets":5,
                        "searchable": false,
                        "visible":false

                    }
                ],
                "order":[4, "desc"],
                "language": {
                    "search":'<div class="input-group"><span class="input-group-text" id="basic-addon1"><i class="fa fa-search"></i></span>_INPUT_</div>',
                    "searchPlaceholder":"Search sites..."

                },
                "searchDelay":350
            }
        );

        var visibleIndicies = function() {
            var settings = tableApi.settings()[0];
            var start = settings._iDisplayStart;
            var count = settings._iDisplayLength;

            var visibleIndicies = [];
            for (var i=start; i<Math.min(start+count, settings.aiDisplay.length); i++) {
                visibleIndicies.push(settings.aiDisplay[i]);
            }
            return visibleIndicies;
        };
        sitesViewModel.typeFilter.subscribe(function(filterValue) {

            if (filterValue == 'All') {
                filterValue = "";  // Clear the search.
            }
            $sitesTable.DataTable().column(2).search(filterValue).draw();
        });
        $sitesTable.dataTable().on('draw.dt', function(e) {
            sitesViewModel.sitesFiltered(visibleIndicies());
        });
        $sitesTable.find('tbody').on( 'mouseenter', 'td', function () {
            var table = $sitesTable.DataTable();
            var index = table.cell(this).index();
            if (index) {
                var rowIdx = index.row;
                sitesViewModel.highlightSite(rowIdx);
            }
        } ).on('mouseleave', 'td', function() {
            var table = $sitesTable.DataTable();
            var index = table.cell(this).index();
            if (index) {
                var rowIdx = index.row;
                sitesViewModel.unHighlightSite(rowIdx);
            }

        });
        $(config.selectAllSelector).change(function() {
            var checkbox = this;
            // This lets knockout update the bindings correctly.
            $sitesTable.find('tbody tr :checkbox').trigger('click');
        });
        sitesViewModel.sitesFiltered(visibleIndicies());
        var $sitePhotoPoints = $(config.photoPointSelector);
        $sitePhotoPoints.find('a').click(function(e) {
            e.preventDefault();
            $sitePhotoPoints.html('<image id="img-spinner" width="50" height="50" src="'+config.spinnerUrl+'" alt="Loading"/>');
            $.get(config.sitesPhotoPointsUrl).done(function(data) {

                $sitePhotoPoints.html($(data));
                $sitePhotoPoints.find('img').on('load', function() {

                    var parent = $(this).parents('.thumb');
                    var $caption = $(parent).find('.caption');
                    $caption.outerWidth($(this).width());

                });
                $( config.photoScrollerSelector ).mThumbnailScroller({theme:'hover-classic'});
                $(config.photoScrollerSelector+' .fancybox').fancybox({
                    helpers : {
                        title: {
                            type: 'inside'
                        }
                    },
                    beforeLoad: function() {
                        var el, id = $(this.element).data('caption');

                        if (id) {
                            el = $('#' + id);

                            if (el.length) {
                                this.title = el.html();
                            }
                        }
                    },
                    nextEffect:'fade',
                    previousEffect:'fade'
                });
            });
        });
        return sitesViewModel;
    };

    self.initialiseDataSets = function() {
        var dataSetsConfig = {
            services: config.services,
            dataSetsSelector: config.dataSetsSelector || '#project-data-sets',
            newDataSetUrl:  config.newDataSetUrl,
            editDataSetUrl: config.editDataSetUrl,
            deleteDataSetUrl: config.deleteDataSetUrl,
            viewDataSetUrl: config.viewDataSetUrl,
            downloadDataSetUrl: config.downloadDataSetUrl,
            downloadProjectDataSetsUrl: config.downloadProjectDataSetsUrl,
            returnToUrl: config.returnToUrl,
            reports: project.reports || [],
            downloadableProtocols: config.downloadableProtocols,
            viewReportUrl: config.viewReportUrl,
            minutesToIngestDataSet: config.minutesToIngestDataSet

        };
        var projectService = new ProjectService({}, config);
        var viewModel = new DataSetsViewModel(project.custom && project.custom.dataSets, projectService, dataSetsConfig);
        ko.applyBindings(viewModel, $(dataSetsConfig.dataSetsSelector)[0]);

        var dataTableConfig = {
            columnDefs: [
                {
                    target: 0,
                    sortable: false
                },
                {
                    target: 1,
                    sortable: true
                },
                {
                    target: 2,
                    sortable: true
                },
                {
                    target: 3,
                    sortable: true
                },

                {
                    target: 4,
                    visible: true,
                    sortable:true
                },
                {
                    target: 5,
                    sortable: true,
                },
                {
                    target: 6,
                    sortable:true,
                    orderData: 7
                },
                {
                    target: 7,
                    visible: false,
                    searchable: false
                },
                {
                    target: 8,
                    sortable:true,
                    orderData: 9
                },
                {
                    target: 9,
                    visible: false,
                    searchable: false
                },
                {
                    target: 10,
                    visible:true,
                    sortable:false
                }

            ],
            order: [6, 'desc']
        };
        if (!viewModel.supportsDateColumn) {
            dataTableConfig.columnDefs[2].visible = false;
            dataTableConfig.columnDefs[3].visible = false;
            dataTableConfig.columnDefs[4].visible = false;
            dataTableConfig.columnDefs[5].visible = false;

            dataTableConfig.columnDefs[7].visible = false;
            dataTableConfig.columnDefs[8].visible = false;
            dataTableConfig.order = [1, 'asc'];
        }

        $(dataSetsConfig.dataSetsSelector).find('table').dataTable(dataTableConfig);

    };

    self.initialiseAdminTab = function() {
        $("#settings-validation").validationEngine();
        var meriPlanSection = document.getElementById("edit-meri-plan");
        if (meriPlanSection) {
            ko.applyBindings(self.meriPlan, meriPlanSection);
            // The dirty flag is only attached if the MERI plan is in edit mode.
            if (self.meriPlan.meriPlan().dirtyFlag) {
                self.meriPlan.meriPlan().dirtyFlag.reset();
                self.meriPlan.attachFloatingSave();
            }

        }

        // When the MERI plan is approved, the announcements move to their own section, otherwise they
        // are embedded in the MERI plan itself.
        var announcementsSection = document.getElementById("edit-announcements");
        if (announcementsSection) {
            ko.applyBindings(self.meriPlan, announcementsSection);
        }

        var risksChangesReport = document.getElementById(config.riskChangesReportElementId);
        if (risksChangesReport) {
            var reportOptions = {
                riskChangesReportHtmlUrl: config.riskChangesReportHtmlUrl,
                riskChangesReportPdfUrl: config.riskChangesReportPdfUrl
            };
            var risksReportViewModel = new RisksReportViewModel(project, reportOptions);
            ko.applyBindings(risksReportViewModel, risksChangesReport);
        }

        var requestLabelsConfig = {
            requestLabelUrl: fcConfig.requestLabelUrl
        };

        var requestLabelsSection = document.getElementById('request-label-form');

        if (requestLabelsSection) {
            var RequestLabelsViewModel = function(options) {
                var self = this;
                self.pageCount = ko.observable(1);
                self.requestLabelUrl = ko.computed(function() {
                    return options.requestLabelUrl + '?pageCount=' + self.pageCount();
                });
            };

            ko.applyBindings(new RequestLabelsViewModel(requestLabelsConfig), document.getElementById('request-label-form'));
        }

    };

    self.initialiseMeriPlan = function() {
        ko.applyBindings(self.meriPlan, document.getElementById("view-meri-plan"));
        initialiseDocumentTable('#meriPlanDocumentList');
    };

    self.validateProjectStartDate = function() {

        var startDateSelector = "#settings-validation input[data-bind*=plannedStartDate]";

        var message;
        var startDate = self.plannedStartDate();
        if (!self.plannedStartDate()) {
            message =  "The planned start date is a required field";
        }
        if (startDate >= self.plannedEndDate()) {
            message =  "The project start date must be before the end date";
        }
        if (config.activityBasedReporting && project.activities && !self.changeActivityDates()) {
            var firstActivityDate = _.reduce(project.activities, function(min, activity) { return activity.plannedEndDate < min ? activity.plannedEndDate : min; }, project.plannedEndDate);
            if (startDate > firstActivityDate) {
                message = "The project start date must be before the first activity in the project ( "+convertToSimpleDate(firstActivityDate)+ " )";
            }
        }

        self.transients.startDateInvalid(true);


        if (message) {
            setTimeout(function() {
                $(startDateSelector).validationEngine("showPrompt", message, "topRight", true);
            }, 100);

        }
        // Validate via ajax
        else {
            var dateChangeOptions = {
                changeActivityDates: self.changeActivityDates(),
                includeSubmittedReports: self.includeSubmittedReports(),
                keepReportEndDates: self.keepReportEndDates(),
                dateChangeReason: self.dateChangeReason()
            };

            var data = _.extend({
                plannedStartDate:self.plannedStartDate(),
                plannedEndDate:self.plannedEndDate(),
            }, dateChangeOptions);
            $.ajax({
                url:config.projectDatesValidationUrl,
                data:data}).done(function (result) {
                if (result.valid) {
                    self.transients.startDateInvalid(false);
                }
                else {
                    self.transients.startDateInvalid(true);
                    setTimeout(function() {
                        $(startDateSelector).validationEngine("showPrompt", result.message, "topRight", true);
                    }, 100);

                }


            }).fail(function() {
                bootbox.alert("There was an error validating the project start date.  Please refresh the page and try again.");
            });
        }

    };

    self.plannedStartDate.subscribe(function() {
       self.validateProjectStartDate();
    });
    self.plannedEndDate.subscribe(function() {
        self.validateProjectStartDate();
    });

    self.saveAnnouncements = function(){

        if (!$('#risks-announcements').validationEngine('validate')) {
            return;
        }
        self.meriPlan.meriPlan().saveWithErrorDetection(function() {
            $(document).scrollTop(400);
            showAlert("Announcements saved", "alert-success", 'announcement-result-placeholder');
        });
    };

    self.regenerateStageReports = function() {
        $.ajax(fcConfig.regenerateStageReportsUrl).done(function(data) {
            document.location.reload();
        }).fail(function(data) {
            bootbox.alert('<span class="label label-warning">Error</span> <p>There was an error regenerating the stage reports: '+data+'</p>');
        });
    };

    self.initialiseReports = function() {
    };

    $('#gotoEditBlog').click(function () {
        amplify.store('project-admin-tab-state', '#editProjectBlog');
        $('#admin-tab').tab('show');
    });

} // end of view model


/**
 * This is the view model for the section of the risks & threats tab that can select dates and generate reports.
 * @param project The project to generate risks reports for.
 * @param options
 * {
 *       riskChangesReportHtmlUrl: <the url for generating an HTML report>
 *       riskChangesReportPdfUrl: <the url for generating a PDF report>
 * }
 */
var RisksReportViewModel = function(project, options) {
    var self = this;


    var projectEndDate = moment(project.plannedEndDate);
    var projectStartDate = moment(project.plannedStartDate);

    function truncateToProjectDates(date) {
        if (date.isAfter(projectEndDate)) {
            date = projectEndDate;
        }
        if (date.isBefore(projectStartDate)) {
            date = projectStartDate;
        }
        return date;
    }
    var defaultToDate = truncateToProjectDates(moment());
    var defaultFromDate = truncateToProjectDates(moment().subtract(3, 'months'));

    self.fromDate = ko.observable().extend({simpleDate:false});
    self.fromDate.date(defaultFromDate.toDate());
    self.toDate = ko.observable().extend({simpleDate:false});
    self.toDate.date(defaultToDate.toDate());
    self.orientation = ko.observable('portrait');

    function displayReport(url) {
        var paramString= '?fromDate='+self.fromDate()+'&toDate='+self.toDate();
        paramString+='&sections=Project+risks+changes';
        paramString+='&orientation='+self.orientation();

        window.open(url+paramString, 'risks-changes-report');
    }
    self.generateRisksReportHTML = function() {
        displayReport(options.riskChangesReportHtmlUrl);
    };
    self.generateRisksReportPDF = function() {
        displayReport(options.riskChangesReportPdfUrl);
    };
};