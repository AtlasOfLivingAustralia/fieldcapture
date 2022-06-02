package au.org.ala.merit

import grails.converters.JSON
import grails.core.GrailsApplication
import org.apache.http.HttpStatus

class SearchController {
    def searchService, webService, speciesService, commonService, documentService, reportService
    GrailsApplication grailsApplication

    /**
     * Main search page that takes its input from the search bar in the header
     * @param query
     * @return resp
     */
    def index() {
        chain(controller: 'home', action:'projectExplorer', params:params)
    }

    /**
     * Handles queries to support autocomplete for species fields.
     * @param q the typed query.
     * @param limit the maximum number of results to return
     * @return
     */
    def species(String q, Integer limit) {

        render speciesService.searchForSpecies(q, null, limit, params.listId) as JSON

    }

    def searchSpeciesList(String sort, Integer max, Integer offset){
        render speciesService.searchSpeciesList(sort, max, offset) as JSON
    }

    @PreAuthorise(accessLevel = 'siteReadOnly', redirectController ='home', redirectAction = 'index')
    def downloadAllData() {
        params.putAll(downloadParams())
        params.max = 10000 // The default is 5000, and some downloads require more than that.
        def response = searchService.downloadAllData(params)

        render response as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadOrganisationData() {

        params.query = "docType:organisation"
        def path = "search/downloadOrganisationData"

        def facets = []
        facets.addAll(params.getList("fq"))
        facets << "className:au.org.ala.ecodata.Organisation"
        params.put("fq", facets)
        params.putAll(downloadParams())
        searchService.addDefaultFacetQuery(params)
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + path +  commonService.buildUrlParamsFromMap(params)
        def response = webService.doPostWithParams(url, [:]) // POST because the URL can get long.

        render response as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadUserData() {

        String path = "search/downloadUserList"
        params.putAll(downloadParams())
        searchService.addDefaultFacetQuery(params)
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + path +  commonService.buildUrlParamsFromMap(params)
        def response = webService.doPostWithParams(url, [:]) // POST because the URL can get long.

        render response as JSON
    }


    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadSummaryData() {
       searchService.downloadSummaryData(params, response)
    }

    @PreAuthorise(accessLevel = 'siteReadOnly', redirectController ='home', redirectAction = 'index')
    def downloadShapefile() {
        params.putAll(downloadParams())
        boolean success = searchService.downloadShapefile(params)
        Map resp = [status: success ? HttpStatus.SC_OK : HttpStatus.SC_INTERNAL_SERVER_ERROR]
        if (!success) {
            resp.status = HttpStatus.SC_INTERNAL_SERVER_ERROR
        }
        render resp as JSON
    }

    private Map downloadParams() {
        String systemEmailAddress = grailsApplication.config.getProperty('fieldcapture.system.email.address')
        [
            hubId: SettingService.hubConfig?.hubId,
            downloadUrl: g.createLink(controller:'download', absolute: true)+'/',
            systemEmail: systemEmailAddress,
            senderEmail: systemEmailAddress
        ]
    }

    Map findPotentialHomePageImages() {
        Integer max = params.max as Integer
        Integer offset = params.offset as Integer
        String sort = params.sort

        Map result = reportService.findPotentialHomePageImages(max, offset, sort)
        result.documents = result.documents?.collect{it + [ref:g.createLink(controller: 'project', action:'index', id:it.projectId)]}
        render result as JSON
    }

    def findHomePageNominatedProjects() {
        Integer max = params.max as Integer
        Integer offset = params.offset as Integer
        def projects = reportService.findHomePageNominatedProjects(max, offset)

        projects
    }

}
