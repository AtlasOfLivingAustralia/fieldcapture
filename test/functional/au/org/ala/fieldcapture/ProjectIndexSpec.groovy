package au.org.ala.fieldcapture

import geb.spock.GebReportingSpec
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
public class ProjectIndexSpec extends StubbedCasSpec {

    def projectId = "project_1"

    def setup() {
        useDataSet('dataset_project')
    }

    def cleanup() {
        logout(browser)
    }

    def "document should be displayed / uploaded correctly"() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ProjectIndex, projectId

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor {admin.editDocumentTab}

        when:
        admin.editDocumentTab.click()

        then:
        admin.attached_documents.size() == 1
        admin.attached_documents[0].text() == 'test 1'

        when:
        admin.attachDocumentBtn.click()
        def dialog = openDocumentDialog()

        then:

        dialog.title == "Contract assurance document"
        waitFor {editDocumentForm}
        editDocumentForm.reportOptions.size() == 2
        //editDocumentForm.firstReportOption.text() == 'Core services report 1'


        when:
        editDocumentForm.reportSelect = 'report_1'
        editDocumentForm.documentNameInput = 'test 2'
        editDocumentForm.uploadingFile =(filename)
        editDocumentForm.saveBtn.click()

        then:
        waitFor {admin.editDocumentTab}
        admin.attached_documents.size() == 2
        admin.attached_documents[1].text() == 'test 2'
        admin.deleteDocumentBtns.size() == 2

        when:
        admin.deleteDocumentBtns[1].click()

        then:
        waitFor {admin.editDocumentTab}
        admin.attached_documents.size() == 1

    }
}

