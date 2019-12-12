package au.org.ala.fieldcapture

import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class RlpDocumentsSpec extends StubbedCasSpec {
    def setupSpec() {
        useDataSet('dataset2')

        // Ensure reports exist for the project
        String projectId = '1'
        login([userId: '1', role: "ROLE_FC_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)
        to RlpProjectPage, projectId
        regenerateReports()
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

        then: "Ensure the output reports are available for selection"
        dialog.availableStages().size() == 21 // 20 reports and a "please select" option

        when: "We enter data for the document"
        dialog.title = "Test doc"
        dialog.type = "information"
        dialog.attribution = "the tester"
        dialog.license = "CC-BY"
        dialog.publiclyViewable = true
        dialog.stage = '1'
        dialog.attachFile("/resources/testImage.png")

        then: "We cannot save a public image without ticking the privacy declaration"
        dialog.saveEnabled() == false

        when:
        dialog.privacyDeclaration = true
        dialog.save()

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor { hasBeenReloaded() }
        adminContent.documents.documentSummaryList().size() == 1
        def document = adminContent.documents.documents[0]

        and:
        document.name == "Test doc"

        when:
        documentsTab.click()

        then:
        waitFor { documents.displayed }

        and:
        documents.documents.size() == 1
        documents.documents[0].name == "Test doc"
    }

    def "Project assurance documents are designed to be viewed and deleted"() {
        setup:
        String projectId = '1'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when: "Display the admin tab, navigate to the documents section then press the attach button"
        to RlpProjectPage, projectId
        def dialog = openDocumentDialog()

        waitFor { adminContent.documents.attachDocumentDialog.title.displayed }

        dialog.title = "Contract assurance document"
        dialog.type = "contractAssurance"
        dialog.attachFile("/resources/testImage.png")

        then: "The project assurance documents cannot be made public"
        dialog.publiclyViewable.@disabled == 'true'

        and: "The license and attribution fields should also be disabled"
        dialog.attribution.@disabled == 'true'
        dialog.license.@disabled == 'true'

        when:
        dialog.save()

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor { hasBeenReloaded() }
        adminContent.documents.documentSummaryList().size() == 2

        when: "The list can be filtered to only show contract assurance documents"
        adminContent.documents.documentTypeFilter = 'information'

        then: "Only the document we attached in the previous step will be shown"
        waitFor { adminContent.documents.documents.size() == 1 }

        when: "We select the contract assurance filter"
        adminContent.documents.documentTypeFilter = 'contractAssurance'

        then: "Only the contract assurance document will be displayed"
        waitFor { adminContent.documents.documents.size() == 1 }
        def assuranceDoc = adminContent.documents.documents[0]

        and:
        assuranceDoc.name == 'Contract assurance document'

        when:
        documentsTab.click()

        then:
        waitFor { documents.displayed }

        and:
        documents.documents[0].noDocumentsMessage.displayed == true


    }


}
