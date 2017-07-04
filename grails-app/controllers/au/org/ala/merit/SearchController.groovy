package au.org.ala.merit

import grails.converters.JSON

class SearchController {
    def searchService, webService, speciesService, grailsApplication, commonService, documentService, reportService

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

        render speciesService.searchForSpecies(q, limit, params.listId) as JSON

    }

    def searchSpeciesList(String sort, Integer max, Integer offset){
        render speciesService.searchSpeciesList(sort, max, offset) as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadAllData() {
        params.put("downloadUrl", g.createLink(controller:'document', action:'downloadProjectDataFile', absolute: true)+'/')
        params.put("systemEmail", grailsApplication.config.fieldcapture.system.email.address)
        params.put("senderEmail", grailsApplication.config.fieldcapture.system.email.address)

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
        params.put("downloadUrl", g.createLink(controller:'document', action:'downloadProjectDataFile', absolute: true)+'/')
        params.put("systemEmail", grailsApplication.config.fieldcapture.system.email.address)
        params.put("senderEmail", grailsApplication.config.fieldcapture.system.email.address)
        searchService.addDefaultFacetQuery(params)
        def url = grailsApplication.config.ecodata.baseUrl + path +  commonService.buildUrlParamsFromMap(params)
        def response = webService.doPostWithParams(url, [:]) // POST because the URL can get long.

        render response as JSON
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadUserData() {

        def path = "search/downloadUserList"

        params.put("downloadUrl", g.createLink(controller:'document', action:'downloadProjectDataFile', absolute: true)+'/')
        params.put("systemEmail", grailsApplication.config.fieldcapture.system.email.address)
        params.put("senderEmail", grailsApplication.config.fieldcapture.system.email.address)
        searchService.addDefaultFacetQuery(params)
        def url = grailsApplication.config.ecodata.baseUrl + path +  commonService.buildUrlParamsFromMap(params)
        def response = webService.doPostWithParams(url, [:]) // POST because the URL can get long.

        render response as JSON
    }


    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadSummaryData() {
       searchService.downloadSummaryData(params, response)
    }

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController ='home', redirectAction = 'index')
    def downloadShapefile() {
        params.put("downloadUrl", g.createLink(controller:'document', action:'downloadProjectDataFile', absolute: true)+'/')
        params.put("systemEmail", grailsApplication.config.fieldcapture.system.email.address)
        params.put("senderEmail", grailsApplication.config.fieldcapture.system.email.address)

        def resp = searchService.downloadShapefile(params, response)
        if (resp.status != 200) {
            render view:'/error', model:[error:resp.error]
        }
    }

    Map findPotentialHomePageImages() {
        Integer max = params.max as Integer
        Integer offset = params.offset as Integer

        Map result = reportService.findPotentialHomePageImages(max, offset)
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
