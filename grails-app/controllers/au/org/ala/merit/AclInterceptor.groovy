package au.org.ala.merit

import grails.core.GrailsApplication
import groovy.util.logging.Slf4j

/**
 * Grails Filter to check for controller methods annotated with <code>@{@link PreAuthorise}</code>
 *
 * @see PreAuthorise
 */
@Slf4j
class AclInterceptor {
    def userService, projectService, roleService
    GrailsApplication grailsApplication

    AclInterceptor() {
        matchAll()
    }

    boolean before() {
        def controller = grailsApplication.getArtefactByLogicalPropertyName("Controller", controllerName)

        Class controllerClass = controller?.clazz
        def method = controllerClass?.getMethod(actionName ?: "index", [] as Class[])
        def roles = roleService.getAugmentedRoles()
        if (controllerClass?.isAnnotationPresent(PreAuthorise) || method?.isAnnotationPresent(PreAuthorise)) {
            PreAuthorise pa = method.getAnnotation(PreAuthorise) ?: controllerClass?.getAnnotation(PreAuthorise)
            def userId = userService.getCurrentUserId()
            def accessLevel = pa.accessLevel()
            def entityId = params[pa.projectIdParam()]

            String entity = UserService.PROJECT
            switch (controllerClass) {
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
                case RoleService.ALA_ADMIN_ROLE:
                    if (!userService.userIsAlaAdmin()) {
                        errorMsg = "Access denied: User does not have <b>alaAdmin</b> permission"
                    }
                    break
                case RoleService.HUB_ADMIN_ROLE:
                    if (!userService.userIsAlaOrFcAdmin()) {
                        errorMsg = "Access denied: User does not have <b>admin</b> permission"
                    }
                    break
                case RoleService.HUB_READ_ONLY_ROLE:
                    if (!(userService.userIsAlaOrFcAdmin() || userService.userHasReadOnlyAccess())) {
                        errorMsg = "Access denied: User does not have <b>admin</b> permission"
                    }
                    break
                case RoleService.HUB_OFFICER_ROLE:
                    if (!userService.userIsSiteAdmin()) {
                        errorMsg = "Access denied: User does not have <b>admin</b> permission"
                    }
                    break

                case RoleService.GRANT_MANAGER_ROLE:
                case RoleService.PROJECT_ADMIN_ROLE:
                case RoleService.PROJECT_EDITOR_ROLE:
                    if (!(userService.userIsAlaOrFcAdmin() || userService.checkRole(userId, accessLevel, entityId, entity))) {
                        errorMsg = "Access denied: User does not have <b>${accessLevel}</b> permission"
                    }
                    break
                case RoleService.PROJECT_READ_ONLY_ROLE:
                    if (!(userService.userIsAlaOrFcAdmin() || userService.checkRole(userId, accessLevel, entityId, entity) || userService.userHasReadOnlyAccess())) {
                        errorMsg = "Access denied: User does not have <b>${accessLevel}</b> permission"
                    }
                    break
                default:
                    log.warn "Unexpected role: ${accessLevel}"
            }

            if (errorMsg) {
                flash.message = errorMsg
                redirect(controller: pa.redirectController(), action: pa.redirectAction(), id: entityId)
                return false
            }
        }
        true
    }

    boolean after() { true }

    void afterView() { }

}
