package au.org.ala.fieldcapture

/**
 * Grails Filter to check for controller methods annotated with <code>@PreAuthorised</code>
 */
class AclFilterFilters {
    def userService, projectService

    def filters = {
        all(controller:'*', action:'*') {
            before = {
                def controller = grailsApplication.getArtefactByLogicalPropertyName("Controller", controllerName)
                Class controllerClass = controller?.clazz
                def method = controllerClass.getMethod(actionName?:"index", [] as Class[])

                if (method.isAnnotationPresent(PreAuthorise)) {
                    PreAuthorise pa = method.getAnnotation(PreAuthorise)
                    def userId = userService.getCurrentUserId()
                    def accessLevel = pa.accessLevel()
                    def projectId = params[pa.projectIdParam()]

                    if (!['editor','admin'].contains(accessLevel.toLowerCase())) {
                        throw new IllegalArgumentException("Unknow accessLevel requested: ${accessLevel}. Must be one of 'admin' or 'editor'")
                    }

                    def errorMsg

                    if (accessLevel.toLowerCase() == 'admin' && !projectService.isUserAdminForProject(userId, projectId)) {
                        errorMsg = 'User does not have ADMIN permission for project'
                    } else if (accessLevel.toLowerCase() == 'editor' && !projectService.canUserEditProject(userId, projectId)) {
                        errorMsg = 'User does not have EDIT permission for project'
                    }

                    if (errorMsg) {
                        flash.message = errorMsg
                        if (params.returnTo) {
                            redirect(url: params.returnTo)
                        } else {
                            redirect(controller: pa.redirectController(), action: pa.redirectAction(), id: projectId)
                        }
                    }
                }
            }
            after = { Map model ->

            }
            afterView = { Exception e ->

            }
        }
    }
}
