package au.org.ala.fieldcapture

class UserService {
    def authService

    def getCurrentUserDisplayName() {
        // TODO: replace with real user name
        return "mark.woolston@csiro.au"
    }

    def getUser() {

        def userDetails = authService.userDetails()

        if (!userDetails["userId"]) {
            println "User isn't logged in - or there is a problem with CAS configuration"
            return null
        }

        log.debug "userDetails = ${userDetails}"
        userDetails
    }

}
