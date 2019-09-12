package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import org.apache.commons.lang.StringUtils

import javax.servlet.http.Cookie

class HomeController {

    def projectService
    def siteService
    def activityService
    def searchService
    def settingService
    def metadataService
    def userService
    def reportService
    def documentService
    def statisticsFactory
    def blogService

    def index() {
        HubSettings hubSettings = SettingService.hubConfig
        if (hubSettings.overridesHomePage()) {
            forward(hubSettings.getHomePageControllerAndAction())
            return
        }

        publicHome()
    }

    /**
     * When we press the login button, the CAS service URL will point at this action, which is a protected path
     * which ensures the CAS ticket validation filter consumes the service ticket.
     * We then just redirect back to the homepage
     */
    def login() {

        final String ALA_AUTH = "ALA-Auth"
        Cookie[] cookies = request.getCookies()
        boolean found = false
        for (Cookie cookie:cookies) {
            if (cookie.name == ALA_AUTH) {
                found = true
            }
        }
        if (!found) {
            Cookie alaAuth = new Cookie(ALA_AUTH, userService.getUser().userName)
            alaAuth.setDomain("ala.org.au")
            alaAuth.setPath("/")
            alaAuth.setHttpOnly(true)
            response.addCookie(alaAuth)
        }

        redirect(url:grailsApplication.config.grails.serverURL)
    }

    def projectExplorer() {

        def model = projectExplorerModel()

        render view:'index', model:model
    }

    def ajaxProjectExplorer() {
        render template: 'projectFinder', model:projectExplorerModel(), layout: 'ajax'
    }

    private Map projectExplorerModel() {
        def facetsList = new ArrayList(SettingService.getHubConfig().availableFacets)
        def mapFacets = new ArrayList(SettingService.getHubConfig().availableMapFacets)

        if(!userService.userIsAlaOrFcAdmin() && !userService.userHasReadOnlyAccess()) {
            def adminFacetList = SettingService.getHubConfig().adminFacets
            facetsList?.removeAll(adminFacetList)
            mapFacets?.removeAll(adminFacetList)
        }

        def fqList = params.getList('fq')
        def allFacets = fqList + (SettingService.getHubConfig().defaultFacetQuery?:[])
        def selectedGeographicFacets = findSelectedGeographicFacets(allFacets)

        def resp = searchService.HomePageFacets(params)

        boolean includeDownloads = userService.userHasReadOnlyAccess() || userService.userIsAlaOrFcAdmin()
        def model = [  facetsList: facetsList,
           mapFacets: mapFacets,
           geographicFacets:selectedGeographicFacets,
           description: settingService.getSettingText(SettingPageType.DESCRIPTION),
           results: resp,
           projectCount: resp?.hits?.total ?: 0,
           includeDownloads: includeDownloads
        ]

        if (includeDownloads) {
            model.activityTypes = metadataService.activityTypesList()
        }
        model
    }

    def publicHome() {

        def statistics = statisticsFactory.randomGroup(session.lastGroup ?: -1)
        session.lastGroup = statistics.group // So we can request more stats and not get 2 in a row the same
        def images = reportService.homePageImages()

        def helpPage = g.createLink([action:'help'])
        def helpLinks = documentService.findAllHelpResources()
        List copyOfLinks = new ArrayList(helpLinks) // The result of the call is cached so we don't want to add elements to it.
        copyOfLinks << [name:'MORE RESOURCES', type:'', url:helpPage]
        def blog = blogService.getSiteBlog()

        def model = [statistics:statistics.statistics, helpLinks:copyOfLinks, images:images, blog:blog]
        if (params.fq) {
            model.putAll(projectExplorerModel())
            model.showProjectExplorer = true
        }
        render view:'public', model:model
    }

    /**
     * The purpose of this method is to enable the display of the spatial object corresponding to a selected
     * value from a geographic facet (e.g. to display the polygon representing NSW on the map if the user has
     * selected NSW from the "state" facet list.
     *
     * First we check to see if we have a geographic facet configuration for any of the user's facet selections.
     * If so, we find the spatial object configuration matching the selected value and add that to the returned
     * model.  The selected polygon can then be requested by PID from geoserver.
     *
     * By convention, the facet field names in the search index have a suffix of "Facet" whereas the facet configuration
     * doesn't include the word "Facet" (although maybe it should).
     */
    private ArrayList findSelectedGeographicFacets(Collection allFacets) {

        def facetConfig = metadataService.getGeographicFacetConfig()
        def selectedGeographicFacets = []

        allFacets.each { facet ->
            def token = facet.split(':')
            if(token.size() == 2){
                def matchingFacet = facetConfig.find { token[0].startsWith(it.key) }
                if (matchingFacet) {
                    def matchingValue = matchingFacet.value.find { it.key == token[1] }
                    if (matchingValue) {
                        selectedGeographicFacets << matchingValue.value
                    }
                }
            }
        }

        selectedGeographicFacets
    }

    def tabbed() {
        [geoPoints: searchService.allGeoPoints(params)]
    }

    def geoService() {
        params.max = params.max?:9999
        if(params.geo){
            params.facets = StringUtils.join(SettingService.getHubConfig().availableFacets, ',')
            render searchService.allProjectsWithSites(params) as JSON
        } else {
            Map resp = searchService.allProjects(params)
            resp?.hits?.hits?.collect { Map hit ->
                if (hit && hit._source) {
                    hit._source = [
                            name:hit._source.name,
                            lastUpdated:hit._source.lastUpdated,
                            description:hit._source.description,
                            organisationName:hit._source.organisationName
                    ]
                }

            }
            render resp as JSON
        }
    }

    def getProjectsForIds() {
        render searchService.getProjectsForIds(params) as JSON
    }

    def myProfile() {
        redirect(controller: 'user')
    }

    def about() {
        renderStaticPage(SettingPageType.ABOUT, true)
    }

    def help() {
        renderStaticPage(SettingPageType.HELP, false)
    }

    def contacts() {
        renderStaticPage(SettingPageType.CONTACTS, false)
    }

    def close() {
        response.setContentType("text/html")
        render """<html><head><script type="text/javascript">window.close();</script></head><body/></html>"""
    }

    def staticPage(String id) {
        def settingType = SettingPageType.getForName(id)
        if (settingType) {
            renderStaticPage(settingType)
        } else {
            response.sendError(404)
            return
        }
    }

    private renderStaticPage(SettingPageType settingType, showNews = false) {
        def content = settingService.getSettingText(settingType)
        render view: 'about', model: [settingType: settingType, content: content, showNews: showNews]
    }
}
