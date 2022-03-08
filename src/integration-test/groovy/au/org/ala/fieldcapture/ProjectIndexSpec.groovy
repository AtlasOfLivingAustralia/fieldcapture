package au.org.ala.fieldcapture

import pages.ProjectIndex
import pages.modules.ExternalId
import spock.lang.Stepwise

@Stepwise
class ProjectIndexSpec extends StubbedCasSpec {

    def projectId = "project_1"

    def setup() {
        useDataSet('dataset_project')
    }

    def cleanup() {
        logoutViaUrl(browser)
    }

    def "document should be displayed / uploaded correctly"() {
        setup:
        loginAsUser('1', browser)

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
        Thread.sleep(500) // Wait for the modal animation to finish
        waitFor { admin.documents.attachDocumentDialog.title.displayed &&  admin.documents.attachDocumentDialog.report.displayed}
        admin.documents.attachDocumentDialog.reportOptions.size() == 2

        when:
        admin.documents.attachDocumentDialog.report = 'report_1'
        admin.documents.attachDocumentDialog.title = 'test 2'
        admin.documents.attachDocumentDialog.attachFile('/testImage.png')
        admin.documents.attachDocumentDialog.save()

        then:
        waitFor 10, {hasBeenReloaded()}
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

    def "Projects with application status can be saved without a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor 20, {hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.internalOrderIds().size() == 0
    }

    def "Projects with application status can be saved with a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.externalIds.externalIds[0].idType = "INTERNAL_ORDER_NUMBER"
        admin.projectSettings.externalIds.externalIds[0].externalId = "12345"
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.externalIds.externalIds[0].externalId == "12345"
    }

    def "Projects with active status cannot be saved without a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.externalIds.externalIds[0].remove()
        admin.projectSettings.saveChangesButton.click()

        then: "A validation error is displayed"
        admin.projectSettings.internalOrderIdErrorDisplayed()
    }

    def "Projects with active status can be saved with a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        ExternalId externalId = admin.projectSettings.externalIds.addExternalId()
        externalId.idType = 'INTERNAL_ORDER_NUMBER'
        externalId.externalId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.externalIds.externalIds[2].externalId == "12345"
    }

    def "Projects with completed status cannot be saved without a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_completed'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.externalIds.externalIds[0].remove()
        admin.projectSettings.saveChangesButton.click()

        then:
        admin.projectSettings.internalOrderIdErrorDisplayed()
    }

    def "Projects with completed status can be saved with a internal order id"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_completed'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.externalIds.externalIds[0].externalId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.externalIds.externalIds[0].externalId == '12345'
    }

    def "Status of the projects with application status cannot be changed"() {
        setup:
        loginAsMeritAdmin(browser)

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
        loginAsMeritAdmin(browser)

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
        loginAsMeritAdmin(browser)

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

    def "Project Status is Terminated"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, 'project_terminated'

        then:
        at ProjectIndex

        when:
        overviewTab.click()

        then:
        overview.projectStatus[1].text() == 'TERMINATED'
        overview.terminationReason.text() == "Termination Reason"

    }
    def "Project Termination"(){
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProjectIndex, "project_active"

        then:
        waitFor { at ProjectIndex }

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.projectState.value("Terminated")
        admin.projectSettings.terminationReason = "Termination Reason Test"

        then:
        admin.projectSettings.saveChanges()

        and:
        waitFor 30,{
            admin.projectSettings.projectState.value() == "terminated"
            admin.projectSettings.terminationReason == "Termination Reason Test"
        }




    }

}

