package au.org.ala.fieldcapture

import com.icegreen.greenmail.junit.GreenMailRule
import com.icegreen.greenmail.util.GreenMailUtil
import com.icegreen.greenmail.util.ServerSetup
import com.icegreen.greenmail.util.ServerSetupTest
import org.junit.Rule

import javax.mail.internet.MimeMessage

class AccessExpirySpec extends StubbedCasSpec {
    @Rule
    public final GreenMailRule greenMail = new GreenMailRule(ServerSetup.verbose(ServerSetupTest.SMTP))

    def setupSpec() {
        useDataSet('dataset1')
    }

    def cleanup() {
        logout(browser)
    }

    def "Once we trigger the access expiry, we expect access to be gone and an email to be sent"() {
        setup:
        loginAsAlaAdmin(browser)

        when: "We administratively trigger the access expiry process in ecodata"
        browser.go('http://devt.ala.org.au:8080/admin/triggerAccessExpiryJob')

        then:
        waitFor 20, {
            // The order is not deterministic so sort them by subject
            List messages = Arrays.asList(greenMail.getReceivedMessages()).sort{it.subject}

            messages?.size() == 2
            messages[0].getSubject() == "Your access has been removed"
            GreenMailUtil.getBody(messages[0]) == "Your access has been removed body"
            messages[0].from[0].address == "merit@test.org"
            messages[1].getSubject() == "Your access will be removed"
            GreenMailUtil.getBody(messages[1]) == "Your access will be removed body"
            messages[1].from[0].address == "merit@test.org"
        }
    }

}
