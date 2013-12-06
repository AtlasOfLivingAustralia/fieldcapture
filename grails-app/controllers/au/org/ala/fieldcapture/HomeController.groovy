package au.org.ala.fieldcapture

import grails.converters.JSON

class HomeController {

    def projectService
    def siteService
    def activityService
    def searchService
    def settingService

    @PreAuthorise(accessLevel = 'siteAdmin', redirectController = "admin")
    def advanced() {
        [
            projects: projectService.list(),
            sites: siteService.list(),
            //sites: siteService.injectLocationMetadata(siteService.list()),
            activities: activityService.list(),
            assessments: activityService.assessments(),
        ]
    }
    def index() {
        params.facets = "associatedProgramFacet,associatedSubProgramFacet,fundingSourceFacet,reportingThemesFacet,organisationFacet,statesFacet,nrmsFacet,lgasFacet"
        def resp = searchService.HomePageFacets(params)
        [ facetsList: params.facets.tokenize(","),
          results: resp ]
    }

    def tabbed() {
        [ geoPoints: searchService.allGeoPoints(params) ]
    }

    def geoService() {
        params.max = params.max?:9999
        if(params.geo){
            render searchService.allProjectsWithSites(params) as JSON
        } else {
            render searchService.allProjects(params) as JSON
        }
    }

    def getProjectsForIds() {
        render searchService.getProjectsForIds(params) as JSON
    }

    def myProfile() {
        redirect(controller: 'user')
    }

    def about() {
        renderStaticPage(SettingPageType.ABOUT)
    }

    def help() {
        renderStaticPage(SettingPageType.HELP)
    }

    def contacts() {
        renderStaticPage(SettingPageType.CONTACTS)
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

    private renderStaticPage(SettingPageType settingType) {
        def content = settingService.getSettingText(settingType)
        render view: 'about', model: [settingType: settingType, content: content]
    }
}
