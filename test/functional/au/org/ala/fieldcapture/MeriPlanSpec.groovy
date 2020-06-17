package au.org.ala.fieldcapture

import pages.MeriPlanPDFPage
import pages.RlpProjectPage

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
        waitFor { $('.modal-backdrop').size() == 0}
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

}