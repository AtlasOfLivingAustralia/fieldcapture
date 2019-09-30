package au.org.ala.fieldcapture

import pages.RlpProjectPage

class RlpDocumentsSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }


    def "the project details are displayed correctly on the overview tab"() {

        setup:
        String projectId = '1'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when: "Display the admin tab, navigate to the documents section then press the attach button"
        to RlpProjectPage, projectId
        def dialog = openDocumentDialog()

        waitFor { adminContent.documents.attachDocumentDialog.title.displayed }

        dialog.title = "Test doc"
        dialog.type = "information"
        dialog.attribution = "the tester"
        dialog.license = "CC-BY"
        dialog.publiclyViewable = true
        dialog.attachFile("/resources/testImage.png")

        then: "We cannot save a public image without ticking the privacy declaration"
        dialog.saveEnabled() == false

        when:
        dialog.privacyDeclaration = true
        dialog.save()

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor(timeout:10000) { adminContent.documents.documents.size() == 1 }
        def document = adminContent.documents.documents[0]

        and:
        document.name == "Test doc"
    }


}
