package au.org.ala.fieldcapture


import pages.RlpProjectPage

class ConfigurableMeriPlanSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    def "The MERI Plan will display only sections specified in the program configuration"() {

        setup:
        String projectId = 'meri1'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        then: "Only the sections of the MERI plan configured in the program will be displayed"
        meriPlan != null
        !meriPlan.primaryOutcome.displayed
        !meriPlan.primaryPriority.displayed
        !meriPlan.secondaryOutcomes.displayed
        !meriPlan.shortTermOutcomes.displayed
        !meriPlan.mediumTermOutcomes.displayed
        !meriPlan.projectName.displayed
        !meriPlan.projectDescription.displayed
        !meriPlan.projectMethodology.displayed
        !meriPlan.projectBaseline.displayed
        !meriPlan.reviewMethodology.displayed
        !meriPlan.nationalAndRegionalPlans.displayed
        !meriPlan.projectServices.displayed
        meriPlan.objectivesList.displayed
        meriPlan.monitoringIndicators.displayed
        meriPlan.projectImplementation.displayed
        meriPlan.projectPartnerships.displayed
        meriPlan.keq.displayed
        meriPlan.budget.displayed


    }

}