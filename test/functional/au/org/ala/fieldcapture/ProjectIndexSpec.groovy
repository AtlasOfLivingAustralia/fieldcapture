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
        waitFor {admin.documentsTab}

        when:
        admin.documentsTab.click()

        then:
        admin.documents.documentSummaryList().size() == 1
        admin.documents.documentSummaryList()[0].name == 'test 1'

        when:
        admin.documents.attachDocumentButton.click()


        then:
        waitFor { admin.documents.attachDocumentDialog.title.displayed &&  admin.documents.attachDocumentDialog.report.displayed}
        admin.documents.attachDocumentDialog.reportOptions.size() == 2

        when:
        File toAttach = new File(getClass().getResource('/resources/testImage.png').toURI())
        admin.documents.attachDocumentDialog.report = 'report_1'
        admin.documents.attachDocumentDialog.title = 'test 2'
        admin.documents.attachDocumentDialog.file =(toAttach.absolutePath)
        admin.documents.attachDocumentDialog.save()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex // Do another at check or the next call to "hasBeenReloaded" will return regardless of whether the page has been reloaded again.

        waitFor {admin.documents.documentSummaryList().size() == 2}
        admin.documents.documentSummaryList().size() == 2
        admin.documents.documentSummaryList()[1].name == 'test 2'

        when:
        admin.documents.documentSummaryList()[1].deleteButton.click()

        then:
        waitFor {hasBeenReloaded()}
        waitFor {admin.documents.documentSummaryList().size() == 1}


    }
}

