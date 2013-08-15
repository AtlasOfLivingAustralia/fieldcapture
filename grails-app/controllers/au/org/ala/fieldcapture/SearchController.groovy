package au.org.ala.fieldcapture

import grails.converters.JSON
import groovy.json.JsonSlurper

class SearchController {
    def searchService, webService

    /**
     * Main search page that takes its input from the search bar in the header
     * @param query
     * @return resp
     */
    def index(String query) {
        params.facets = "class,fundingSourceFacet,reportingThemesFacet,typeFacet,organisationFacet,statesFacet,nrmsFacet,lgasFacet,assessment"
        [facetsList: params.facets.tokenize(","), results: searchService.fulltextSearch(params)]
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

        // Try the project species list first.
        def listId = params.druid
        if (listId) {
            def results = filterSpeciesList(q, listId)
            if (results.count) {
                render results as JSON
                return
            }
        }

        // If that fails, fall back to the ALA
        def encodedQuery = URLEncoder.encode(q, "UTF-8")
        def url = "${grailsApplication.config.bie.baseURL}/search/auto.jsonp?q=${encodedQuery}&limit=${limit}&idxType=TAXON"
        render webService.get(url)


    }

    /**
     * Searches the "name" returned by the Species List service for the supplied search term and reformats the
     * results to match those returned by the bie.
     * @param query the term to search for.
     * @param listId the id of the list to search.
     * @return a JSON formatted String of the form {"autoCompleteList":[{...results...}]}
     */
    private def filterSpeciesList(String query, String listId) {
        def listContents = new JsonSlurper().parseText(webService.get("${grailsApplication.config.lists.baseURL}/ws/speciesListItems/${listId}"))

        def filtered = listContents.findResults({it.name?.toLowerCase().contains(query.toLowerCase()) ? [id: it.id, listId: listId, name: it.name, scientificNameMatches:[it.name], guid:it.lsid]: null})

        def results = [:];
        results.autoCompleteList = filtered
        results.count = filtered.size()

        return results
    }

}
