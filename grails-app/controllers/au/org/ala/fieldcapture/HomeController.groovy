package au.org.ala.fieldcapture

class HomeController {

    def projectService, siteService

    def index() {
        //siteService.loadTestSites()
        def projects = projectService.list()
        [projects: projects]
    }
}
