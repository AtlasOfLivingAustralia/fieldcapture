package au.org.ala.fieldcapture

class HomeController {

    def projectService, siteService, activityService

    def index() {
        [projects: projectService.list(), sites: siteService.list(), activities: activityService.list()]
    }
}
