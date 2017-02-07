package au.org.ala.merit.command

import grails.validation.Validateable

/**
 * The data supplied by the client when changing the status of a report. (approval / submission / rejection / deletion)
 */
@Validateable
class ReportCommand {

    List<String> activityIds
    String reportId
    String projectId

    static constraints = {
        activityIds minSize: 1
    }

}
