package au.org.ala.fieldcapture

import pages.AdminTools
import pages.DownloadReportPDF
import pages.ESPProjectIndex
import spock.lang.Stepwise

@Stepwise
class ESPProjectSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet("dataset3")
    }

    def cleanupSpec() {
        logout(browser)
    }

    def "Clear the cache to ensure activity forms are loaded"() {
        setup:
        loginAsAlaAdmin(browser)

        when:
        to AdminTools

        waitFor { $("#btnClearMetadataCache").displayed }
        $("#btnClearMetadataCache").click()

        then:
        waitFor { hasBeenReloaded() }
    }

    /**
    def "generate Document PDF from document report tab"() {
        setup:
        loginAsUser('1', browser)

        when:
        to ESPProjectIndex, "123456789"

        then:
        at ESPProjectIndex


        and:
        waitFor {
            downloadReportTab.displayed
        }
        downloadReportTab.click()

        waitFor {
            downloadReportContent.generateHTML.displayed

            downloadReportContent.generatePDF.displayed
        }
        when:
        downloadReportContent.generateHTML.click()

        then:
        withWindow("project-report", {
            at DownloadReportPDF
            groundCoverPercentage.text() == "60"
        })
    }

 **/
}
