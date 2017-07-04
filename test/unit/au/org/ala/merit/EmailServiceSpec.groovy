package au.org.ala.merit

import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * Tests the EmailService class.
 */
@TestFor(EmailService)
class EmailServiceSpec extends Specification {

    def organisationService = Mock(au.org.ala.fieldcapture.OrganisationService)
    def projectService = Stub(au.org.ala.fieldcapture.ProjectService)
    def userService = Stub(au.org.ala.fieldcapture.UserService)
    def settingService = Mock(au.org.ala.fieldcapture.SettingService)
    def mailService = Mock(grails.plugin.mail.MailService)
    def meritEmail = 'merit@test.com'

    // Test data.
    def admin1 = [role:'admin', userId:'1200', displayName: 'MERIT ADMIN', userName:'merituser1@test.com']
    def admin2 = [role:'admin', userId:'1201', displayName: 'MERIT ADMIN', userName:'merituser2@test.com']
    def grantManager1 = [role:'caseManager', userId:'1202', displayName: 'GRANT MANAGER', userName:'merituser3@test.com']
    def grantManager2 = [role:'caseManager', userId:'1203', displayName: 'GRANT MANAGER', userName:'merituser4@test.com']
    def editor = [role:'editor', userId:'1204', displayName: 'MERIT EDITOR', userName:'merituser5@test.com']


    def setup() {
        service.projectService = projectService
        service.userService = userService
        service.mailService = mailService
        service.settingService = settingService
        grailsApplication.config.merit.support.email = meritEmail
        service.grailsApplication = grailsApplication
    }

    def "project email addresses should be looked up then sorted by role"() {

        given:
        def projectId = 'test123'
        userService.getUser() >> new UserDetails("MERIT USER", "merituser1@test.com", "1200")
        projectService.getMembersForProjectId(_) >> [admin1, grantManager1, editor]


        when:
        def result = service.getProjectEmailAddresses(projectId)

        then:
        result.userEmail == admin1.userName
        result.grantManagerEmails == [grantManager1.userName]
        result.adminEmails == []

    }

    def "if the project has no grant manager, a default should be used"() {

        given:
        def projectId = 'test123'
        userService.getUser() >> new UserDetails("MERIT USER", "merituser1@test.com", "1200")
        projectService.getMembersForProjectId(_) >> [admin1, admin2, editor]



        when:
        def result = service.getProjectEmailAddresses(projectId)

        then:
        result.userEmail == admin1.userName
        result.grantManagerEmails == [meritEmail]
        result.adminEmails == [admin2.userName]

    }

}
