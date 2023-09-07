package au.org.ala.fieldcapture


import pages.RlpProjectPage
import pages.SiteUpload
import spock.lang.Ignore

class SiteUploadSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    @Ignore
    // Temporarily ignore this test as spatial-test is having issues causing these tests to fail.
    def "I can upload a file"() {
        setup:
        String projectId = '1'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        sitesTab.click()

        then:
        waitFor { sitesTabContent.displayed }

        when:
        waitFor { !sitesTabContent.siteUpload.@disabled }
        sitesTabContent.siteUpload.click()

        then:
        waitFor { at SiteUpload }

        when:
        uploadShapefile("/TestPointShapefile.zip")

        then:
        waitFor 60, { sites.size() == 5 }

        when:
        createSites()

        then: "Wait for the site upload to complete, this can be very slow"
        waitFor 240, { uploadProgress.ok.displayed }

        when:
        uploadProgress.ok.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor { sitesTabContent.sitesTableRows.collect{it.name} == ['Site 5', 'Site 4', 'Site 3', 'Site 2',  'Site 1', 'Test site 1'] }

    }
}
