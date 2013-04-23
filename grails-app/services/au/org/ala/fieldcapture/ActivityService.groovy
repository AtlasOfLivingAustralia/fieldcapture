package au.org.ala.fieldcapture

import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject

import java.util.regex.Matcher
import java.util.regex.Pattern

class ActivityService {

    def webService, grailsApplication, outputService

    def list() {
        def resp = webService.getJson(grailsApplication.config.ecodata.baseUrl + 'activity/')
        resp.list
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
                    if (k.size() > 4 && k[0..4] == 'total') {
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
