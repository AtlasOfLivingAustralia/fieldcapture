package au.org.ala.fieldcapture
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject

class ActivityService {

    def webService, grailsApplication, outputService, metadataService

    def getCommonService() {
        grailsApplication.mainContext.commonService
    }

    def constructName = { act ->
        def date = commonService.simpleDateLocalTime(act.startDate) ?:
            commonService.simpleDateLocalTime(act.endDate)
        def dates = []
        if (act.startDate) {
            dates << commonService.simpleDateLocalTime(act.startDate)
        }
        if (act.endDate) {
            dates << commonService.simpleDateLocalTime(act.endDate)
        }
        def dateRange = dates.join('-')

        act.name = act.type + (dateRange ? ' ' + dateRange : '')
        act
    }

    def list() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activity/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def assessments() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'assessment/')
        // inject constructed name
        resp.list.collect(constructName)
    }

    def get(id) {
        def record = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activity/' + id)
        // extract primary outputs
        /*
         NOTE we have to be careful to inject JSONObjects not LinkedHashMaps so they will toString correctly
         when we use the strings to initialise Javascript objects in the GSP.
         */
        record.outputs.each {
            def o = outputService.get(it.outputId)
            if (o?.data) {
                it.scores = new JSONArray()
                o.data.each { k, v ->
                    // todo: using the prefix 'total' as a marker
                    // todo: will need to use the data meta-model
                    if (k.startsWith('total')) {
                        it.scores << new JSONObject([name: k, score: v])
                    }
                }
            }
        }
        record
    }

    def update(id, body) {
        webService.doPost(grailsApplication.config.ecodata.baseUrl + 'activity/' + id, body)
    }

    def delete(id) {
        webService.doDelete(grailsApplication.config.ecodata.baseUrl + 'activity/' + id)
    }

    /**
     * Returns a detailed list of all activities associated with a project.
     *
     * Activities can be directly linked to a project, or more commonly, linked
     * via a site that is associated with the project.
     *
     * Main output scores are also included. As is the meta-model for the activity.
     *
     * @param id of the project
     */
    def activitiesForProject(String id) {
        def list = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activitiesForProject/' + id)?.list
        // inject the metadata model for each activity
        list.each {
            it.model = metadataService.getActivityModel(it.type)
        }
        list
    }

    /**
     * Updates the publicationStatus field of a set of Activities.
     * @param activityIds a List of the activity ids.  Identifies which activities to update.
     * @param status the new value for the publicationStatus field.
     */
    def updatePublicationStatus(activityIds, status) {

        def ids = activityIds.collect{"id=${it}"}.join('&')
        def body = ['publicationStatus':status]
        webService.doPost(grailsApplication.config.ecodata.baseUrl + "activities/?$ids", body)

    }

        /*def convertToSimpleDate(value) {
            def pattern = ~/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/
            if (value instanceof String && pattern.matcher(value).matches()) {
                return "${value[8..9]}-${value[5..6]}-${value[0..3]}"
            }
            return value
        }

        def convertFromSimpleDate(value) {
            def pattern = ~/\d\d-\d\d-\d\d\d\d/
            if (value instanceof String && pattern.matcher(value).matches()) {
                return "${value[6..9]}-${value[3..4]}-${value[0..1]}T00:00:00Z"
            }
            return value
        }

        def convertToSimpleDates(map) {
            def pattern = ~/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/
            // top level only for now
            map.each {entry ->
                entry.value = convertToSimpleDate(entry.value)
            }
            map
        }

        def convertFromSimpleDates(map) {
            def pattern = ~/\d\d-\d\d-\d\d\d\d/
            // top level only for now
            map.each {entry ->
                entry.value = convertFromSimpleDate(entry.value)
            }
            map
        }*/
}
