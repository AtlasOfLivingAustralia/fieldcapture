package au.org.ala.fieldcapture

import pages.ManagementUnitPage
import spock.lang.Stepwise

@Stepwise
class ManagementUnitDocumentsSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }


    def "documents can be attached to a management unit"() {

        setup:
        String managementUnitId = 'test_mu'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when: "Display the admin tab, navigate to the documents section then press the attach button"
        to ManagementUnitPage
        openDocumentDialog()

        waitFor { adminTabPane.documents.attachDocumentDialog.title.displayed }

        def dialog = adminTabPane.documents.attachDocumentDialog

        then: "The default document type is contract assurance"
        dialog.type == "contractAssurance"
        dialog.publiclyViewable == false

        when:
        dialog.title = "Test doc"
        dialog.attachFile("/resources/testDocument.txt")
        waitFor {
            dialog.saveEnabled()
        }
        dialog.save()

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor(10) {
            adminTabPane.documentsTab.click()
            waitFor {
                adminTabPane.documents.displayed
            }
            adminTabPane.documents.documentSummaryList().size() == 1
        }
        def document = adminTabPane.documents.documents[0]

        and:
        document.name == "Test doc"
    }

}
