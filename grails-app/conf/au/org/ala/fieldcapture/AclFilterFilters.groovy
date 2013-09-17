package au.org.ala.fieldcapture

/**
 * Grails Filter to check for controller methods annotated with <code>@{@link PreAuthorise}</code>
 *
 * @see au.org.ala.fieldcapture.PreAuthorise
 */
class AclFilterFilters {
    def userService, projectService

    def filters = {
        all(controller:'*', action:'*') {
            before = {
                def controller = grailsApplication.getArtefactByLogicalPropertyName("Controller", controllerName)
                Class controllerClass = controller?.clazz
                def method = controllerClass.getMethod(actionName?:"index", [] as Class[])

                if (controllerClass.isAnnotationPresent(PreAuthorise) || method.isAnnotationPresent(PreAuthorise)) {
                    PreAuthorise pa = method.getAnnotation(PreAuthorise)?:controllerClass.getAnnotation(PreAuthorise)
                    def userId = userService.getCurrentUserId()
                    def accessLevel = pa.accessLevel()
                    def projectId = params[pa.projectIdParam()]

                    if (!['editor','admin'].contains(accessLevel.toLowerCase())) {
                        throw new IllegalArgumentException("Unknow accessLevel requested: ${accessLevel}. Must be one of 'admin' or 'editor'")
                    }

                    def errorMsg

                    if (accessLevel.toLowerCase() == 'admin' && !projectService.isUserAdminForProject(userId, projectId)) {
                        errorMsg = "Access denied: User does not have <b>admin</b> permission ${projectId?'for project':''}"
                    } else if (accessLevel.toLowerCase() == 'editor' && !projectService.canUserEditProject(userId, projectId)) {
                        errorMsg = "Access denied: User does not have <b>editor</b> permission ${projectId?'for project':''}"
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
