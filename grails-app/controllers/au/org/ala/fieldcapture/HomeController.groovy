package au.org.ala.fieldcapture

class HomeController {

    def projectService

    def index() {
        def projects = projectService.list()
        [projects: projects]
    }
}
