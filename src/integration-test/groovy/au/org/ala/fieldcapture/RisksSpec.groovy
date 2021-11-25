package au.org.ala.fieldcapture

import com.icegreen.greenmail.junit.GreenMailRule
import com.icegreen.greenmail.util.GreenMailUtil
import com.icegreen.greenmail.util.ServerSetup
import com.icegreen.greenmail.util.ServerSetupTest
import org.junit.Rule
import pages.ProjectIndex
import pages.RlpProjectPage
import spock.lang.Stepwise

import javax.mail.internet.MimeMessage

@Stepwise
class RisksSpec extends StubbedCasSpec {

    @Rule
    public final GreenMailRule greenMail = new GreenMailRule(ServerSetup.verbose(ServerSetupTest.SMTP))

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
       logout(browser)
    }

    def "The risks and threats appears on the activity tab on the original MERIT template"() {
        setup:
        String projectId = 'p1'
        loginAsUser('1', browser)

        when: "Open the project page, navigate to the activities tab"
        to ProjectIndex, projectId
        waitFor { at ProjectIndex }
        openActivitiesTab()

        then:
        plansAndReports.risksAndThreats.displayed

        when:
        openAdminTab()

        then:
        !admin.risksAndThreatsTab.displayed

        when:
        openActivitiesTab()
        plansAndReports.risksAndThreats.overallRisk = 'Low'
        Map data = [type:'Timeliness of project approvals processes',
                    description:'Risk 1 description',
                    likelihood: 'Likely',
                    consequence: 'Minor',
                    control:'Risk 1 control',
                    residualRisk: 'Low'
            ]
        plansAndReports.risksAndThreats.setRowData(0, data)
        plansAndReports.risksAndThreats.save()

        then:
        waitFor { hasBeenReloaded() }
        plansAndReports.risksAndThreats.overallRisk == 'Low'
        plansAndReports.risksAndThreats.getRowData(0) == data

        when:
        at ProjectIndex // reset at check time.
        plansAndReports.risksAndThreats.overallRisk == 'Medium'
        plansAndReports.risksAndThreats.cancel()

        then:
        waitFor { hasBeenReloaded() }
        plansAndReports.risksAndThreats.overallRisk == 'Low'

    }

    def "The risks and threats tab appears on the admin tab for RLP projects"() {
        setup:
        String projectId = 'p2'
        loginAsUser('1', browser)

        when: "Open the project page, navigate to the admin tab"
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        openAdminTab()

        adminContent.openRisksAndThreats()

        then:
        adminContent.risksAndThreats.displayed

        when:
        adminContent.risksAndThreats.overallRisk = 'Low'
        Map data = [type:'Timeliness of project approvals processes',
                    description:'Risk 1 description',
                    likelihood: 'Likely',
                    consequence: 'Minor',
                    control:'Risk 1 control',
                    residualRisk: 'Low'
        ]
        adminContent.risksAndThreats.setRowData(0, data)
        adminContent.risksAndThreats.save()

        then:
        waitFor { hasBeenReloaded() }
        adminContent.risksAndThreats.overallRisk == 'Low'
        adminContent.risksAndThreats.getRowData(0) == data

        when:
        at RlpProjectPage // reset at check time.
        adminContent.openRisksAndThreats()
        adminContent.risksAndThreats.overallRisk == 'Medium'
        adminContent.risksAndThreats.cancel()

        then:
        waitFor { hasBeenReloaded() }
        adminContent.risksAndThreats.overallRisk == 'Low'
    }

    def "Risks and threats changes can be emailed to grant managers"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        browser.go("admin/checkForRisksAndThreatsChanges")

        then:
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 2
            messages[0].getSubject() == "Risks and threats changed subject"
            GreenMailUtil.getBody(messages[0]) == "<p>Risks and threats changed body</p>"
        }
    }

}
