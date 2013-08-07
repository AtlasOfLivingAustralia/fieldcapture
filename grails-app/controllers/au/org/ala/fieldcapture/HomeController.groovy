package au.org.ala.fieldcapture

import grails.converters.JSON

class HomeController {

    def projectService, siteService, activityService, searchService

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
        params.facets = "fundingSourceFacet,reportingThemesFacet,organisationFacet,statesFacet,nrmsFacet,lgasFacet"
        def resp = searchService.HomePageFacets(params)
        render view: "tabbed", model: [facetsList: params.facets.tokenize(","),
                results: resp]
    }

    def tabbed() {
        render view: "index", model: [ geoPoints: searchService.allGeoPoints(params) ]
    }

    def geoService() {
        render searchService.allProjects(params) as JSON
    }

    def getProjectsForIds() {
        render searchService.getProjectsForIds(params) as JSON
    }

    def about() {
    }

    def myProfile() {
    }
}
