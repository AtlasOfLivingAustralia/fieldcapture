package au.org.ala.merit

import au.org.ala.merit.hub.HubSettings
import au.org.ala.web.CASRoles
import grails.plugin.cache.CacheEvict
import grails.plugin.cache.Cacheable
import groovy.util.logging.Slf4j
import org.grails.plugin.cache.GrailsCacheManager
import org.springframework.web.context.request.RequestContextHolder

import javax.annotation.PostConstruct

@Slf4j
class UserService {

    private static final String USER_PROFILE_CACHE_REGION = 'userProfileCache'
    private static final String USER_DETAILS_CACHE_REGION = 'userDetailsCache'


    static final String PROJECT = 'au.org.ala.ecodata.Project'
    static final String ORGANISATION = 'au.org.ala.ecodata.Organisation'
    static final String PROGRAM = 'au.org.ala.ecodata.Program'
    static final String MANAGEMENTUNIT = 'au.org.ala.ecodata.ManagementUnit'



    def grailsApplication, authService, webService, roleService, projectService, organisationService, activityService

    GrailsCacheManager grailsCacheManager

    def auditBaseUrl = ""

    @PostConstruct
    private void init() {
        auditBaseUrl = grailsApplication.config.getProperty('ecodata.baseUrl') + 'audit'
    }

    def getCurrentUserDisplayName() {
        getUser()?.displayName?:""
    }

    def getCurrentUserId() {
        getUser()?.userId?:""
    }

    public UserDetails getUser() {

        def user = null
        // Attempting to call authService.userDetails outside of a HTTP request results in an exception
        // being thrown.  So if there is no HTTP request (as when running the scheduled job that regenerates the homepage statistics)
        // we just return null.
        if (RequestContextHolder.currentRequestAttributes().request) {
            def u = authService.userDetails()

            if (u?.userId) {
                user = new UserDetails(u.displayName, u.email, u.userId)
            }
        }

        return user
    }

    def lookupUser(String userId) {
        authService.getUserForUserId(userId, false)
    }

    boolean userIsSiteAdmin() {
        userIsFcOfficer() || userIsFcAdmin() || userIsAlaAdmin()
    }

    boolean userIsFcAdmin() {
        authService.userInRole(grailsApplication.config.getProperty('security.cas.adminRole'))
    }

    boolean userIsAlaAdmin() {
        authService.userInRole(grailsApplication.config.getProperty('security.cas.alaAdminRole'))
    }

    boolean userIsAlaOrFcAdmin() {
        userIsFcAdmin() || userIsAlaAdmin()
    }

    boolean userHasReadOnlyAccess() {
        authService.userInRole(grailsApplication.config.getProperty('security.cas.readOnlyOfficerRole'))
    }

    boolean userIsFcOfficer() {
        authService.userInRole(grailsApplication.config.getProperty('security.cas.officerRole'))
    }

    def getRecentEditsForUserId(userId) {
        def url = auditBaseUrl + "/getRecentEditsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProjectsForUserId(userId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def getOrganisationIdsForUserId(userId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getOrganisationIdsForUserId/${userId}"
        webService.getJson(url)
    }

