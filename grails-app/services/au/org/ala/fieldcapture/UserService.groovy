package au.org.ala.fieldcapture

import javax.annotation.PostConstruct

class UserService {
    def grailsApplication, authService, webService
    def auditBaseUrl = ""

    @PostConstruct
    private void init() {
        auditBaseUrl = grailsApplication.config.ecodata.baseUrl + 'audit'
    }

    def getCurrentUserDisplayName() {
        getUser()?.userDisplayName?:"" //?:"mark.woolston@csiro.au"
    }

    def getUser() {
        authService.userDetails()
    }

    def getRecentProjectsForUserId(userId) {
        def url = auditBaseUrl + "/getRecentProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def getProjectsForUserId(userId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/getProjectsForUserId/${userId}"
        webService.getJson(url)
    }

    def isProjectStarredByUser(String userId, String projectId) {
        def url = grailsApplication.config.ecodata.baseUrl + "permissions/isProjectStarredByUser?userId${userId}&projectId=${projectId}"
        webService.getJson(url)
    }
}
