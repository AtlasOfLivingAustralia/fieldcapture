package au.org.ala.fieldcapture


import pages.RlpProjectPage
import pages.SiteUpload

class SiteUploadSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    def "I can upload a file"() {
        setup:
        String projectId = '1'
        loginAsMeritAdmin(browser)

        when:
        to RlpProjectPage, projectId
        sitesTab.click()

        then:
        waitFor { sitesTabContent.displayed }

        when:
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
