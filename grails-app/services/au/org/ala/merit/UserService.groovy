package au.org.ala.merit

import au.org.ala.web.CASRoles
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable

import javax.annotation.PostConstruct
import javax.management.relation.Role

class UserService {

    private static final String USER_PROFILE_CACHE_REGION = 'userProfileCache'
    private static final String USER_ORGANISATIONS_CACHE_KEY_EXPRESSION = '#userId+"_organisations"'


    static final String PROJECT = 'au.org.ala.ecodata.Project'
    static final String ORGANISATION = 'au.org.ala.ecodata.Organisation'
    static final String PROGRAM = 'au.org.ala.ecodata.Program'



    def grailsApplication, authService, webService, roleService, projectService, organisationService

    def auditBaseUrl = ""

    @PostConstruct
    private void init() {
        auditBaseUrl = grailsApplication.config.ecodata.baseUrl + 'audit'
    }

    def getCurrentUserDisplayName() {
        getUser()?.displayName?:"" //?:"mark.woolston@csiro.au"
    }

    def getCurrentUserId() {
        getUser()?.userId?:""
    }

    public UserDetails getUser() {
        def u = authService.userDetails()
        def user

        if (u?.userId) {
            user = new UserDetails(u.displayName, u.email, u.userId)
        }

        return user
    }

    def lookupUser(String userId) {
        authService.getUserForUserId(userId, false)
    }

    def userInRole(role) {
        authService.userInRole(role)
    }

    def userIsSiteAdmin() {
        authService.userInRole(grailsApplication.config.security.cas.officerRole) || authService.userInRole(grailsApplication.config.security.cas.adminRole) || authService.userInRole(grailsApplication.config.security.cas.alaAdminRole)
    }

    def userIsAlaOrFcAdmin() {
        authService.userInRole(grailsApplication.config.security.cas.adminRole) || authService.userInRole(grailsApplication.config.security.cas.alaAdminRole)
    }

    def userHasReadOnlyAccess() {
        authService.userInRole(grailsApplication.config.security.cas.readOnlyOfficerRole)
    }

    def getRecentEditsForUserId(userId) {
        def url = auditBaseUrl + "/getRecentEditsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProjectsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def getOrganisationIdsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getOrganisationIdsForUserId/${userId}"
        webService.getJson(url)
    }

    @Cacheable(value=UserService.USER_PROFILE_CACHE_REGION, key=UserService.USER_ORGANISATIONS_CACHE_KEY_EXPRESSION, unless="#result instanceof T(java.util.Map)")
    def getOrganisationsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getOrganisationsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProgramsForUserId(userId) {
        String url = grailsApplication.config.ecodata.baseUrl + "program/findAllForUser/${userId}"
        webService.getJson(url)
    }

    def getStarredProjectsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getStarredProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def isProjectStarredByUser(String userId, String projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isProjectStarredByUser?userId=${userId}&projectId=${projectId}"
        webService.getJson(url)
    }

    def addStarProjectForUser(String userId, String projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/addStarProjectForUser?userId=${userId}&projectId=${projectId}"
        webService.getJson(url)
    }

    def removeStarProjectForUser(String userId, String projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/removeStarProjectForUser?userId=${userId}&projectId=${projectId}"
        webService.getJson(url)
    }

    def addUserAsRoleToProject(String userId, String projectId, String role) {
        Map result = checkRoles(userId, role)
        if (result.error) {
            return result
        }
        def submittingUser = authService.userDetails()
        if (!projectService.isUserAdminForProject(submittingUser.userId, projectId)) {
            return [error:'Permission denied']
        }
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/addUserAsRoleToProject?userId=${userId}&projectId=${projectId}&role=${role}"
        webService.getJson(url)
    }

