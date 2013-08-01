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
        [
            //projects: projectService.list(),
            //projects: searchService.allProjects(params),
//            sites: siteService.list(),
//            //sites: siteService.injectLocationMetadata(siteService.list()),
//            activities: activityService.list(),
//            assessments: activityService.assessments(),
            geoPoints: searchService.allGeoPoints(params)
        ]
    }

    def geoService() {
        render searchService.allGeoPoints(params) as JSON
    }

    def getProjectsForIds() {
        render searchService.getProjectsForIds(params) as JSON
    }

    def about() {

    }
}
