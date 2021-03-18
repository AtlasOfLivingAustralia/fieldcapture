package au.org.ala.fieldcapture

import pages.ReportPage
import pages.RlpProjectPage

class OutcomeReportSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    def "Report can be submit and restored after Timeout"(){
        setup:
        String projectId = '1'
        login([userId: '10', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'editor'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        reportingTab.click()

        then:
        waitFor { projectReports.displayed }

        when:
        projectReports.reports[0].edit()

        then:
        waitFor { at ReportPage }

        when:
        List formSections = getFormSections()

        then:
        formSections == [
                'koRLP_-_Output_WHS',
                'koRLP_-_Change_Management',
                'koRLP_-_Baseline_data',
                'koRLP_-_Communication_materials',
                'koRLP_-_Community_engagement',
                'koRLP_-_Controlling_access',
                'koRLP_-_Pest_animal_management',
                'koRLP_-_Management_plan_development',
                'koRLP_-_Debris_removal',
                'koRLP_-_Erosion_Management',
                'koRLP_-_Maintaining_feral_free_enclosures',
                'koRLP_-_Establishing_ex-situ_breeding_programs',
                'koRLP_-_Establishing_Agreements',
                'koRLP_-_Establishing_monitoring_regimes',
                'koRLP_-_Farm_Management_Survey',
                'koRLP_-_Fauna_survey',
                'koRLP_-_Fire_management',
                'koRLP_-_Flora_survey',
                'koRLP_-_Habitat_augmentation',
                'koRLP_-_Identifying_sites',
                'koRLP_-_Improving_hydrological_regimes',
                'koRLP_-_Improving_land_management_practices',
                'koRLP_-_Disease_management',
                'koRLP_-_Negotiations',
                'koRLP_-_Obtaining_approvals',
                'koRLP_-_Pest_animal_survey',
                'koRLP_-_Plant_survival_survey',
                'koRLP_-_Project_planning',
                'koRLP_-_Remediating_riparian_and_aquatic_areas',
                'koRLP_-_Weed_treatment',
                'koRLP_-_Revegetating_habitat',
                'koRLP_-_Site_preparation',
                'koRLP_-_Skills_and_knowledge_survey',
                'koRLP_-_Soil_testing',
                'koRLP_-_Emergency_Interventions',
                'koRLP_-_Water_quality_survey',
                'koRLP_-_Weed_distribution_survey']

        when: "We complete the form and save, marking optional sections as not applicable"
        hideFloatingToolbar()
        field('whsRequirementsMet').value('Met requirements')
        field('variationSubmitted').value('No')
        field('meriOrWorkOrderChangesRequired').value('No')
        getFormSections().each {
            if (isOptional(it)) {
                markAsNotApplicable(it)
            }
        }
        restoreFloatingToolbar()
        simulateTimeout(browser)
        save()


        then: "The save will fail an a dialog is displayed to explain the situation"
        waitFor 20, { timeoutModal.displayed }

        when: "Click the re-login link and log back in"
        waitFor {timeoutModal.loginLink.click() }

        then:
        waitFor {
            at ReportPage
            editAnyway.click()
        }


        and: "A dialog is displayed to say there are unsaved edits"
        waitFor {unsavedEdits.displayed}

        when:
        okBootbox()

        then:
        field('whsRequirementsMet').value('Met requirements')
        field('variationSubmitted').value('No')
        field('meriOrWorkOrderChangesRequired').value('No')
        save()

        and:
        waitFor 20, {
            field('whsRequirementsMet').value('Met requirements')
            field('variationSubmitted').value('No')
            field('meriOrWorkOrderChangesRequired').value('No')
        }



    }
}
