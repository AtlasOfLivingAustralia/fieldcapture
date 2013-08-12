package au.org.ala.fieldcapture

class UserController {
    def userService

    def index() {
        def user = userService.getUser()
        log.debug('Viewing my dashboard :  ' + user)
        [user: user]
    }


}
