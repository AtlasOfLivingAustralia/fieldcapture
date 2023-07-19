package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import com.icegreen.greenmail.util.GreenMailUtil
import pages.ProjectIndex
import spock.lang.Shared

import javax.mail.Message

class AccessExpirySpec extends StubbedCasSpec {

    @Shared
    GreenMail greenMail = new GreenMail()

    def setupSpec() {
        useDataSet('dataset1')
        greenMail.start()
    }

    def cleanupSpec() {
        logout(browser)
        greenMail.stop()
    }

    def "Once we trigger the access expiry, we expect access to be gone and an email to be sent"() {
        setup:
        loginAsAlaAdmin(browser)

        when: "We display the project permissions table for our project"
        to ProjectIndex, 'activityProject'
        openAdminTab()
        admin.openProjectAccess()

        then: "We have two users with access to the project"
        admin.projectAccess.permissions.size() == 2
        admin.projectAccess.permissions.collect{it.userId} == ["1", "2"]


        when: "We administratively trigger the access expiry process in ecodata"
        browser.go('http://localhost:8080/admin/triggerAccessExpiryJob')

        then: "An email is sent to inform user 2 their access had been removed, and a warning is sent to user 1 that their access will soon be removed"
        waitFor 20, {
            // The order is not deterministic so sort them by subject
            List messages = Arrays.asList(greenMail.getReceivedMessages()).sort{it.subject}

            messages?.size() == 2
            messages[0].getSubject() == "Your access has been removed"
            GreenMailUtil.getBody(messages[0]) == "Your access has been removed body"
            messages[0].from[0].address == "merit@test.org"
            messages[0].getRecipients(Message.RecipientType.TO)[0].address == "user.2@nowhere.com.au"
            messages[1].getSubject() == "Your access will be removed"
            GreenMailUtil.getBody(messages[1]) == "Your access will be removed body"
            messages[1].from[0].address == "merit@test.org"
            messages[1].getRecipients(Message.RecipientType.TO)[0].address == "user.1@nowhere.com.au"

        }

        when: "We re-display the project permissions table for our project"
        loginAsAlaAdmin(browser)
        to ProjectIndex, 'activityProject'
        openAdminTab()
        admin.openProjectAccess()

        then: "The user with userId 2 has had their access expired and only one user now has access to the project"
        admin.projectAccess.permissions.size() == 1
        admin.projectAccess.permissions[0].userId == "1"

        when: "We re-trigger the access expiry process in ecodata"
        greenMail.purgeEmailFromAllMailboxes()
        browser.go('http://localhost:8080/admin/triggerAccessExpiryJob')
        Thread.sleep(2000) // Wait to ensure that if an email was sent it would have arrived.

        then:
        !greenMail.getReceivedMessages()

    }

}
