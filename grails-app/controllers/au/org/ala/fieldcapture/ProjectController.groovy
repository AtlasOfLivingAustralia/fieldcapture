package au.org.ala.fieldcapture

class ProjectController {

    def projectService
    static defaultAction = "index"

    def index(String id) {
        def project = projectService.get(id)
        if (project) {
            [project: project]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def edit(String id) {
        def project = projectService.get(id)
        if (project) {
            [project: project]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    def update(String id) {

    }

    def list() {
        // will show a list of projects
        // but for now just go home
        forward(controller: 'home')
    }
}
