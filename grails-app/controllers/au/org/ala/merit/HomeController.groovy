package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import grails.converters.JSON
import grails.core.GrailsApplication
import org.apache.commons.lang.StringUtils

import javax.servlet.http.Cookie
import java.text.SimpleDateFormat

class HomeController {

    def projectService
    def searchService
    def settingService
    def metadataService
    def userService
    def reportService
    def documentService
    def statisticsFactory
    def blogService
    def commonService
    ActivityService activityService
    GrailsApplication grailsApplication

    /** Cookie issued by the ALA authentication system that indicates an SSO session may be available*/
    static final String ALA_AUTH = "ALA-Auth"

    /** This facet is used by name to filter the list of activity types available for download selection */
    static final String ACTIVITY_TYPE_FACET_NAME = 'activities.type.keyword'

    static final DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy")

    def index() {
        HubSettings hubSettings = SettingService.hubConfig
        if (hubSettings.overridesHomePage()) {
            forward(hubSettings.getHomePageControllerAndAction())
            return
        }

        publicHome()
    }


    def helpDocuments(String category) {
        List documents = documentService.findAllHelpDocuments(category)
        [documents:documents]
    }

    @PreAuthorise(accessLevel = 'siteAdmin')
    def editHelpDocuments(String category) {
        List documents = documentService.findAllHelpDocuments(category)
        List categories = documents?.collect{it.labels}.flatten()?.findAll()?.unique()
        [documents:documents, category:category, hubId:SettingService.hubConfig.hubId, categories:categories]
    }

    /**
     * When we press the login button, the CAS service URL will point at this action, which is a protected path
     * which ensures the CAS ticket validation filter consumes the service ticket.
     * We then just redirect back to the homepage
     */
    def login() {

        Cookie[] cookies = request.getCookies()
        boolean found = false
        for (Cookie cookie:cookies) {
            if (cookie.name == ALA_AUTH) {
                found = true
            }
        }
        if (!found) {
            Cookie alaAuth = createAlaCookie()
            response.addCookie(alaAuth)
        }

        redirect(url:grailsApplication.config.getProperty('grails.serverURL'))
    }

    /** The CAS session & ALA cookies can get out of sync, this puts them back in sync */
    private Cookie createAlaCookie() {

        // Don't want the cookie secure in dev environments as HTTPS is generally not used.
        boolean useSecureCookie = grailsApplication.config.getProperty('server.servlet.session.cookie.secure', Boolean, false)
        Cookie alaAuth = new Cookie(ALA_AUTH, userService.getUser().userName)
        alaAuth.setDomain("ala.org.au")
        alaAuth.setPath("/")
        alaAuth.setHttpOnly(true)
        alaAuth.setSecure(useSecureCookie)
        alaAuth
    }

    def projectExplorer() {

        def model = projectExplorerModel()

        render view:'index', model:model
    }

    def ajaxProjectExplorer() {
        render template: 'projectFinder', model:projectExplorerModel(), layout: 'ajax'
    }

    private Map projectExplorerModel() {
        def facetsList = new ArrayList(SettingService.getHubConfig().availableFacets ?:[])
        def mapFacets = new ArrayList(SettingService.getHubConfig().availableMapFacets ?: [])

        boolean canViewAdminFacets = userService.userIsAlaOrFcAdmin() || userService.userHasReadOnlyAccess()
        if (!canViewAdminFacets) {
            List adminFacetList = SettingService.getHubConfig().adminFacets ?: []
            facetsList?.removeAll(adminFacetList)
            mapFacets?.removeAll(adminFacetList)
        }
        boolean canViewDownloads = canViewAdminFacets || userService.userIsSiteAdmin()
        boolean canViewOfficerFacets = userService.userIsSiteAdmin() || userService.userHasReadOnlyAccess()
        if (!canViewOfficerFacets) {
            List officerFacetList = SettingService.getHubConfig().officerFacets ?: []
            facetsList?.removeAll(officerFacetList)
            mapFacets?.removeAll(officerFacetList)
        }

        def fqList = params.getList('fq')
        def allFacets = fqList + (SettingService.getHubConfig().defaultFacetQuery?:[])
        def selectedGeographicFacets = findSelectedGeographicFacets(allFacets)

        def resp = searchService.HomePageFacets(params)

        def model = [
           facetsList: facetsList,
           mapFacets: mapFacets,
           geographicFacets:selectedGeographicFacets,
           description: settingService.getSettingText(SettingPageType.DESCRIPTION),
           results: resp,
           projectCount: resp?.hits?.total ?: 0,
           includeDownloads: canViewDownloads
        ]

        if (canViewAdminFacets) {
            List activityTypes = metadataService.activityTypesList()
            Map activityTypesFacet = resp?.facets?.get(ACTIVITY_TYPE_FACET_NAME)
            model.activityTypes = filterActivityTypesToProjectSelection(activityTypes, activityTypesFacet)
        }
        model
    }

