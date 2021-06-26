package au.org.ala.fieldcapture

import geb.module.FormElement
import pages.RlpProjectPage
import pages.SiteUpload

class SiteUploadSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    def "I can upload a file"() {
        setup:
        String projectId = '1'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when:
        to RlpProjectPage, projectId
        sitesTab.click()

        then:
        waitFor { sites.displayed }

        when:
        sites.siteUpload.click()

        then:
        waitFor { at SiteUpload }

        when:
        uploadShapefile("/resources/TestPointShapefile.zip")

        then:
        waitFor 30, { sites.size() == 5 }

        when:
        createSites()

        then: "Wait for the site upload to complete, this can be very slow"
        waitFor 240, { uploadProgress.ok.displayed }

        when:
        uploadProgress.ok.click()

        then:
        waitFor { at RlpProjectPage }
        waitFor { sites.siteName*.text() == ['Test site 1', 'Site 1', 'Site 2', 'Site 3', 'Site 4', 'Site 5'] }

    }
}
