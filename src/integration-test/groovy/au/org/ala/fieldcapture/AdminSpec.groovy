package au.org.ala.fieldcapture

import au.org.ala.merit.SettingPageType
import com.icegreen.greenmail.util.GreenMail
import pages.AdminReportsPage
import pages.MERITAdministrationPage
import pages.Reef2050PlanActionDownloadReport
import spock.lang.Shared

import javax.mail.internet.MimeMessage

class AdminSpec extends StubbedCasSpec {

    @Shared
    GreenMail greenMail = new GreenMail()

    def setupSpec() {
        useDataSet("dataset3")
        greenMail.start()
    }

    def cleanupSpec() {
        logout(browser)
        greenMail.stop()
    }

    def "Admin Index"() {
        setup:
        loginAsAlaAdmin(browser)

        when:
        to MERITAdministrationPage

        then:
        at MERITAdministrationPage

        and:
        administration.adminTab.size() == 13
        administration.audit.text() == " Audit"
        administration.staticPages.text() == " Static pages"
        administration.helpResources.text() == " Help Resources"
        administration.siteBlog.text() == " Site Blog"
        administration.homePageImages.text() == " Home Page Images"
        administration.administratorReport.text() == " Administrator Reports"
        administration.loadProject.text() == " Load new projects into MERIT"
        administration.removeUser.text() == " Remove User from MERIT"
        administration.userPermission.text() == " User Permissions for MERIT"
        administration.tools.text() == " Tools"
        administration.settings.text() == " Settings"
        administration.caches.text() == " Caches"
    }

    def "Admin Static pages"() {
        setup:
        loginAsAlaAdmin(browser)

        when:
        to MERITAdministrationPage

        then:
            at MERITAdministrationPage
        when:
        administration.staticPages.click()

        then:
        waitFor { administration.staticPageContent.displayed }

        administration.staticPageContent.pageId.size() == SettingPageType.values().length

    }

    def "Admin Reports"() {
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "ALA", lastName:'Admin'], browser)
        String fromDate = "10/01/2020"
        String toDate = "10/10/2021"

        when:
        to MERITAdministrationPage

        then:
        at MERITAdministrationPage

        when:
        administration.administratorReport.click()

        then:
        waitFor {at AdminReportsPage}

        when:"I clicked the Management Unit Activities Report button"
        downloadMuReport(fromDate, toDate)
        okBootbox()

        then:
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 1
            messages[0].getSubject() == "Your download is ready"
        }

        when:"I clicked the Management Unit Report Status button"
        downloadMuReportSummary(fromDate, toDate)
        okBootbox()

        then:
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 2
            messages[1].getSubject() == "Your download is ready"
        }

        when:"I clicked the Organisation Activities Report button"
        downloadOrgReport(fromDate, toDate)
        okBootbox()

        then:
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 3
            messages[2].getSubject() == "Your download is ready"
        }

        when:"I clicked the Organisation Report Status button"
        downloadOrgReportSummary(fromDate, toDate)
        okBootbox()

        then:
        waitFor 20, {
            MimeMessage[] messages = greenMail.getReceivedMessages()
            messages?.length == 4
            messages[3].getSubject() == "Your download is ready"
        }

    }


    def "a PDF can be generated for Reef 2050 Plan Action Report"() {
        setup:
        loginAsMeritAdmin(browser)
        String fromDate = "10/10/2020"
        String toDate = "10/10/2021"

        when:
        to MERITAdministrationPage

        then:
        at MERITAdministrationPage

        when:
        administration.administratorReport.click()

        then:
        waitFor {at AdminReportsPage}

        when:"generates PDF"
        generateReef2050Pdf()

        then:
        withWindow("reef2050PlanActionReport", {
            at Reef2050PlanActionDownloadReport
            waitFor {
                printInstructions.displayed
            }
            closePrintInstructions()
            waitFor {
                !printInstructions.displayed
            }
        })

    }

}
