/*
    Utilities for managing project representations.
 */

/**
 * A chance to make any on-the-fly changes to projects as they are opened.
 * @param project
 * @param callback optional callback for the results of any asynch saves
 * @returns updated project object
 */
function checkAndUpdateProject (project, callback) {
    var propertiesToSave = {},
        isEmpty=function(x,p){for(p in x)return!1;return!0};
    // add any checks here - return true if the project representation needs to be saved
    propertiesToSave = $.extend(propertiesToSave, createTimelineIfMissing(project));
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
function createTimelineIfMissing (project) {
    if (project.timeline === undefined) {
        var props = {};
        if (project.currentStage !== undefined) {
            props.currentStage = '';
        }
        addTimelineBasedOnStartDate(project);
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
 * @param timeline
 * @param UTCDateStr date must be an ISO8601 string
 * @returns {string}
 */
function findStageFromDate (timeline, UTCDateStr) {
    var stage = 'unknown';
    // try a simple lexical comparison
    $.each(timeline, function (i, period) {
        if (UTCDateStr > period.fromDate && UTCDateStr < period.toDate) {
            stage = period.name;
        }
    });
    return stage;
}

/**
 * Returns the activities associated with the stage.
 * @param activities
 * @param timeline
 * @param stage stage name 
 * @returns {[]}
 */
function findActivitiesForStage (activities, timeline, stage) {
	var stageFromDate = '';
	var stageToDate = '';
	
	$.each(timeline, function (i, period) {
		if(period.name == stage){
			stageFromDate = period.fromDate;
			stageToDate = period.toDate;
		}
	});
	
    stageActivities = $.map(activities, function(act, i) {
    	var endDate = act.endDate ? act.endDate : act.plannedEndDate;
    	var startDate = act.startDate ? act.startDate : act.plannedStartDate;
        if(startDate >= stageFromDate && endDate <= stageToDate){
        	return act;
        }
    });
    return stageActivities;
}

/**
 * Is it a current or past stage
 * @param timeline
 * @param stage current stage name
 * @param period stage period
 * @returns true if past stage.
 */
function isPastStage(timeline, currentStage, period) {

	var stageFromDate = '';
	var stageToDate = '';
	$.each(timeline, function (i, period) {
		if(period.name == currentStage){
			stageFromDate = period.fromDate;
			stageToDate = period.toDate;
		}
	});
	
	return period.toDate <= stageToDate; 
    
}

/**
 * Create project details 
 * @param activities
 * @param timeline
 * @param stage stage name 
 * @returns {[]}
 */
function createProjectDetails(project){
	project.custom = {};
	project.custom['details'] = {};
	project.custom['details'].dataSharingProtocols = {};
	project.custom['details'].dataSharingProtocols["description"] = "";
	project.custom['details'].projectImplementation = {};
	project.custom['details'].projectImplementation["description"] = "";
	project.custom['details'].monitoringApproach = {};
	project.custom['details'].monitoringApproach["description"] = "";
	project.custom['details'].projectPartnership = {};
	project.custom['details'].projectPartnership["description"] = "";
	project.custom['details'].objectives = {};
	project.custom['details'].objectives["rows"] = [{
	               				"shortLabel"  : "",
	               				"description" : "" 
                				}];
	project.custom['details'].milestones = {};
	project.custom['details'].milestones["rows"] = [{
	               				"shortLabel"  : "",
	               				"description" : "",
	               				"dueDate" : ko.observable().extend({simpleDate: false})	 
                				}];
	project.custom['details'].nationalAndRegionalPriorities = {};
	project.custom['details'].nationalAndRegionalPriorities["rows"] = [{
	               				"shortLabel"  : "",
	               				"description" : "",
	               				"dueDate" : ko.observable().extend({simpleDate: false})
	               				}];
	project.custom['details'].risks = {};
	project.custom['details'].risks["overallRisk"] = "";
	project.custom['details'].risks["rows"] = [{
	               				"threat"  : "",
               					"description" : "",
               					"likelihood" : "",
               					"consequence" : "",
               					"riskRating" : "",
               					"currentControl" : "",
               					"residualRisk" : ""	
	               				}];
	project.custom['details'].lastUpdated = "";
	project.custom['details'].status = "";
	
	return project;
}
