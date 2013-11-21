package au.org.ala.fieldcapture

import javax.annotation.PostConstruct

class UserService {
    def grailsApplication, authService, webService
    def auditBaseUrl = ""

    @PostConstruct
    private void init() {
        auditBaseUrl = grailsApplication.config.ecodata.baseUrl + 'audit'
    }

    au.org.ala.web.UserDetails getUserForUserId(String userId) {
        Map<String, au.org.ala.web.UserDetails> um = authService.getAllUserNameMap()
        au.org.ala.web.UserDetails ud = null;

        if (um && um.containsKey(userId)) {
            ud = um.get(userId)
        }

        return ud
    }

    def getCurrentUserDisplayName() {
        getUser()?.displayName?:"" //?:"mark.woolston@csiro.au"
    }

    def getCurrentUserId() {
        getUser()?.userId?:""
    }

    def getUser() {
        def u = authService.userDetails()
        def user

        if (u?.userId) {
            user = new UserDetails(u.userDisplayName, u.email, u.userId)
        }

        return user
    }

    def userInRole(role) {
        authService.userInRole(role)
    }

    def userIsSiteAdmin() {
        authService.userInRole(grailsApplication.config.security.cas.adminRole) || authService.userInRole(grailsApplication.config.security.cas.alaAdminRole)
    }

    def getRecentEditsForUserId(userId) {
        def url = auditBaseUrl + "/getRecentEditsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProjectsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getProjectsForUserId/${userId}"
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
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/addUserAsRoleToProject?userId=${userId}&projectId=${projectId}&role=${role}"
        webService.getJson(url)
    }

    def removeUserWithRole(projectId, userId, role) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/removeUserWithRoleFromProject?projectId=${projectId}&userId=${userId}&role=${role}"
        webService.getJson(url)
    }

    def checkEmailExists(String email) {
        def userList = authService.allUserNameList
        println ("######################  userList:  " + userList.size())
        def match = userList.find { it.userName?.toLowerCase() == email.toLowerCase() }
        return match?.userId?:""
    }
}
