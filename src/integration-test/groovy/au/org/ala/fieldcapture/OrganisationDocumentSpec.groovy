package au.org.ala.fieldcapture

import pages.Organisation
import spock.lang.Stepwise

@Stepwise
class OrganisationDocumentsSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset_crossSite')
    }

    def cleanup() {
        logout(browser)
    }


    def "documents can be attached to a organisation"() {

        setup:
        String organisationId = 'test_organisation'
        loginAsMeritAdmin(browser)
        when: "Display the admin tab, navigate to the documents section then press the attach button"
        to Organisation, organisationId
        openDocumentDialog()

        Thread.sleep(1500) // Wait for the animation to finish
        waitFor { adminTabContent.documents.attachDocumentDialog.title.displayed }

        def dialog = adminTabContent.documents.attachDocumentDialog

        then: "The default document type is contract assurance"
        dialog.type == "contractAssurance"
        dialog.publiclyViewable.@disabled

        when:
        dialog.title = "Test doc"
        dialog.attachFile("/testDocument.txt")

        waitFor 20, {
            dialog.saveButton.displayed
            dialog.saveEnabled()
        }

        dialog.save()
        waitFor 30, {
            hasBeenReloaded()
        }

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor(10) {
            adminTabContent.documentsTab.click()
            waitFor {
                adminTabContent.documents.displayed
            }
            adminTabContent.documents.documentSummaryList().size() == 1
        }
        def document = adminTabContent.documents.documents[0]

        and:
        document.name == "Test doc"
    }

}
