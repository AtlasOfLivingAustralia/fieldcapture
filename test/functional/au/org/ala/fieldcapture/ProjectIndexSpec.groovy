package au.org.ala.fieldcapture

import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
class ProjectIndexSpec extends StubbedCasSpec {

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

//    def "Adding Project Funding Type and Funding"(){
//        setup:
//        login([userId:'1', role:"ROLE_ADMIN", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)
//        when:
//        to ProjectIndex, projectId
//
//        then:
//        waitFor {at ProjectIndex}
//        adminTab.click()
//        waitFor {admin.displayed}
//
//        when:
//        admin.projectSettingsTab.click()
//        waitFor{ admin.projectSettings.displayed}
//        waitFor{admin.projectSettings.addFunding.displayed}
//        admin.projectSettings.addFunding.click()
//        admin.projectSettings.fundingType[0].find("option").find {it.value() == "Public - commonwealth"}.click()
//        admin.projectSettings.fundingSource[0].find("option").find {it.value() == "RLP"}.click()
//        admin.projectSettings.fundingSourceAmount = "1000"
//
//        admin.projectSettings.save.click()
//
//        then:
//
//        waitFor{ admin.projectSettings.displayed}
//        admin.projectSettings.fundingType[0].value() == "Public - commonwealth"
//        admin.projectSettings.fundingSource[0].value() == "RLP"
//        admin.projectSettings.fundingSourceAmount.value() == "1000"
//    }

    def "Projects with application status can be saved without a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = ''
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.workOrderErrorDisplayed()
        admin.projectSettings.workOrderId == ''
    }

    def "Projects with application status can be saved with a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.workOrderErrorDisplayed()
        admin.projectSettings.workOrderId == '12345'
    }

    def "Projects with active status can be saved without a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = ''
        admin.projectSettings.saveChangesButton.click()

        then:
        admin.projectSettings.workOrderErrorDisplayed()
    }

    def "Projects with active status can be saved with a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.workOrderErrorDisplayed()
        admin.projectSettings.workOrderId == '12345'
    }

    def "Projects with completed status can be saved without a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_completed'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = ''
        admin.projectSettings.saveChangesButton.click()

        then:
        admin.projectSettings.workOrderErrorDisplayed()
    }

    def "Projects with completed status can be saved with a work order id"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_completed'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.workOrderId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.workOrderErrorDisplayed()
        admin.projectSettings.workOrderId == '12345'
    }

    def "Status of the projects with application status cannot be changed"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }
        admin.projectSettings.projectState.@disabled
    }

    def "Status of the projects with active status should be able to be changed"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }
        !admin.projectSettings.projectState.@disabled
    }

    def "Status of the projects with completed status should be able to be changed"() {
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectIndex, 'project_completed'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }
        !admin.projectSettings.projectState.@disabled
    }
}