    private Map checkRoles(String userId, String role) {

        def submittingUser = authService.userDetails()

        if (!submittingUser) {
            return [error:'Permission denied']
        }

        if (role == au.org.ala.merit.RoleService.GRANT_MANAGER_ROLE && !userIsSiteAdmin()) {
            return [error: 'Permission denied']
        }

        au.org.ala.web.UserDetails userDetails = authService.getUserForUserId(userId)

        if (!userDetails) {
            return [error:'No user exists with id: '+userId]
        }

        if (!userDetails.hasRole(grailsApplication.config.security.cas.adminRole) && !userDetails.hasRole(CASRoles.ROLE_ADMIN)) {

            if (userDetails.hasRole(grailsApplication.config.security.cas.officerRole)) {
                if (!(role in roleService.allowedGrantManagerRoles)) {
                    return [error: 'User '+userDetails.displayName+' doesn\'t have the correct level of system access to be assigned an '+role+' role.  Please contact <a href="mailto:merit@environment.gov.au">merit@environment.gov.au</a> if this is an issue.']
                }
            } else {
                if (!(role in roleService.allowedUserRoles)) {
                    return [error:  'User '+userDetails.displayName+' doesn\'t have the correct level of system access to be assigned a grant manager role.  Please contact <a href="mailto:merit@environment.gov.au">merit@environment.gov.au</a> if this is an issue.']
                }
            }
        }
        return [success:true]

    }

