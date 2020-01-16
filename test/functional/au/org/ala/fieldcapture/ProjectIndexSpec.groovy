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
        projectName.text() == 'project 1'

        when:
        adminTab.click()

        then:
        waitFor {admin.editDocumentTab}

        when:
        admin.editDocumentTab.click()

        then:
        admin.attached_document.text().trim() == 'test 1'

        when:
        admin.attachDocumentBtn.click()

        then:
        waitFor {editDocumentForm}
        editDocumentForm.reportOptions.size() == 2
        //editDocumentForm.firstReportOption.text() == 'Core services report 1'

//        when:
//        editDocumentForm.reportSelect = 'report_1'
//        editDocumentForm.documentNameInput = 'test 2'
//        editDocumentForm.uploadingFile =('test2.doc')
//        editDocumentForm.saveBtn.click()
//
//        then:
//        waitFor {admin.editDocumentTab}



    }

}

