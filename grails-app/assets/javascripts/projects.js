//= require jquery.dataTables/jquery.dataTables.js
//= require jquery.dataTables/jquery.dataTables.bootstrap.js
//= require jquery.dataTables/dataTables.tableTools.js
//= require wms
//= require mapWithFeatures.js
//= require fancybox/jquery.fancybox
//= require bootstrap-combobox/bootstrap-combobox.js
//= require jquery.shorten/jquery.shorten.js
//= require jquery.appear/jquery.appear.js
//= require thumbnail.scroller/2.0.3/jquery.mThumbnailScroller.js
//= require jquery.columnizer/jquery.columnizer.js
//= require jquery-gantt/js/jquery.fn.gantt.js
//= require knockout-repeat/2.1/knockout-repeat.js
//= require attach-document.js
//= require jquery.fileDownload/jQuery.fileDownload
//= require meriplan.js
//= require risks.js
//= require sites.js
//= require activity.js
//= require projectActivityPlan.js
//= require projectActivity.js
//= require_self

/*
    Utilities for managing project representations.
 */

/**
 * A chance to make any on-the-fly changes to projects as they are opened.
 * @param project
 * @param callback optional callback for the results of any asynch saves
 * @returns updated project object
 */
function checkAndUpdateProject (project, callback, programs) {
    var propertiesToSave = {},
        isEmpty=function(x,p){for(p in x)return!1;return!0};
    // add any checks here - return true if the project representation needs to be saved
    var program = null;
    if (programs && project.associatedProgram) {
        var matchingProgram = $.grep(programs.programs, function(program, index) {
            return program.name == project.associatedProgram;
        });
        program = matchingProgram[0];
    }
    propertiesToSave = $.extend(propertiesToSave, createTimelineIfMissing(project, program));
    // check for saves
    if (!isEmpty(propertiesToSave) && fcConfig.projectUpdateUrl !== undefined) {
        $.ajax({
            url: fcConfig.projectUpdateUrl,
            type: 'POST',
            data: JSON.stringify(propertiesToSave),
            contentType: 'application/json',
            success: function (data) {
                if (callback) {
                    if (data.error) {
                        callback.call(this, 'error', data.detail + ' \n' + data.error);
                    } else {
                        callback.call(this, 'success');
                    }
                }
            },
            error: function (data) {
                if (callback) {
                    callback.call(this, 'error', data.status);
                }
            }
        });
    }
    return project;
}

/**
 * Injects a newly created timeline if none exists.
 * Clears (but can't delete) any currentStage property. This prop is
 * deprecated because current stage is calculated from the timeline and
 * the current date.
 * @param project
 * @returns updated properties
 */
function createTimelineIfMissing (project, program) {
    if (project.timeline === undefined) {
        var props = {};
        if (project.currentStage !== undefined) {
            props.currentStage = '';
        }
        if (program) {
            addTimelineBasedOnStartDate(project, program.reportingPeriod, program.reportingPeriodAlignedToCalendar || false);
        }
        else {
            addTimelineBasedOnStartDate(project);
        }
        props.timeline = project.timeline;
        return props;
    }
    return {};
}

/**
 * Creates a default timeline based on project start date.
 * Assumes 6 monthly stages with the first containing the project's
 * planned start date.
 * @param project
 */