    /**
     * If the activity type facet is available, only make those activities available for
     * download that match the selected projects.
     * @param allActivityTypes all available activity types
     * @param activityTypesFacet the results of the search query containing only those activity types
     * that are associated with a selected project.
     */
    private List filterActivityTypesToProjectSelection(List allActivityTypes, Map activityTypesFacet) {
        List filteredActivityTypes = allActivityTypes
        if (activityTypesFacet) {
            filteredActivityTypes = []
            List selectableActivityTypes = activityTypesFacet?.terms?.collect{it.term}
            List emsaFormNames = activityService.monitoringProtocolForms()?.collect{it.name}
            if (emsaFormNames) {
                selectableActivityTypes.removeAll(emsaFormNames)
            }

            allActivityTypes.each {
                List matchingTypes = it.list?.findAll{it.name in selectableActivityTypes}
                if (matchingTypes) {
                    filteredActivityTypes << [name:it.name, list:matchingTypes]
                }
            }
        }
        filteredActivityTypes
    }

    def publicHome() {
        String expiryDateDisplay = session.getAttribute(LoginRecordingInterceptor.EXPIRY_DATE) ?: null

        def statistics = statisticsFactory.randomGroup(session.lastGroup ?: -1)
        session.lastGroup = statistics.group // So we can request more stats and not get 2 in a row the same
        def images = reportService.homePageImages()

        def helpPage = g.createLink([action:'help'])
        def helpLinks = documentService.findAllHelpResources()
        List copyOfLinks = new ArrayList(helpLinks) // The result of the call is cached so we don't want to add elements to it.
        copyOfLinks << [name:'MORE RESOURCES', type:'', url:helpPage]
        def blog = blogService.getSiteBlog()

        def model = [statistics:statistics.statistics, helpLinks:copyOfLinks, images:images, blog:blog, expiryDate: expiryDateDisplay]
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
            boolean reducePrecision = params.getBoolean('heatmap')
            Map geoData  = searchService.allProjectsWithSites(params, null, reducePrecision)
            render geoData as JSON
        } else {

            if (userService.userIsAlaOrFcAdmin()){
                params.include = ['name', 'managementUnitName', 'managementUnitId', 'programId', 'description', 'associatedProgram', 'associatedSubProgram','lastUpdated',
                                  'funding', 'associatedOrgs', 'externalId', 'plannedEndDate', 'plannedStartDate', 'activities.siteId','activities.type','sites.siteId', 'sites.projects', 'sites.extent.geometry']
            } else {
                params.include = ['name', 'description', 'lastUpdated', 'associatedOrgs', 'managementUnitName','managementUnitId', 'programId', 'associatedProgram', 'associatedSubProgram']
            }
            Map resp = searchService.allProjects(params)
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

    /**
     * Returns a small amount of javascript to let other tabs know the user has been logged back in
     * and closes the tab.
     */
    def close() {
        response.setContentType("text/html")
        render """<html><head><script type="text/javascript">
                            localStorage.setItem('login', new Date()); 
                            window.close();
                            </script></head><body/></html>"""
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

    def i18n() {
        if (request.isGet()) {
            Map props = commonService.i18n(request.locale)
            render props as JSON
        }
    }

    private renderStaticPage(SettingPageType settingType, showNews = false) {
        def content = settingService.getSettingText(settingType)
        render view: 'about', model: [settingType: settingType, content: content, showNews: showNews]
    }

}
