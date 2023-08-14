/**
 * Common functionality around scores, targets and over-delivery.
 * @param config a single item, projectTargetsAndScoresUrl which
 * should be the URL used to retrieve targets for the purposes of
 * checking for target over-delivery.
 * @constructor
 */
var ReportService = function(config) {
    var self = this;

    /**
     * Calls MERIT to get the amount delivered against targets for this project and the supplied activityId as
     * separate checks and returns targets that have been over-delivered in total that also have a non-zero
     * contribution from the activity/report.
     * @param activityId (optional) the activityId to check, otherwise the activityId is expected as a part of the
     * supplied URL.
     * @returns a jQuery Deferred object that will be resolved with over-delivered targets, if any.  Otherwise
     * an array of length 0 will be supplied.
     */
    self.findOverDeliveredTargets = function(activityId) {
        var url = config.projectTargetsAndScoresUrl;
        if (activityId) {
            url += "?activityId="+activityId;
        }
        var deferred = $.Deferred();

        $.get(url).done(function(result) {
            var overDeliveredTargets = [];
            if (!result || !result.resp) {
                console.log("Warning: over-delivery check failed "+result);
                deferred.reject();
                return;
            }
            var projectScores = result.resp.projectScores;
            var reportScores = result.resp.activityScores;
            if (projectScores && projectScores.length > 0) {
                for (var i = 0; i < projectScores.length; i++) {
                    var target = projectScores[i];

                    if (target.overDelivered && reportScores) {
                        var reportScore = _.find(reportScores, function(score) {
                            return score.scoreId == target.scoreId;
                        });
                        if (reportScore && reportScore.result && reportScore.result.result) {
                            overDeliveredTargets.push({overall:target, report:reportScores[i]});
                        }
                    }
                }
            }
            deferred.resolve(overDeliveredTargets);
        }).fail(function(e) {
            deferred.reject(e);
        });
        return deferred;
    };

    self.formatOverDeliveredTarget = function(overDeliveredTarget) {
        var message = '';
        var delivered = overDeliveredTarget.result.result;
        var target = overDeliveredTarget.target;
        var percentOverDelivered = Math.round(delivered/target * 100);
        if (overDeliveredTarget.service) {
            message += overDeliveredTarget.service + ' - ';
        }
        message += overDeliveredTarget.label;
        message += ': '+delivered + ' of ' + target + ' (' + percentOverDelivered + '%)';
        return message;
    }

    /** Returns an HTML formatted string with a message described over-delivered targets */
    self.formatOverDeliveryMessage = function(overDeliveredTargets) {
        var message = '<p><strong>Targets for this project have been over-delivered.</strong></p>'+
            'Please check the reported data for the following targets: <ul>';
        for (var i=0; i<overDeliveredTargets.length; i++) {
            message += "<li>";
            message += self.formatOverDeliveredTarget(overDeliveredTargets[i].overall)
            message += "</li>";
        }
        message += '</ul>';
        return message;
    }

    /** Builds the key used in local storage that indicates a report has been viewed */
    function reportViewKey(reportId) {
        var reportViewKeyPrefix = "report.viewed.";
        return reportViewKeyPrefix+reportId;
    }
    /** Saves that a report has been viewed to local storage */
    self.recordReportView = function(reportId) {
        amplify.store.sessionStorage(reportViewKey(reportId), true);
    }

    /** Checks local storage to see if a report has been viewed in this session */
    self.hasReportBeenViewed = function(reportId) {
        return amplify.store.sessionStorage(reportViewKey(reportId));
    }

    /** retrieves the project/managementUnit reporting history **/
    self.getHistory = function (obj) {
        var objId = obj.objId;
        var id = 'reportingHistory-' + objId;
        var history = '<div style="float:right" id="' + id + '"><img src="' + fcConfig.imageLocation + '/ajax-saver.gif"></div>';
        if (!obj.myProjects) {
            history = '<tr><td colspan="5"><div style="float:right" id="' + id + '"><img src="' + fcConfig.imageLocation + '/ajax-saver.gif"></div></td></tr>';
        }
        var url = obj.objUrl + '/' + objId;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html'
        }).done(function (data) {
            $('#' + id).html(data).slideDown();
        }).fail(function (data) {
            $('#' + id).html('<div float:right">There was an error retrieving the reporting history for this project.</div>');
        });

        return history;
    };

    self.regenerateReports = function(data,url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType:'json',
            contentType: 'application/json'
        }).done(function() {
            blockUIWithMessage("Reports successfully regenerated, reloading page...");
            setTimeout(function(){
                window.location.reload();
            }, 1000);
        }).fail(function() {
            bootbox.alert("Failed to regenerate organisation reports");
            $.unblockUI();
        });

    };
}