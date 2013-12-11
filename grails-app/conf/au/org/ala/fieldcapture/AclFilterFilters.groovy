package au.org.ala.fieldcapture

/**
 * Grails Filter to check for controller methods annotated with <code>@{@link PreAuthorise}</code>
 *
 * @see au.org.ala.fieldcapture.PreAuthorise
 */
class AclFilterFilters {
    def grailsApplication, userService, projectService, metadataService


    def filters = {
        all(controller:'*', action:'*') {
            before = {
                def controller = grailsApplication.getArtefactByLogicalPropertyName("Controller", controllerName)
                Class controllerClass = controller?.clazz
                def method = controllerClass.getMethod(actionName?:"index", [] as Class[])
                def roles = metadataService.getAccessLevels().collect {
                    if (it && it['name']) {
                        it.name
                    }
                } // List

                roles.addAll(["alaAdmin","siteAdmin"]) // augment roles with these extra ones

                if (controllerClass.isAnnotationPresent(PreAuthorise) || method.isAnnotationPresent(PreAuthorise)) {
                    PreAuthorise pa = method.getAnnotation(PreAuthorise)?:controllerClass.getAnnotation(PreAuthorise)
                    def userId = userService.getCurrentUserId()
                    def accessLevel = pa.accessLevel()
                    def projectId = params[pa.projectIdParam()]

                    def errorMsg

                    if (!roles.contains(accessLevel)) {
                        //throw new IllegalArgumentException("Unknown accessLevel requested: ${accessLevel}. Must be one of ${roles.join(', ')}")
                        errorMsg = "Unknown accessLevel requested: <code>${accessLevel}</code> from <code>${method}</code>. Must be one of ${roles.join(', ')}"
                        log.error errorMsg
                    }

//                    if (accessLevel.toLowerCase() == 'admin' && !projectService.isUserAdminForProject(userId, projectId)) {
//                        errorMsg = "Access denied: User does not have <b>admin</b> permission ${projectId?'for project':''}"
//                    } else if (accessLevel.toLowerCase() == 'editor' && !projectService.canUserEditProject(userId, projectId)) {
//                        errorMsg = "Access denied: User does not have <b>editor</b> permission ${projectId?'for project':''}"
//                    }
                    //log.debug "accessLevel = $accessLevel"
                    //log.debug "roles = $roles"

                    switch (accessLevel) {
                        case 'alaAdmin':
                            if (!userService.userInRole(grailsApplication.config.security.cas.alaAdminRole)) {
                                errorMsg = "Access denied: User does not have <b>alaAdmin</b> permission"
                            }
                            break
                        case 'siteAdmin':
                            if (!(userService.userInRole(grailsApplication.config.security.cas.alaAdminRole) || userService.userInRole(grailsApplication.config.security.cas.adminRole))) {
                                errorMsg = "Access denied: User does not have <b>admin</b> permission"
                            }
                            break
                        case 'admin':
                            if (!projectService.isUserAdminForProject(userId, projectId)) {
                                errorMsg = "Access denied: User does not have <b>admin</b> permission ${projectId?'for project':''}"
                            }
                            break
                        case 'editor':
                            if (!projectService.canUserEditProject(userId, projectId)) {
                                errorMsg = "Access denied: User does not have <b>editor</b> permission ${projectId?'for project':''}"
                            }
                            break
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