function addTimelineBasedOnStartDate (project, reportingPeriod, alignToCalendar) {

    if (!reportingPeriod) {
        reportingPeriod = 6;
    }
    if (alignToCalendar == undefined) {
        alignToCalendar = true;
    }

    // planned start date should be an ISO8601 UTC string
    if (project.plannedStartDate === undefined || project.plannedStartDate === '') {
        // make one up so we can proceed
        project.plannedStartDate = new Date(Date.now()).toISOStringNoMillis();
    }
    if (project.plannedEndDate === undefined || project.plannedEndDate === '') {
        // make one up so we can proceed
        var endDate = new Date(Date.now());
        endDate = endDate.setUTCFullYear(endDate.getUTCFullYear()+5);
        project.plannedEndDate = endDate.toISOStringNoMillis();
    }

    var date = Date.fromISO(project.plannedStartDate),
        endDate = Date.fromISO(project.plannedEndDate),
        i = 0;

    if (alignToCalendar) {
        var month = date.getMonth();
        var numPeriods = Math.floor(month/reportingPeriod);
        var monthOfStartDate = numPeriods*reportingPeriod;
        var dayOfStartDate = 1;

        date = new Date(date.getFullYear(), monthOfStartDate, dayOfStartDate);
    }
    project.timeline = [];

    var duration = moment.duration({'months':reportingPeriod});

    var periodStart = moment(date);
    while (periodStart.isBefore(endDate)) {

        var periodEnd = moment(periodStart).add(duration);
        var period = {
            fromDate: periodStart.toISOString(),
            toDate:periodEnd.toISOString()
        };
        period.name = 'Stage ' + (i + 1);
        project.timeline.push(period);

        // add 6 months to date
        periodStart = periodEnd;
        i++;
    }
}

/**
 * Returns the from and to dates of the half year that the specified
 * date falls in.
 * @param date
 * @returns {{fromDate: string, toDate: string}}
 */
function getSixMonthPeriodContainingDate (date) {
    var year = date.getUTCFullYear(),
        midYear = new Date(Date.UTC(year, 6, 0));
    if (date.getTime() < midYear.getTime()) {
        return {
            fromDate: year + "-01-01T00:00:00Z",
            toDate: year + "-07-01T00:00:00Z"
        };
    } else {
        return {
            fromDate: year + "-07-01T00:00:00Z",
            toDate: (year + 1) + "-01-01T00:00:00Z"
        };
    }
}

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

