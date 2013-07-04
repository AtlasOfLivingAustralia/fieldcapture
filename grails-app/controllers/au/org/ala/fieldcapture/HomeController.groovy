package au.org.ala.fieldcapture

class HomeController {

    def projectService, siteService, activityService

    def advanced() {
        index();
    }
    def index() {
        [
            projects: projectService.list(),
            sites: siteService.list(),
            //sites: siteService.injectLocationMetadata(siteService.list()),
            activities: activityService.list(),
            assessments: activityService.assessments()
        ]
    }

    def about() {

    }
}
