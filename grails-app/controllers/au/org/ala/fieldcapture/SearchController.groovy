package au.org.ala.fieldcapture
import grails.converters.JSON

class SearchController {
    def searchService, webService, speciesService, grailsApplication, commonService

    /**
     * Main search page that takes its input from the search bar in the header
     * @param query
     * @return resp
     */
    def index(String query) {
        params.facets = "associatedProgramFacet,associatedSubProgramFacet,fundingSourceFacet,reportingThemesFacet,typeFacet,organisationFacet,statesFacet,nrmsFacet,lgasFacet,assessment,className"
        [facetsList: params.facets.tokenize(","), results: searchService.fulltextSearch(params)]
    }

    /**
     * Handles queries to support autocomplete for species fields.
     * @param q the typed query.
     * @param limit the maximum number of results to return
     * @return
     */
    def species(String q, Integer limit) {

        render speciesService.searchForSpecies(q, limit, params.listId) as JSON

    }

    @PreAuthorise(accessLevel = 'admin')
    def downloadSearchResults() {
        def path = 'search/downloadSearchResults'
        if (params.view == 'xlsx') {
             path += ".xlsx"
        }
        def facets = []
        facets.addAll(params.getList("fq"))
        facets << "className:au.org.ala.ecodata.Project"
        params.put("fq", facets)
        def url = grailsApplication.config.ecodata.baseUrl + path +  commonService.buildUrlParamsFromMap(params)
        webService.proxyGetRequest(response, url)
    }

}