    def removeUserWithRole(projectId, userId, role) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/removeUserWithRoleFromProject?projectId=${projectId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    @CacheEvict(value=UserService.USER_PROFILE_CACHE_REGION, key=UserService.USER_ORGANISATIONS_CACHE_KEY_EXPRESSION)
    def addUserAsRoleToOrganisation(String userId, String organisationId, String role) {
        Map result = checkRoles(userId, role)
        if (result.error) {
            return result
        }

        if (!organisationService.isUserAdminForOrganisation(organisationId)) {
            return [error:'Permission denied']
        }

        def url = grailsApplication.config.ecodata.baseUrl + "permissions/addUserAsRoleToOrganisation?userId=${userId}&organisationId=${organisationId}&role=${role}"
        webService.getJson(url)
    }

    @CacheEvict(value=UserService.USER_PROFILE_CACHE_REGION, key=UserService.USER_ORGANISATIONS_CACHE_KEY_EXPRESSION)
    def removeUserWithRoleFromOrganisation(String userId, String organisationId, String role) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/removeUserWithRoleFromOrganisation?organisationId=${organisationId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested program
     *
     * @param programId the id of the program of interest
     */
    Map getMembersOfProgram(String programId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getMembersOfProgram/${programId}"
        webService.getJson(url)
    }

    def addUserAsRoleToProgram(String userId, String programId, String role) {
        Map result = checkRoles(userId, role)
        if (result.error) {
            return result
        }

        if (!(userIsSiteAdmin() || isUserAdminForProgram(currentUserId, programId))) {
            return [error:'Permission denied']
        }

        def url = grailsApplication.config.ecodata.baseUrl + "permissions/addUserWithRoleToProgram?userId=${userId}&programId=${programId}&role=${role}"
        webService.getJson(url)
    }

    def removeUserWithRoleFromProgram(String userId, String programId, String role) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/removeUserWithRoleFromProgram?programId=${programId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    List getUserRoles(String userId) {
        String url = grailsApplication.config.ecodata.baseUrl + "permissions/getUserRolesForUserId/${userId}"
        Map result = webService.getJson(url)

        result.roles ?: []
    }

    boolean isUserAdminForProgram(String userId, String programId) {
        if (userIsSiteAdmin()) {
            return true
        }
        Map programRole = getProgramRole(userId, programId)
        return programRole && programRole.role == RoleService.PROJECT_ADMIN_ROLE
    }

    boolean isUserEditorForProgram(String userId, String programId) {
        Map programRole = getProgramRole(userId, programId)
        return programRole && programRole.role == RoleService.PROJECT_EDITOR_ROLE
    }

    boolean isUserGrantManagerForProgram(String userId, String programId) {
        Map programRole = getProgramRole(userId, programId)
        return programRole && programRole.role == RoleService.GRANT_MANAGER_ROLE
    }

    private Map getProgramRole(String userId, String programId) {
        List userRoles = getUserRoles(userId)
        Map programRole =  userRoles.find{it.entityId == programId}
        programRole
    }

    /**
     * Does the current user have permission to edit the requested program report?
     * Checks for the ADMIN role in CAS and then checks the UserPermission
     * lookup in ecodata.
     */
    boolean canUserEditProgramReport(String userId, String programId) {
        boolean userCanEdit
        if (userIsSiteAdmin()) {
            userCanEdit = true
        } else {
            Map programRole = getProgramRole(userId, programId)
            userCanEdit = (programRole != null) // Any assigned role on the program is OK?
        }

        userCanEdit
    }

    /**
     * Does the current user have permission to view the requested program report?
     * Checks for the ADMIN role in CAS and then checks the UserPermission
     * lookup in ecodata.
     */
    boolean canUserViewProgramReport(String userId, String programId) {
        boolean userCanEdit
        if (userIsSiteAdmin() || userHasReadOnlyAccess()) {
            userCanEdit = true
        } else {
            Map programRole = getProgramRole(userId, programId)
            userCanEdit = (programRole != null) // Any assigned role on the program is OK?
        }

        userCanEdit
    }

    boolean isUserAdminForProject(userId, projectId) {
        if (userIsSiteAdmin()) {
           return true
        }

        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserAdminForProject?projectId=${projectId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsAdmin
    }

    def isUserCaseManagerForProject(userId, projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserCaseManagerForProject?projectId=${projectId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsCaseManager
    }

    /**
     * Does the current user have permission to edit the requested projectId?
     * Checks for the ADMIN role in CAS and then checks the UserPermission
     * lookup in ecodata.
     */
    def canUserEditProject(userId, projectId) {
        def userCanEdit
        if (userIsSiteAdmin()) {
            userCanEdit = true
        } else {
            def url = grailsApplication.config.ecodata.baseUrl + "permissions/canUserEditProject?projectId=${projectId}&userId=${userId}"
            userCanEdit = webService.getJson(url)?.userIsEditor?:false
        }

        userCanEdit
    }

    def isUserAdminForOrganisation(userId, organisationId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserAdminForOrganisation?organisationId=${organisationId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsAdmin
    }

    def isUserGrantManagerForOrganisation(userId, organisationId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isUserGrantManagerForOrganisation?organisationId=${organisationId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsGrantManager
    }

    boolean checkRole(String userId, String role, String id, String entityType) {
        switch (entityType) {
            case ORGANISATION:
                break

            case PROGRAM:
                switch (role) {

                    case RoleService.GRANT_MANAGER_ROLE:
                        return isUserGrantManagerForProgram(userId, id)
                    case RoleService.PROJECT_ADMIN_ROLE:
                        return isUserAdminForProgram(userId, id)
                    case RoleService.PROJECT_EDITOR_ROLE:
                        return isUserAdminForProgram(userId, id) || isUserEditorForProgram(userId, id)
                    default:
                        return false
                }
            default: // PROJECT is the default
                switch (role) {
                    case RoleService.GRANT_MANAGER_ROLE:
                        return isUserCaseManagerForProject(userId, id)
                    case RoleService.PROJECT_ADMIN_ROLE:
                        return isUserAdminForProject(userId, id)
                    case RoleService.PROJECT_EDITOR_ROLE:
                        return canUserEditProject(userId, id)
                    default:
                        return false
                }

        }

    }

    def checkEmailExists(String email) {
        def user = authService.getUserForEmailAddress(email)
        return user?.userId
    }

    Set getAllowedUserRoles(String email) {
        def user = authService.getUserForEmailAddress(email)

        def roles
        if (!user) {
            roles = new HashSet()
        }
        else if (user.hasRole(grailsApplication.config.security.cas.officerRole)) {
            // Don't allow grant managers to be assigned admin / editor roles
            roles = roleService.allowedGrantManagerRoles
        }
        else {
            roles = roleService.allowedUserRoles
        }
        roles
    }
}
