package au.org.ala.fieldcapture

import grails.converters.JSON
import groovy.json.JsonSlurper

class SearchController {
    def webService
    def commonService

    def indexOld(String query) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        def url = grailsApplication.config.ecodata.baseUrl + 'search' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = " + url
        def resp = webService.getJson(url)
        log.debug "response = " + resp
        [results: resp]
    }

    def index(String query) {
        params.offset = params.offset?:0
        params.max = params.max?:10
        params.query = params.query?:"*:*"
        def url = grailsApplication.config.ecodata.baseUrl + 'search/elastic' + commonService.buildUrlParamsFromMap(params)
        log.debug "url = " + url
        def resp = webService.getJson(url)
        log.debug "response = " + resp
        [results: resp]
    }

    /**
     * Handles queries to support autocomplete for species fields.
     * @param q the typed query.
     * @param limit the maximum number of results to return
     * @return
     */
    def species(String q, Integer limit) {

        if (!limit) {
            limit = 10;
        }

        def listId = params.druid
        if (listId) {
            render filterSpeciesList(q, listId)
        }
        else {
            render webService.get("http://bie.ala.org.au/search/auto.jsonp?q=${q}&limit=${limit}")
        }

    }

    /**
     * Searches the "name" returned by the Species List service for the supplied search term and reformats the
     * results to match those returned by the bie.
     * @param query the term to search for.
     * @param listId the id of the list to search.
     * @return a JSON formatted String of the form {"autoCompleteList":[{...results...}]}
     */
    private String filterSpeciesList(String query, String listId) {
        def listContents = new JsonSlurper().parseText(webService.get("http://lists.ala.org.au/ws/speciesListItems/${listId}"))

        def filtered = listContents.findResults({it.name?.toLowerCase().contains(query.toLowerCase()) ? [id: it.id, name: it.name, matchedNames:[it.name], guid:it.lsid]: null})

        def results = [:];
        results.autoCompleteList = filtered

        return results as JSON
    }

}
