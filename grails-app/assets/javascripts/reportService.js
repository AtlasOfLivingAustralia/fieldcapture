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
                return;
            }
            var projectScores = result.resp.projectScores;
            var reportScores = result.resp.activityScores;
            if (projectScores && projectScores.length > 0) {
                for (var i = 0; i < projectScores.length; i++) {
                    var target = projectScores[i];
                    var reportScore = reportScores[i].result && reportScores[i].result.result;
                    if (target.overDelivered && reportScore) {
                        overDeliveredTargets.push({overall:target, report:reportScores[i]});
                    }
                }
            }
            deferred.resolve(overDeliveredTargets);
        }).fail(function(e) {
            deferred.failed(e);
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
}