function getBudgetHeaders(project) {
	var headers = [];
    var startYr = moment(project.plannedStartDate).format('YYYY');
    var endYr = moment(project.plannedEndDate).format('YYYY');;
    var startMonth = moment(project.plannedStartDate).format('M');
    var endMonth = moment(project.plannedEndDate).format('M');

    //Is startYr is between jan to june?
    if(startMonth >= 1 &&  startMonth <= 6 ){
        startYr--;
    }

    //Is the end year is between july to dec?
    if(endMonth >= 7 &&  endMonth <= 12 ){
        endYr++;
    }

    var count = endYr - startYr;
    for (i = 0; i < count; i++){
        headers.push(startYr + '/' + ++startYr);
    }
    return headers;

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


function ProjectViewModel(project, isUserEditor, organisations) {
    var self = $.extend(this, new Documents());

    if (isUserEditor === undefined) {
        isUserEditor = false;
    }
    if (!organisations) {
        organisations = [];
    }
    var organisationsMap = {};
    $.each(organisations, function(org) {
        organisationsMap[org.organisationId] = org;
    });
    self.transients = self.transients || {};

    self.name = ko.observable(project.name);
    self.aim = ko.observable(project.aim);
    self.description = ko.observable(project.description).extend({markdown:true});
    self.externalId = ko.observable(project.externalId);
    self.grantId = ko.observable(project.grantId);
    self.manager = ko.observable(project.manager);
    self.plannedStartDate = ko.observable(project.plannedStartDate).extend({simpleDate: false});
    self.plannedEndDate = ko.observable(project.plannedEndDate).extend({simpleDate: false});
    self.funding = ko.observable(project.funding).extend({currency:{}});
    self.regenerateProjectTimeline = ko.observable(false);
    self.projectDatesChanged = ko.computed(function() {
        return project.plannedStartDate != self.plannedStartDate() ||
            project.plannedEndDate != self.plannedEndDate();
    });
    var projectDefault = "active";
    if(project.status){
        projectDefault = project.status;
    }
    self.status = ko.observable(projectDefault.toLowerCase());
    self.projectStatus = [{id: 'active', name:'Active'},{id:'completed',name:'Completed'},{id:'deleted', name:'Deleted'}];

    self.organisationId = ko.observable(project.organisationId);
    self.transients.organisation = ko.observable(organisationsMap[self.organisationId()]);
    self.organisationName = ko.computed(function() {
        var org = self.transients.organisation();
        return org? org.name: project.organisationName;
    });
    self.transients.organisation.subscribe(function(org) {
        if (org && org.organisationId) {
            self.organisationId(org.organisationId);
        }
    });

    self.orgIdSvcProvider = ko.observable(project.orgIdSvcProvider);
    self.transients.serviceProviderOrganisation = ko.observable(organisationsMap[self.orgIdSvcProvider()]);
    self.serviceProviderName = ko.computed(function() {
        var org = self.transients.serviceProviderOrganisation();
        return org? org.name: project.serviceProviderName;
    });
    self.collectoryInstitutionId = ko.computed(function() {
        var org = self.transients.organisation();
        return org? org.collectoryInstitutionId: "";
    });

    self.orgIdGrantee = ko.observable(project.orgIdGrantee);
    self.orgIdSponsor = ko.observable(project.orgIdSponsor);

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
    self.urlWeb = ko.observable(project.urlWeb).extend({url:true});
    self.contractStartDate = ko.observable(project.contractStartDate).extend({simpleDate: false});
    self.contractEndDate = ko.observable(project.contractEndDate).extend({simpleDate: false});
    self.transients.programs = [];
    self.transients.subprograms = {};
    self.transients.subprogramsToDisplay = ko.computed(function () {
        return self.transients.subprograms[self.associatedProgram()];
    });

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
        for (var i=0; i<programs.length; i++) {
            if (programs[i].name === program) {
                return programs[i].projectDatesContracted;
            }
        }
        return true;
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
        if (self.contractDatesFixed()) {
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

    self.transients.dataSharingLicenses = [
            {lic:'CC BY', name:'Creative Commons Attribution'},
            {lic:'CC BY-NC', name:'Creative Commons Attribution-NonCommercial'},
            {lic:'CC BY-SA', name:'Creative Commons Attribution-ShareAlike'},
            {lic:'CC BY-NC-SA', name:'Creative Commons Attribution-NonCommercial-ShareAlike'}
        ];
    self.transients.organisations = organisations;

    self.transients.difficultyLevels = [ "Easy", "Medium", "Hard" ];

    var scienceTypesList = [
        {name:'Biodiversity', value:'biodiversity'},
        {name:'Ecology', value:'ecology'},
        {name:'Natural resource management', value:'nrm'}
    ];
    self.transients.availableScienceTypes = scienceTypesList;
    self.transients.scienceTypeDisplay = ko.pureComputed(function () {
        for (var st = self.scienceType(), i = 0; i < scienceTypesList.length; i++)
            if (st === scienceTypesList[i].value)
                return scienceTypesList[i].name;
    });

    var availableProjectTypes = [
        {name:'Citizen Science Project', display:'Citizen\nScience', value:'citizenScience'},
        {name:'Ecological or biological survey / assessment (not citizen science)', display:'Biological\nScience', value:'survey'},
        {name:'Natural resource management works project', display:'Works\nProject', value:'works'}
    ];
    self.transients.availableProjectTypes = availableProjectTypes;
    self.transients.kindOfProjectDisplay = ko.pureComputed(function () {
        for (var pt = self.transients.kindOfProject(), i = 0; i < availableProjectTypes.length; i++)
            if (pt === availableProjectTypes[i].value)
                return availableProjectTypes[i].display;
    });
    /** Map between the available selection of project types and how the data is stored */
    self.transients.kindOfProject = ko.pureComputed({
        read: function() {
            if (self.isCitizenScience()) {
                return 'citizenScience';
            }
            if (self.projectType()) {
                return self.projectType() == 'survey' ? 'survey' : 'works';
            }
        },
        write: function(value) {
            if (value === 'citizenScience') {
                self.isCitizenScience(true);
                self.projectType('survey');
            }
            else {
                self.isCitizenScience(false);
                self.projectType(value);
            }
        }
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

    self.toJS = function() {
        var toIgnore = self.ignore; // document properties to ignore.
        toIgnore.concat(['transients', 'daysStatus', 'projectDatesChanged', 'collectoryInstitutionId', 'ignore', 'projectStatus']);
        return ko.mapping.toJS(self, {ignore:toIgnore});
    };

    self.modelAsJSON = function() {
        return JSON.stringify(self.toJS());
    };

    // documents
    var docDefaults = newDocumentDefaults(project);
    self.addDocument = function(doc) {
        // check permissions
        if ((isUserEditor && doc.role !== 'approval') ||  doc.public) {
            doc.maxStages = docDefaults.maxStages;
            self.documents.push(new DocumentViewModel(doc));
        }
    };
    self.attachDocument = function() {
        showDocumentAttachInModal(fcConfig.documentUpdateUrl, new DocumentViewModel(docDefaults, {key:'projectId', value:project.projectId}), '#attachDocument')
            .done(function(result){
                self.documents.push(new DocumentViewModel(result))}
            );
    };
    self.editDocumentMetadata = function(document) {
        if (!document.maxStages) {
            document.maxStages = docDefaults.maxStages;
        }
        var url = fcConfig.documentUpdateUrl + "/" + document.documentId;
        showDocumentAttachInModal( url, document, '#attachDocument')
            .done(function(result){
                window.location.href = here; // The display doesn't update properly otherwise.
            });
    };
    self.deleteDocument = function(document) {
        var url = fcConfig.documentDeleteUrl+'/'+document.documentId;
        $.post(url, {}, function() {self.documents.remove(document);});

    };

    if (project.documents) {
        $.each(project.documents, function(i, doc) {
            if (doc.role === "logo") doc.public = true; // for backward compatibility
            self.addDocument(doc);
        });
    }

    // links
    if (project.links) {
        $.each(project.links, function(i, link) {
            self.addLink(link.role, link.url);
        });
    }
};

function newDocumentDefaults(project) {
    var reports = project.reports || [];
    var maxStages = reports.length;
    var currentStage  = findStageFromDate(reports, new Date().toISOStringNoMillis());
    currentStage = stageNumberFromStage(currentStage);

    return {role:'information', maxStages: maxStages, stage:currentStage};
}

/**
 * View model for use by the citizen science project finder page.
 * @param props array of project attributes
 * @constructor
 */
function CitizenScienceFinderProjectViewModel(props) {
    ProjectViewModel.apply(this, [{
        projectId: props[0],
        aim: props[1],
        description: props[3],
        difficulty: props[4],
        plannedEndDate: props[5] && new Date(props[5]),
        hasParticipantCost: props[6],
        hasTeachingMaterials: props[7],
        isDIY: props[8],
        isExternal: props[9],
        isSuitableForChildren: props[10],
        keywords: props[11],
        links: props[12],
        name: props[13],
        organisationId: props[14],
        organisationName: props[15],
        scienceType: props[16],
        plannedStartDate: props[17] && new Date(props[17]),
        documents: [
            {
                public: true,
                role: 'logo',
                url: props[18]
            }
        ],
        urlWeb: props[19]
    }, false, []]);

    var self = this;
    self.transients.locality = props[2] && props[2].locality;
    self.transients.state = props[2] && props[2].state;
}

/**
 * View model for use by the project create and edit pages.  Extends the ProjectViewModel to provide support
 * for organisation search and selection as well as saving project information.
 * @param project pre-populated or existing project data.
 * @param isUserEditor true if the user can edit the project.
 * @param userOrganisations the list of organisations for which the user is a member.
 * @param organisations the list of organisations for which the user is not a member.
 * @constructor
 */
function CreateEditProjectViewModel(project, isUserEditor, userOrganisations, organisations, options) {
    ProjectViewModel.apply(this, [project, isUserEditor, userOrganisations.concat(organisations)]);

    var defaults = {
        projectSaveUrl: fcConfig.projectUpdateUrl + '/' + (project.projectId || ''),
        organisationCreateUrl: fcConfig.organisationCreateUrl,
        blockUIOnSave:true,
        storageKey:project.projectId?project.projectId+'.savedData':'projectData'
    };
    var config = $.extend(defaults, options);

    var self = this;

    // Automatically create the site of type "Project Area" with a name of "Project area for ..."
    var siteViewModel = initSiteViewModel({type:'projectArea'});
    siteViewModel.name = ko.computed(function() {
        return 'Project area for '+self.name();
    });
    self.organisationSearch = new OrganisationSelectionViewModel(organisations, userOrganisations, project.organisationId);

    self.organisationSearch.createOrganisation = function() {
        var projectData = self.modelAsJSON();
        amplify.store(config.storageKey, projectData);
        var here = document.location.href;
        document.location.href = config.organisationCreateUrl+'?returnTo='+here+'&returning=true';
    };
    self.organisationSearch.selection.subscribe(function(newSelection) {
        if (newSelection) {
            self.organisationId(newSelection.organisationId);
        }
    });

    self.ignore = self.ignore.concat(['organisationSearch']);
    self.transients.existingLinks = project.links;

    self.modelAsJSON = function() {
        var projectData = self.toJS();

        var siteData = siteViewModel.toJS();
        var documents = ko.mapping.toJS(self.documents());
        self.fixLinkDocumentIds(self.transients.existingLinks);
        var links = ko.mapping.toJS(self.links());

        // Assemble the data into the package expected by the service.
        projectData.projectSite = siteData;
        projectData.documents = documents;
        projectData.links = links;

        return JSON.stringify(projectData);
    };

    autoSaveModel(self, config.projectSaveUrl, {blockUIOnSave:config.blockUIOnSave, blockUISaveMessage:"Saving project...", storageKey:config.storageKey});
};


/* data structures for handling output targets */
Output = function (name, scores, existingTargets, root) {
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
        if (root.targetsEditable()) {
            self.isSaving(true);
            root.saveOutputTargets();
        }
    });
    this.scores = $.map(scores, function (score, index) {
        var targetValue = 0;
        var matchingTarget = _.find(existingTargets, function(target) { return target.scoreId == score.scoreId} );
        if (matchingTarget) {
            targetValue = matchingTarget.target;
        }
        return new OutputTarget(score, name, targetValue, index === 0, root);
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

OutputTarget = function (score, outputName, value, isFirst, root) {
    var self = this;
    this.outputLabel = outputName;
    this.scoreLabel = score.label;
    this.target = ko.observable(value).extend({numericString:1});
    this.isSaving = ko.observable(false);
    this.isFirst = isFirst;
    this.units = score.units;
    this.scoreId = score.scoreId;
    this.target.subscribe(function() {
        if (root.targetsEditable()) {
            self.isSaving(true);
            root.saveOutputTargets();
        }
    });
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

    self.loadOutputTargets = function () {
        var scoresByOutputType = _.groupBy(relevantScores, function(score) {
            return score.outputType;
        });
        _.each(scoresByOutputType, function(scoresForOutputType, outputType) {

            self.outputTargets.push(new Output(outputType, scoresForOutputType, targets, self));
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
                $("#starBtn i").removeClass("icon-star").addClass("icon-star-empty");
                $("#starBtn span").text("Add to favourites");
            }
        }).fail(function(j,t,e){ alert(t + ":" + e);}).done();
    } else {
        // add star
        $.getJSON(basUrl + "/add" + query, function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                $("#starBtn i").removeClass("icon-star-empty").addClass("icon-star");
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

function ProjectServicesViewModel(project, config) {
    var self = this;

    var services = project.services || [];
    self.services = ko.observableArray(_.clone(services));

    self.projectServicesEdited = ko.computed(function() {
        return !_.isEqual(services, self.services());
    });

    self.undoChanges = function() {
        self.services(_.clone(services));
    };

    // Save project services only
    self.saveProjectServices = function() {

        var servicesPayload = JSON.stringify({ services:self.services() });
        $.ajax({
            url: config.projectUpdateUrl,
            type: 'POST',
            data: servicesPayload,
            contentType: 'application/json',
            success: function (data) {
                if (data.error) {
                    showAlert("Failed to save services: " + data.detail + ' \n' + data.error,
                        "alert-error","services-save-result-placeholder");
                } else {
                    services = _.clone(self.services());
                    self.services.notifySubscribers();

                    showAlert("Project services saved","alert-success","services-save-result-placeholder");
                }
            },
            error: function (data) {
                bootbox.alert('An unhandled error occurred: ' + data.status);
            }
        });
    };
}

function ProjectPageViewModel(project, sites, activities, userRoles, config) {
    var self = this;

    _.extend(this, new ProjectViewModel(project, userRoles.editor, organisations));
    _.extend(this, new MERIPlan(project, config));
    _.extend(this, new Risks(project.risks, config.risksStorageKey));
    _.extend(this, new MERIPlanActions(project, _.extend({}, fcConfig, {declarationModalSelector:'#unlockPlan'})));

    self.workOrderId = ko.observable(project.workOrderId);
    self.userIsCaseManager = ko.observable(userRoles.grantManager);
    self.userIsAdmin = ko.observable(userRoles.admin);
    self.promote = [{id: 'yes', name:'Yes'},{id:'no',name:'No'}];
    self.promoteOnHomepage = ko.observable(project.promoteOnHomepage);
    self.planStatus = ko.observable(project.planStatus);
    self.mapLoaded = ko.observable(false);
    self.transients.variation = ko.observable();
    self.changeActivityDates = ko.observable(false);
    self.contractDatesFixed.subscribe(function() {
        self.changeActivityDates(!self.contractDatesFixed());
    });
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


    self.validateProjectEndDate = function() {

        var endDate = self.plannedEndDate();
        if (endDate <= self.plannedStartDate()) {
            return "The project end date must be after the start date";
        }
        if (project.activities && !self.changeActivityDates()) {
            var lastActivityDate = _.reduce(project.activities, function(max, activity) { return activity.plannedEndDate > max ? activity.plannedEndDate : max; }, project.plannedStartDate);
            if (endDate < lastActivityDate) {
                return "The project end date must be after the last activity in the project ( "+convertToSimpleDate(lastActivityDate)+ " )";
            }
        }

    };

    self.validateProjectStartDate = function() {

        var startDate = self.plannedStartDate();
        if (startDate >= self.plannedEndDate()) {
            return "The project start date must be before the end date";
        }
        if (project.activities && !self.changeActivityDates()) {
            var firstActivityDate = _.reduce(project.activities, function(min, activity) { return activity.plannedEndDate < min ? activity.plannedEndDate : min; }, project.plannedEndDate);
            if (startDate > firstActivityDate) {
                return "The project start date must be before the first activity in the project ( "+convertToSimpleDate(firstActivityDate)+ " )";
            }
        }

    };

    self.saveProjectDetails = function(){
        self.saveProject(false);
    };

    self.cancelProjectDetailsEdits = function() {
        self.details.cancelAutosave();

        document.location.reload(true);
    };

    self.meriPlanPDF = function() {
        var url = config.meriPlanPDFUrl;
        window.open(url,'meri-plan-report');
    };

    self.saveAnnouncements = function(){

        if (!$('#risks-announcements').validationEngine('validate')) {
            return;
        }
        self.details.saveWithErrorDetection(function() {
            $(document).scrollTop(400);
            showAlert("Announcements saved", "alert-success", 'announcement-result-placeholder');
        });
    };

    // Save project details
    self.saveProject = function(enableSubmit){
        if ($('#project-details-validation').validationEngine('validate')) {
            self.details.status('active');
            self.details.saveWithErrorDetection(function() {
                if(enableSubmit) {
                    self.submitChanges();
                }
            });
        }
    };

    self.saveAndSubmitChanges = function(){
        self.saveProject(true);
    };

    self.uploadVariationDoc = function(doc){
        var json = JSON.stringify(doc, function (key, value) {
            return value === undefined ? "" : value;
        });
        $.post(
            config.documentUpdateUrl,
            {document:json},
            function(result) {
                showAlert("Project end date saved","alert-success","save-settings-result-placeholder");
                location.reload();
            })
            .fail(function() {
                alert('Error saving document record');
            });
    };
    self.saveGrantManagerSettings = function () {

        if ($('#grantmanager-validation').validationEngine('validate')) {
            var doc = {oldDate:project.plannedEndDate, newDate:self.plannedEndDate(),reason:self.transients.variation(),role:"variation",projectId:project.projectId};
            var jsData = {
                plannedEndDate: self.plannedEndDate()
            };
            var json = JSON.stringify(jsData, function (key, value) {
                return value === undefined ? "" : value;
            });

            $.ajax({
                url: config.projectUpdateUrl,
                type: 'POST',
                data: json,
                contentType: 'application/json',
                success: function (data) {
                    if (data.error) {
                        showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
                            "alert-error","save-settings-result-placeholder");
                    } else {
                        self.uploadVariationDoc(doc);
                    }
                },
                error: function (data) {
                    var status = data.status;
                    alert('An unhandled error occurred: ' + data.status);
                }
            });
        }
    };

    self.saveSettings = function () {
        if ($('#settings-validation').validationEngine('validate')) {

            // only collect those fields that can be edited in the settings pane
            var jsData = {
                name: self.name(),
                description: self.description(),
                externalId: self.externalId(),
                grantId: self.grantId(),
                workOrderId: self.workOrderId(),
                manager: self.manager(),
                plannedStartDate: self.plannedStartDate(),
                plannedEndDate: self.plannedEndDate(),
                contractStartDate: self.contractStartDate(),
                contractEndDate: self.contractEndDate(),
                organisationId: self.organisationId(),
                organisationName: self.organisationName(),
                orgIdSvcProvider: self.orgIdSvcProvider(),
                serviceProviderName: self.serviceProviderName(),
                associatedProgram: self.associatedProgram(),
                associatedSubProgram: self.associatedSubProgram(),
                funding: new Number(self.funding()),
                status:self.status(),
                promoteOnHomepage:self.promoteOnHomepage(),
                changeActivityDates:self.changeActivityDates()
            };

            // this call to stringify will make sure that undefined values are propagated to
            // the update call - otherwise it is impossible to erase fields
            var json = JSON.stringify(jsData, function (key, value) {
                return value === undefined ? "" : value;
            });

            $.ajax({
                url: config.projectUpdateUrl,
                type: 'POST',
                data: json,
                contentType: 'application/json',
                success: function (data) {
                    if (data.error) {
                        showAlert("Failed to save settings: " + data.detail + ' \n' + data.error,
                            "alert-error","save-result-placeholder");
                    } else {
                        showAlert("Project settings saved","alert-success","save-result-placeholder");
                    }
                },
                error: function (data) {
                    var status = data.status;
                    alert('An unhandled error occurred: ' + data.status);
                }
            });
        }
    };
    self.regenerateStageReports = function() {
        $.ajax(fcConfig.regenerateStageReportsUrl).done(function(data) {
            document.location.reload();
        }).fail(function(data) {
            bootbox.alert('<span class="label label-warning">Error</span> <p>There was an error regenerating the stage reports: '+data+'</p>');
        });
    };

    self.initialiseReports = function() {
        var serviceTargetsViewModel = new ServiceTargets(project.services, project.outputTargets, true, config);
        ko.applyBindings(serviceTargetsViewModel, document.getElementById('serviceTargetsContainer'));
    };

} // end of view model
