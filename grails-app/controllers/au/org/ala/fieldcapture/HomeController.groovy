package au.org.ala.fieldcapture

import grails.converters.JSON

class HomeController {

    def projectService
    def siteService
    def activityService
    def searchService
    def settingService

    @PreAuthorise(accessLevel = 'alaAdmin', redirectController = "admin")
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
        params.facets = "state,organisationFacet,associatedProgramFacet,associatedSubProgramFacet,mainThemeFacet,stateFacet,nrmFacet,lgaFacet,mvgFacet,ibraFacet,imcra4_pbFacet,otherFacet"
        def resp = searchService.HomePageFacets(params)
        [   facetsList: params.facets.tokenize(","),
            description: settingService.getSettingText(SettingPageType.DESCRIPTION),
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
        renderStaticPage(SettingPageType.ABOUT, true)
    }

    def help() {
        renderStaticPage(SettingPageType.HELP, false)
    }

    def contacts() {
        renderStaticPage(SettingPageType.CONTACTS, false)
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

    private renderStaticPage(SettingPageType settingType, showNews) {
        def content = settingService.getSettingText(settingType)
        render view: 'about', model: [settingType: settingType, content: content, showNews:showNews]
    }
}