    @Cacheable(value=UserService.USER_PROFILE_CACHE_REGION, key={userId+"_organisations"})
    def getOrganisationsForUserId(String userId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getOrganisationsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProgramsForUserId(userId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + "program/findAllForUser/${userId}"
        webService.getJson(url)
    }

    def getManagementUnitsForUserId(userId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + "managementUnit/findAllForUser/${userId}"
        webService.getJson(url)
    }

    def getStarredProjectsForUserId(userId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getStarredProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def isProjectStarredByUser(String userId, String projectId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isProjectStarredByUser?userId=${userId}&projectId=${projectId}"
        webService.getJson(url)
    }

    def addStarProjectForUser(String userId, String projectId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addStarProjectForUser?userId=${userId}&projectId=${projectId}"
        webService.getJson(url)
    }

    def removeStarProjectForUser(String userId, String projectId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeStarProjectForUser?userId=${userId}&projectId=${projectId}"
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
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addUserAsRoleToProject?userId=${userId}&projectId=${projectId}&role=${role}"
        webService.getJson(url)
    }

    /**
     * MERIT has three special roles granted to administrators, grant managers and researchers
     * @param role the role to check.
     * @param userId the id of the user to check.  If null, the currently logged in userid will be used.
     * @return true if the user has the supplied role.
     */
    private boolean doesUserHaveHubRole(String role, String userId = null) {
        if (!(role in RoleService.MERIT_HUB_ROLES)) {
            throw new IllegalArgumentException("Role "+role+" not supported as a hub role")
        }
        HubSettings settings = SettingService.getHubConfig()
        userId = userId ?: getUser()?.userId
        if (!userId) {
            return false
        }
        if (userIsAlaAdmin()) {
            return true
        }

        return role == settings.userPermissions?.find({it.userId == userId})?.role
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

        if (!userDetails.hasRole(grailsApplication.config.getProperty('security.cas.adminRole')) && !userDetails.hasRole(CASRoles.ROLE_ADMIN)) {

            if (userDetails.hasRole(grailsApplication.config.getProperty('security.cas.officerRole'))) {
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
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeUserWithRoleFromProject?projectId=${projectId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    @CacheEvict(value=UserService.USER_PROFILE_CACHE_REGION, key={userId+"_organisations"})
    def addUserAsRoleToOrganisation(String userId, String organisationId, String role) {
        Map result = checkRoles(userId, role)
        if (result.error) {
            return result
        }

        if (!organisationService.isUserAdminForOrganisation(organisationId)) {
            return [error:'Permission denied']
        }

        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addUserAsRoleToOrganisation?userId=${userId}&organisationId=${organisationId}&role=${role}"
        webService.getJson(url)
    }

    @CacheEvict(value=UserService.USER_PROFILE_CACHE_REGION, key={userId+"_organisations"})
    def removeUserWithRoleFromOrganisation(String userId, String organisationId, String role) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeUserWithRoleFromOrganisation?organisationId=${organisationId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }



    /**
     * Get the list of users (members) who have any level of permission for the requested program
     *
     * @param programId the id of the program of interest
     */
    Map getMembersOfManagementUnit(String managementUnitId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getMembersOfManagementUnit/${managementUnitId}"
        webService.getJson(url)
    }

    def removeUserWithRoleFromManagementUnit(String userId, String managementUnitId, String role) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeUserWithRoleFromManagementUnit?managementUnitId=${managementUnitId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }


    def addUserAsRoleToManagementUnit(String userId, String managementUnitId, String role) {
        Map result = checkRoles(userId, role)
        if (result.error) {
            return result
        }

        if (!(userIsSiteAdmin() || isUserAdminForManagementUnit(currentUserId, managementUnitId))) {
            return [error:'Permission denied']
        }

        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addUserWithRoleToManagementUnit?userId=${userId}&managementUnitId=${managementUnitId}&role=${role}"
        webService.getJson(url)
    }

    /**
     * Get the list of users (members) who have any level of permission for the requested program
     *
     * @param programId the id of the program of interest
     */
    Map getMembersOfProgram(String programId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getMembersOfProgram/${programId}"
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

        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addUserWithRoleToProgram?userId=${userId}&programId=${programId}&role=${role}"
        webService.getJson(url)
    }

    def removeUserWithRoleFromProgram(String userId, String programId, String role) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeUserWithRoleFromProgram?programId=${programId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    List getUserRoles(String userId) {
        String url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getUserRolesForUserId/${userId}"
        Map result = webService.getJson(url)

        result.roles ?: []
    }

    boolean isUserAdminForProgram(String userId, String programId) {
        if (userIsSiteAdmin()) {
            return true
        }
        Map programRole = getEntityRole(userId, programId)
        return programRole && programRole.role == RoleService.PROJECT_ADMIN_ROLE
    }

    boolean isUserEditorForProgram(String userId, String programId) {
        Map programRole = getEntityRole(userId, programId)
        return programRole && programRole.role == RoleService.PROJECT_EDITOR_ROLE
    }

    boolean isUserGrantManagerForProgram(String userId, String programId) {
        Map programRole = getEntityRole(userId, programId)
        return programRole && programRole.role == RoleService.GRANT_MANAGER_ROLE
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
            Map programRole = getEntityRole(userId, programId)
            userCanEdit = (programRole != null) // Any assigned role on the program is OK?
        }

        userCanEdit
    }

    /**
     * Returns true if the current user has permission to view non-public program details such as the sites and
     * reporting tabs.
     */
    boolean canUserViewNonPublicProgramInformation(String userId, String programId) {
        boolean userCanView
        if (userIsSiteAdmin() || userHasReadOnlyAccess()) {
            userCanView = true
        } else {
            userCanView = canUserEditProgramReport(userId, programId)
        }

        userCanView
    }

    /**
     * Check if the current user has permission to edit blogs of the program.
     * @param userId
     * @param programId
     * @return
     */
    boolean canEditProgramBlog(userId, String programId){
      return  userIsSiteAdmin() ||
                isUserAdminForProgram(userId, programId) ||
                isUserEditorForProgram(userId, programId) ||
                isUserGrantManagerForProgram(userId, programId)
    }

    boolean isUserAdminForManagementUnit(String userId, String managementUnitId) {
        if (userIsSiteAdmin()) {
            return true
        }
        Map managementUnitRole = getEntityRole(userId, managementUnitId)
        return managementUnitRole && managementUnitRole.role == RoleService.PROJECT_ADMIN_ROLE
    }

    boolean isUserEditorForManagementUnit(String userId, String managementUnitId) {
        Map managementUnitRole = getEntityRole(userId, managementUnitId)
        return managementUnitRole && managementUnitRole.role == RoleService.PROJECT_EDITOR_ROLE
    }

    boolean isUserGrantManagerForManagementUnit(String userId, String managementUnitId) {
        Map managementUnitRole = getEntityRole(userId, managementUnitId)
        return managementUnitRole && managementUnitRole.role == RoleService.GRANT_MANAGER_ROLE
    }

    private Map getEntityRole(String userId, String entityId) {
        List userRoles = getUserRoles(userId)
        Map role =  userRoles.find{it.entityId == entityId}
        role
    }

    boolean canUserEditManagementUnit(String userId, String managementUnitId) {
        boolean userCanEdit
        if (userIsSiteAdmin()) {
            userCanEdit = true
        } else {
            Map managementUnitRole = getEntityRole(userId, managementUnitId)
            userCanEdit = (managementUnitRole != null) // Any assigned role on the management unit allows editing
        }

        userCanEdit
    }

    boolean isUserAdminForProject(userId, projectId) {
        if (userIsSiteAdmin()) {
           return true
        }
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserAdminForProject?projectId=${projectId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsAdmin
    }

    def isUserCaseManagerForProject(userId, projectId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserCaseManagerForProject?projectId=${projectId}&userId=${userId}"
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
            def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/canUserEditProject?projectId=${projectId}&userId=${userId}"
            userCanEdit = webService.getJson(url)?.userIsEditor?:false
        }

        userCanEdit
    }

    /**
     * Checks the if the user can edit the project associated with the activity.
     * @param userId the id of the user to check
     * @param activityId the activity to check.
     * @return true if the activity can be edited.
     */
    boolean canUserEditActivity(String userId, String activityId) {
        def userCanEdit
        if (userIsSiteAdmin()) {
            userCanEdit = true
        } else {
            Map activity = activityService.get(activityId)
            if (activity) {
                userCanEdit = canUserEditProject(userId, activity.projectId)
            }
        }

        userCanEdit
    }

    def isUserAdminForOrganisation(userId, organisationId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserAdminForOrganisation?organisationId=${organisationId}&userId=${userId}"
        def results = webService.getJson(url)
        return results?.userIsAdmin
    }

    def isUserGrantManagerForOrganisation(userId, organisationId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/isUserGrantManagerForOrganisation?organisationId=${organisationId}&userId=${userId}"
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
            case MANAGEMENTUNIT:
                switch (role) {
                    case RoleService.GRANT_MANAGER_ROLE:
                        return isUserGrantManagerForManagementUnit(userId, id)
                    case RoleService.PROJECT_ADMIN_ROLE:
                        return isUserAdminForManagementUnit(userId, id)
                    case RoleService.PROJECT_EDITOR_ROLE:
                        return isUserAdminForManagementUnit(userId, id) || isUserEditorForManagementUnit(userId, id)
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

        if (!user?.userId || user.locked) {
            // Don't cache failed lookups - otherwise the user will be unable to get MERIT access until the cache expires
            // if they create their account after the first attempt to register them with MERIT.
            clearUserCacheFor(email)
            user = null
        }

        return user?.userId
    }

    /**
     * Removes cache entries for the supplied email address from the user details cache.
     * This method makes some assumptions about the cache provider which are correct at this time. (ehcache)
     * @param email the result to remove from the cache.
     */
    private void clearUserCacheFor(String email) {
        try {
            def userDetailsCache = grailsCacheManager.getCache(USER_DETAILS_CACHE_REGION)
            if (userDetailsCache?.metaClass.respondsTo(userDetailsCache, "getAllKeys")) {
                userDetailsCache.allKeys.each {key ->
                    if (key.simpleKey == email) {
                        log.info("Evicting userDetailsCache cache entry for user: "+email)
                        userDetailsCache.evict(key)
                    }
                }
            }
        }
        catch (Exception e) {
            log.error("Failed to remove user with email: "+email+" from the cache. ",e)
        }

    }

    def getByHub(hubId) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/getByHub/${hubId}"
        return convertValueUiLabel(webService.getJson(url))
    }

    def convertValueUiLabel(results) {
        def map = [admin: "siteAdmin", caseManager: "officer", readOnly: "siteReadOnly"]
        results.each { it ->
            it.role = map[it.role]
        }
    }

    def addUserToHub(String userId, String hubId, String role) {
//        Map result = checkRoles(userId, role)
//        if (result.error) {
//            return result
//        }
        role = convertValueToSave(role)
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/addUserWithRoleToHub?userId=${userId}&hubId=${hubId}&role=${role}"
        webService.getJson(url)
    }

    def convertValueToSave(role) {
        def map = [siteAdmin: "admin", officer: "caseManager", siteReadOnly: "readOnly"]
        return map[role]
    }

    def removeHubUser(String hubId, String userId, String role) {
        def url = grailsApplication.config.getProperty('ecodata.baseUrl') + "permissions/removeUserWithRoleFromHub?userId=${userId}&hubId=${hubId}&role=${role}"
        webService.getJson(url)
    }
}
