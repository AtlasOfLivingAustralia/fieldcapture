package au.org.ala.merit

import au.org.ala.merit.config.EmailTemplate
import grails.plugins.mail.MailService
import grails.testing.spring.AutowiredTest
import spock.lang.Specification

/** Holder for evaluating the mailService closure so we can test the parameters are correct */
class EmailParams {
    Map params = [:]
    def methodMissing(String name, def args) {
        params[name] = args[0]
    }
}
/**
 * Tests the EmailService class.
 */
class EmailServiceSpec extends Specification implements AutowiredTest{

    Closure doWithSpring() {{ ->
        service EmailService
    }}

    EmailService service

    def organisationService = Mock(OrganisationService)
    def projectService = Stub(ProjectService)
    def userService = Stub(UserService)
    def settingService = Mock(SettingService)
    def mailService = Mock(MailService)
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
        userService.getUser() >> new UserDetails("MERIT USER", "merituser1@test.com", "1200")
        List usersAndRoles = [admin1, grantManager1, editor]
        EmailTemplate emailTemplate = EmailTemplate.DEFAULT_PLAN_SUBMITTED_EMAIL_TEMPLATE
        String body = "body"
        body.metaClass.markdownToHtml = { "Body" }
        EmailParams email

        when:
        service.sendEmail(emailTemplate, [:], usersAndRoles, RoleService.PROJECT_ADMIN_ROLE)

        then:
        1 * settingService.getSettingText(SettingPageType.PLAN_SUBMITTED_EMAIL_SUBJECT_LINE, [:]) >> "Subject"
        1 * settingService.getSettingText(SettingPageType.PLAN_SUBMITTED_EMAIL, [:]) >> body

        1 * mailService.sendMail(_) >> {args -> email = evaluateMailClosure(args); null}
        email.params.to == ["merituser3@test.com"]
        email.params.from == "merit@ala.org.au"
        email.params.replyTo == "merituser1@test.com"
        email.params.subject == "Subject"
        email.params.html == "Body"
    }


    private EmailParams evaluateMailClosure(Closure mailConfig) {
        EmailParams params = new EmailParams()
        mailConfig.delegate = params
        mailConfig()
        params
    }

    def "if the project has no grant manager, a default should be used"() {

        given:

        userService.getUser() >> new UserDetails("MERIT USER", "merituser1@test.com", "1200")
        List usersAndRoles = [admin1, admin2, editor]
        EmailTemplate emailTemplate = EmailTemplate.DEFAULT_PLAN_APPROVED_EMAIL_TEMPLATE
        String body = "body"
        body.metaClass.markdownToHtml = { "Body" }
        EmailParams email

        when:
        service.sendEmail(emailTemplate, [:], usersAndRoles, RoleService.PROJECT_ADMIN_ROLE)

        then:
        1 * settingService.getSettingText(SettingPageType.PLAN_APPROVED_EMAIL_SUBJECT_LINE, [:]) >> "Subject"
        1 * settingService.getSettingText(SettingPageType.PLAN_APPROVED_EMAIL, [:]) >> body
        1 * mailService.sendMail(_) >> {args -> email = evaluateMailClosure(args); null}
        email.params.to == ["merit@test.com"]
        email.params.from == "merit@ala.org.au"
        email.params.replyTo == "merituser1@test.com"
        email.params.subject == "Subject"
        email.params.html == "Body"

    }

}
