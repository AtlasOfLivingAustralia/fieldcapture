package au.org.ala.fieldcapture

import pages.MeriPlanPDFPage
import pages.ProjectIndex
import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class MeriPlanSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    def "Primary and secondary outcome selection lists can be different"() {
        setup:
        String projectId = '1'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        def meriPlan = openMeriPlanEditTab()

        then:
        meriPlan != null
        meriPlan.selectablePrimaryOutcomes().size() == 7
        meriPlan.selectableSecondaryOutcomes().size() == 8
        meriPlan.selectableSecondaryOutcomes()[7] == 'Secondary'
    }

    def "The MERI Plan can be completed and saved"() {

        setup:
        String projectId = '1'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        then:
        meriPlan != null

        when:
        meriPlan.primaryOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        waitFor {
            meriPlan.primaryPriority.find('[value="Ginini Flats Wetland Complex"')
        }
        meriPlan.primaryPriority = "Ginini Flats Wetland Complex"
        meriPlan.secondaryOutcomes[0].outcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        meriPlan.secondaryOutcomes[0].priority = "Ginini Flats Wetland Complex"
        meriPlan.shortTermOutcomes[0].value("Short term outcome 1")
        meriPlan.addMediumTermOutcome("Medium term outcome 1")
        meriPlan.projectName = "MERI plan edited name"
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
        meriPlan.projectMethodology = "Project methodology"
        meriPlan.projectBaseline[0].baseline = "Baseline 1"
        meriPlan.projectBaseline[0].method = "Method 1"
        meriPlan.rlpMonitoringIndicators[0].indicator = "Indicator 1"
        meriPlan.rlpMonitoringIndicators[0].approach = 'Approach 1'
        meriPlan.rlpMonitoringIndicators[1].indicator = "Indicator 2"
        meriPlan.rlpMonitoringIndicators[1].approach = 'Approach 2'
        meriPlan.reviewMethodology = "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"
        // Services aren't configured in the dataset
        // meriPlan.serviceTargets[0].target = "Target 1"

        meriPlan.save()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId

        then:
        waitFor { getAtCheckTime() > previousLoad }

        when:
        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.primaryOutcome.value().contains("Ramsar") // Direct comparison fails due to &nbsp in the HTML due to the length of the options
        meriPlan.primaryPriority == "Ginini Flats Wetland Complex"
        meriPlan.secondaryOutcomes[0].outcome.value().contains("Ramsar")
        meriPlan.secondaryOutcomes[0].priority.value() == "Ginini Flats Wetland Complex"
        meriPlan.shortTermOutcomes[0].value() == "Short term outcome 1"
        meriPlan.mediumTermOutcomes[0].value() == "Medium term outcome 1"
        meriPlan.projectName == "MERI plan edited name"
        meriPlan.projectDescription == "MERI plan edited description"
        meriPlan.keyThreats[0].threat.value() == "Threat 1"
        meriPlan.keyThreats[0].intervention.value() == "Intervention 1"
        meriPlan.projectMethodology == "Project methodology"
        meriPlan.projectBaseline[0].baseline.value() == "Baseline 1"
        meriPlan.projectBaseline[0].method.value() == "Method 1"
        meriPlan.rlpMonitoringIndicators[0].indicator.value() == "Indicator 1"
        meriPlan.rlpMonitoringIndicators[0].approach.value() == 'Approach 1'
        meriPlan.rlpMonitoringIndicators[1].indicator.value() == "Indicator 2"
        meriPlan.rlpMonitoringIndicators[1].approach.value() == 'Approach 2'
        meriPlan.reviewMethodology == "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name.value() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.value() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.value() == "Alignment 1"

    }

    def "The MERI Plan can be recover from a save failure due to login timeout"() {
        setup:
        String projectId = '1'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when: "Make an edit after the session times out and attempt to save"
        def meriPlan = openMeriPlanEditTab()

        meriPlan.projectMethodology == "Project methodology"
        simulateTimeout(browser)

        meriPlan.save()

        then: "The save will fail an a dialog is displayed to explain the situation"
        waitFor {timeoutModal.displayed}

        when: "Click the re-login link and log back in"
        timeoutModal.loginLink.click()
        // Our stubs are automatically logging us in here.

        then: "The page is reloaded and the edits are still there"
        waitFor { at RlpProjectPage }

        and: "A dialog is displayed to say there are unsaved edits"
        waitFor {unsavedEdits.displayed}

        when:
        okBootbox()

        meriPlan = adminContent.meriPlan

        then: "the unsaved edits are present"
        meriPlan.projectMethodology == "Project methodology"

        when:
        meriPlan.save()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId

        then:
        waitFor { getAtCheckTime() > previousLoad }

        when:
        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.projectMethodology == "Project methodology"
    }

    def "A PDF can be generated from a MERI plan"() {
        setup:
        String projectId = '1'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def editableMeriPlan = openMeriPlanEditTab()
        editableMeriPlan.generatePDF()

        then:
        withWindow"meri-plan-report", {
            at MeriPlanPDFPage
            meriPlan.primaryOutcome.text().contains("Ramsar")
            // Direct comparison fails due to &nbsp in the HTML due to the length of the options
            meriPlan.primaryPriority == "Ginini Flats Wetland Complex"
            meriPlan.secondaryOutcomes[0].outcome.text().contains("Ramsar")
            meriPlan.secondaryOutcomes[0].priority.text() == "Ginini Flats Wetland Complex"
            meriPlan.shortTermOutcomes[0].text() == "Short term outcome 1"
            meriPlan.mediumTermOutcomes[0].text() == "Medium term outcome 1"
            meriPlan.projectName == "MERI plan edited name"
            meriPlan.projectDescription == "MERI plan edited description"
            meriPlan.keyThreats[0].threat.text() == "Threat 1"
            meriPlan.keyThreats[0].intervention.text() == "Intervention 1"
            meriPlan.projectMethodology == "Project methodology"
            meriPlan.projectBaseline[0].baseline.text() == "Baseline 1"
            meriPlan.projectBaseline[0].method.text() == "Method 1"
            meriPlan.rlpMonitoringIndicators[0].indicator.text() == "Indicator 1"
            meriPlan.rlpMonitoringIndicators[0].approach.text() == 'Approach 1'
            meriPlan.rlpMonitoringIndicators[1].indicator.text() == "Indicator 2"
            meriPlan.rlpMonitoringIndicators[1].approach.text() == 'Approach 2'
            meriPlan.reviewMethodology == "Review methodology"
            meriPlan.nationalAndRegionalPlans[0].name.text() == "Plan 1"
            meriPlan.nationalAndRegionalPlans[0].section.text() == "Section 1"
            meriPlan.nationalAndRegionalPlans[0].alignment.text() == "Alignment 1"
        }
    }

    def "A program can set a default primary outcome"()  {
        setup:
        String projectId = 'defaultOutcome'
        login([userId: '1', email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'Admin'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        then: "The primary outcome will default to the program default"
        waitFor {
            meriPlan.primaryOutcome  == 'By 2023, invasive species management has reduced threats to the natural heritage Outstanding Universal Value of World Heritage properties through the implementation of priority actions.'
        }

        when:
        meriPlan.primaryOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        meriPlan.save()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId

        then:
        waitFor { getAtCheckTime() > previousLoad }

        when:
        meriPlan = openMeriPlanEditTab()

        then: "The saved value will not have been overwritten by the default"
        waitFor {
            meriPlan.primaryOutcome.value() == "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        }



    }

    def "Try to approve MERI plan of a project with the application status and no internal order Id"() {

        setup:
        logout(browser)
        String projectId = 'project_application'
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_OFFICER'], browser)

        when:
        to ProjectIndex, projectId

        then:
        waitFor { at ProjectIndex }

        when:
        adminTab.click()

        then:
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            meriplan.approveButton.@disabled
        }
    }

    def "Try to approve MERI plan of a project with the application status and internal order Id"() {

        setup:
        logout(browser)
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'FC_ADMIN'], browser)

        when:
        to ProjectIndex, 'project_application'

        then:
        at ProjectIndex

        when:
        adminTab.click()

        then:
        waitFor { admin.projectSettingsTab.click() }

        when:
        admin.projectSettings.internalOrderId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.internalOrderId == '12345'

        when:
        logout(browser)
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        to ProjectIndex, 'project_application'

        then:
        waitFor { at ProjectIndex }

        when:
        adminTab.click()

        then:
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            !meriplan.approveButton.@disabled
        }
    }

    def "Try to approve MERI plan of a project with the active status"() {

        setup:
        logout(browser)
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        waitFor { at ProjectIndex }

        when:
        adminTab.click()

        then:
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            !meriplan.approveButton.@disabled
        }
    }

    def "Approve MERI plan of a project with the application status and internal order Id"() {

        setup:
        logout(browser)
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
        admin.projectSettings.internalOrderId = '12345'
        admin.projectSettings.saveChangesButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        !admin.projectSettings.internalOrderIdErrorDisplayed()
        admin.projectSettings.internalOrderId == '12345'

        when:
        logout(browser)
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_OFFICER'], browser)

        to ProjectIndex, 'project_application'

        then:
        waitFor { at ProjectIndex }

        when:
        adminTab.click()

        then:
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            meriplan.approveButton.displayed
        }

        when:
        waitFor { meriplan.approveButton.click() }

        then:
        waitFor {
            meriplan.approvePlanDialog.changeOrderNumbers.displayed
        }

        when:
        meriplan.approvePlanDialog.changeOrderNumbers = 'test'
        meriplan.approvePlanDialog.comment = 'test'

        meriplan.approvePlanDialog.approvePlanButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        when:
        adminTab.click()

        then:
        def updatedMeriPlan = waitFor { admin.openMeriPlan() }
        updatedMeriPlan.modifyApprovedPlanButton.displayed

        when:
        overviewTab.click()

        then:
        overview.projectStatus[1].text() == 'ACTIVE'
    }

    def "Approve MERI plan of a project with the active status and internal order Id"() {

        setup:
        logout(browser)
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_ADMIN'], browser)

        when:
        to ProjectIndex, 'project_active'

        then:
        waitFor { at ProjectIndex }

        when:
        adminTab.click()

        then:
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            !meriplan.approveButton.@disabled
        }

        when:
        waitFor { meriplan.approveButton.click() }

        then:
        waitFor {
            meriplan.approvePlanDialog.changeOrderNumbers.displayed
        }

        when:
        meriplan.approvePlanDialog.changeOrderNumbers = 'test'
        meriplan.approvePlanDialog.comment = 'test'

        meriplan.approvePlanDialog.approvePlanButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        when:
        adminTab.click()

        then:
        def updatedMeriPlan = waitFor { admin.openMeriPlan() }
        updatedMeriPlan.modifyApprovedPlanButton.displayed

        when:
        overviewTab.click()

        then:
        overview.projectStatus[1].text() == 'ACTIVE'
    }

    def "A grant manager must supply the internal order number to be able to approve the MERI plan of a project with the application status"() {

        setup:
        // Refresh the data set, the rest of the spec relies on progressively modifying the data so the dataset is only loaded once
        useDataSet('dataset2')
        login([userId: '2', role: "ROLE_FC_OFFICER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'FC_OFFICER'], browser)

        when:
        to ProjectIndex, 'project_application'
        waitFor { at ProjectIndex }
        adminTab.click()
        def meriplan = waitFor { admin.openMeriPlan() }
        waitFor {
            meriplan.approveButton.displayed
        }

        then:
        meriplan.approveButton.@disabled
        meriplan.internalOrderNumber.displayed

        when:
        meriplan.internalOrderNumber = "TBA"

        then:
        waitFor { !meriplan.approveButton.@disabled }

        when:
        waitFor { meriplan.approveButton.click() }

        then:
        waitFor {
            meriplan.approvePlanDialog.changeOrderNumbers.displayed
        }

        when:
        meriplan.approvePlanDialog.changeOrderNumbers = 'test'
        meriplan.approvePlanDialog.comment = 'test'

        meriplan.approvePlanDialog.approvePlanButton.click()

        then:
        waitFor{hasBeenReloaded()}
        at ProjectIndex

        when:
        adminTab.click()

        then:
        def updatedMeriPlan = waitFor { admin.openMeriPlan() }
        updatedMeriPlan.modifyApprovedPlanButton.displayed

        when:
        overviewTab.click()

        then:
        overview.projectStatus[1].text() == 'ACTIVE'
    }
}