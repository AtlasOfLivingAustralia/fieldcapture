package au.org.ala.merit

import au.org.ala.merit.PreAuthorise


/**
 * Grails Filter to check for controller methods annotated with <code>@{@link PreAuthorise}</code>
 *
 * @see PreAuthorise
 */
class AclFilterFilters {
    def grailsApplication, userService, projectService, roleService

    def roles = []

    def dependsOn = [HubConfigurationFilters]

    def filters = {
        all(controller:'*', action:'*') {
            before = {
                def controller = grailsApplication.getArtefactByLogicalPropertyName("Controller", controllerName)
                Class controllerClass = controller?.clazz
                def method = controllerClass.getMethod(actionName?:"index", [] as Class[])
                def roles = roleService.getAugmentedRoles()
                if (controllerClass.isAnnotationPresent(PreAuthorise) || method.isAnnotationPresent(PreAuthorise)) {
                    PreAuthorise pa = method.getAnnotation(PreAuthorise)?:controllerClass.getAnnotation(PreAuthorise)
                    def userId = userService.getCurrentUserId()
                    def accessLevel = pa.accessLevel()
                    def entityId = params[pa.projectIdParam()]

                    String entity = UserService.PROJECT
                    switch(controllerClass) {
                        case ProgramController:
                            entity = UserService.PROGRAM
                            break
                        case OrganisationController:
                            entity = UserService.ORGANISATION
                            break
                        case ManagementUnitController:
                            entity = UserService.MANAGEMENTUNIT
                            break
                    }

                    def errorMsg

                    if (!roles.contains(accessLevel)) {
                        errorMsg = "Unknown accessLevel requested: <code>${accessLevel}</code> from <code>${method}</code>. Must be one of ${roles.join(', ')}"
                        log.error errorMsg
                    }
                    
                    switch (accessLevel) {
                        case 'alaAdmin':
                            if (!userService.userInRole(grailsApplication.config.security.cas.alaAdminRole)) {
                                errorMsg = "Access denied: User does not have <b>alaAdmin</b> permission"
                            }
                            break
                        case 'siteAdmin':
                            if (!userService.userIsAlaOrFcAdmin()) {
                                errorMsg = "Access denied: User does not have <b>admin</b> permission"
                            }
                            break
                        case 'siteReadOnly':
                            if (!(userService.userIsAlaOrFcAdmin() || userService.userHasReadOnlyAccess())) {
                                errorMsg = "Access denied: User does not have <b>admin</b> permission"
                            }
                            break
                        case 'officer':
                            if (!userService.userIsSiteAdmin()) {
                                errorMsg = "Access denied: User does not have <b>admin</b> permission"
                            }
                            break

                        case 'caseManager':
                        case 'admin':
                        case 'editor':
                            if (!(userService.userIsAlaOrFcAdmin() || userService.checkRole(userId, accessLevel, entityId, entity))) {
                                errorMsg = "Access denied: User does not have <b>${accessLevel}</b> permission"
                            }
                            break

                        default:
                            log.warn "Unexpected role: ${accessLevel}"
                    }

                    if (errorMsg) {
                        flash.message = errorMsg
                        if (params.returnTo) {
                            redirect(url: params.returnTo)
                        } else {
                            redirect(controller: pa.redirectController(), action: pa.redirectAction(), id: entityId)
                        }
                        return false
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
