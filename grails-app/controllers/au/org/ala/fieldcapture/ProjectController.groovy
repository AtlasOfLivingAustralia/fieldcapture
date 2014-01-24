package au.org.ala.fieldcapture
import grails.converters.JSON

class ProjectController {

    def projectService, metadataService, commonService, activityService, userService, webService, roleService, grailsApplication
    static defaultAction = "index"
    static ignore = ['action','controller','id']

    def index(String id) {
        def project = projectService.get(id, 'brief')
        def roles = roleService.getRoles()

        if (!project || project.error) {
            flash.message = "Project not found with id: ${id}"
            if (project?.error) {
                flash.message += "<br/>${project.error}"
                log.warn project.error
            }
            redirect(controller: 'home', model: [error: flash.message])
        } else {
            project.sites?.sort {it.name}
            def user = userService.getUser()
            def members = projectService.getMembersForProjectId(id)
            def admins = members.findAll{ it.role == "admin" }.collect{ it.userName }.join(",") // comma separated list of user email addresses

            if (user) {
                user.metaClass.isAdmin = projectService.isUserAdminForProject(user.userId, id)?:false
                user.metaClass.isCaseManager = projectService.isUserCaseManagerForProject(user.userId, id)?:false
                user.metaClass.isEditor = projectService.canUserEditProject(user.userId, id)?:false
            }
            //log.debug activityService.activitiesForProject(id)
            //todo: ensure there are no control chars (\r\n etc) in the json as
            //todo:     this will break the client-side parser
            [project: project,
             activities: activityService.activitiesForProject(id),
             mapFeatures: commonService.getMapFeatures(project),
             isProjectStarredByUser: userService.isProjectStarredByUser(user?.userId?:"0", project.projectId)?.isProjectStarredByUser,
             user: user,
             roles: roles,
             admins: admins,
             activityTypes: metadataService.activityTypesList(),
             metrics: projectService.summary(id),
             outputTargetMetadata: metadataService.getOutputTargetsByOutputByActivity(),
             useAltPlan: params.useAltPlan,
             institutions: metadataService.institutionList(),
             programs: metadataService.programsModel(),
             enableReporting: grailsApplication.config.enableReporting
            ]
        }
    }

    @PreAuthorise
    def edit(String id) {
        def project = projectService.get(id)
        if (project) {
            [project: project,
             institutions: metadataService.institutionList(),
             programs: metadataService.programsModel()]
        } else {
            forward(action: 'list', model: [error: 'no such id'])
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def create() {
        render view: 'edit', model: [create:true,
                institutions: metadataService.institutionList(),
                programs: metadataService.programsModel()
        ]
    }

    /**
     * Updates existing or creates new output.
     *
     * If id is blank, a new project will be created
     *
     * @param id projectId
     * @return
     */
    @PreAuthorise
    def ajaxUpdate(String id) {
        def postBody = request.JSON
        if (!id) { id = ''}
        log.debug "Body: ${postBody}"
        log.debug "Params: ${params}"
        def values = [:]
        // filter params to remove keys in the ignore list
        postBody.each { k, v ->
            if (!(k in ignore)) {
                values[k] = v
            }
        }

        if (values.containsKey("planStatus") && values.planStatus =~ /approved/) {
            // check to see if user has caseManager permissions
            if (!projectService.isUserCaseManagerForProject(userService.getUser()?.userId, id)) {
                render status:401, text: "User does not have caseManager permissions for project"
                log.debug "user not caseManager"
                return
            }
        }

        log.debug "json=" + (values as JSON).toString()
        log.debug "id=${id} class=${id.getClass()}"
        def result = projectService.update(id, values)
        log.debug "result is " + result
        if (result.error) {
            render result as JSON
        } else {
            //println "json result is " + (result as JSON)
            render result.resp as JSON
        }
    }

    @PreAuthorise(accessLevel = 'admin')
    def ajaxSubmitReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.submitStageReport(id, reportDetails)

        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxApproveReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.approveStageReport(id, reportDetails)
        render result as JSON
    }

    @PreAuthorise(accessLevel = 'caseManager')
    def ajaxRejectReport(String id) {

        def reportDetails = request.JSON

        def result = projectService.rejectStageReport(id, reportDetails)

        render result as JSON

    }


    @PreAuthorise
    def update(String id) {
        //params.each { println it }
        projectService.update(id, params)
        chain action: 'index', id: id
    }

    @PreAuthorise(accessLevel = 'admin')
    def delete(String id) {
        projectService.delete(id)
        forward(controller: 'home')
    }

    def list() {
        // will show a list of projects
        // but for now just go home
        forward(controller: 'home')
    }

    def species(String id) {
        def project = projectService.get(id, 'brief')
        def activityTypes = metadataService.activityTypesList();
        render view:'/species/select', model: [project:project, activityTypes:activityTypes]
    }

    /**
     * Star or unstar a project for a user
     * Action is determined by the URI endpoint, either: /add | /remove
     *
     * @return
     */
    def starProject() {
        String act = params.id?.toLowerCase() // rest path starProject/add or starProject/remove
        String userId = params.userId
        String projectId = params.projectId

        if (act && userId && projectId) {
            if (act == "add") {
                render userService.addStarProjectForUser(userId, projectId) as JSON
            } else if (act == "remove") {
                render userService.removeStarProjectForUser(userId, projectId) as JSON
            } else {
                render status:400, text: 'Required endpoint (path) must be one of: add | remove'
            }
        } else {
            render status:400, text: 'Required params not provided: userId, projectId'
        }
    }

    def getMembersForProjectId() {
        String projectId = params.id
        def adminUserId = userService.getCurrentUserId()

        if (projectId && adminUserId) {
            if (projectService.isUserAdminForProject(adminUserId, projectId) || projectService.isUserCaseManagerForProject(adminUserId, projectId)) {
                render projectService.getMembersForProjectId(projectId) as JSON
            } else {
                render status:403, text: 'Permission denied'
            }
        } else if (adminUserId) {
            render status:400, text: 'Required params not provided: projectId'
        } else if (projectId) {
            render status:403, text: 'User not logged-in or does not have permission'
        } else {
            render status:500, text: 'Unexpected error'
        }
    }
}
