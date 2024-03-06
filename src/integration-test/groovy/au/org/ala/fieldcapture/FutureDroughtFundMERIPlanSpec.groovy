package au.org.ala.fieldcapture

import pages.RlpProjectPage

class FutureDroughtFundMERIPlanSpec extends StubbedCasSpec {
    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }


    def "MERI Plan Future Drought Fund"() {
        setup:
        String projectId = 'fdFundProject'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()
        meriPlan.aquireEditLock()
        waitFor {
            hasBeenReloaded()
        }
        at RlpProjectPage // reset at check time.

        meriPlan = openMeriPlanEditTab()

        meriPlan.primaryOutcome = "5. By 2023, there is an increase in the awareness and adoption of land management practices that improve and protect the condition of soil, biodiversity and vegetation."
        meriPlan.primaryPriorityUnstyled[0].click()
        meriPlan.shortTermOutcomes[0].outcome.value("Short term outcome 1")
        meriPlan.addMediumTermOutcome("Medium term outcome 1")
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.rationale = "rationale"
        meriPlan.projectMethodology = "Project methodology"
        meriPlan.projectBaseline[0].baseline = "Baseline 1"
        meriPlan.projectBaseline[0].method = "Method 1"
        meriPlan.monitoringIndicators[0].indicator = "Indicator 1"
        meriPlan.monitoringIndicators[0].approach = 'Approach 1'
        meriPlan.reviewMethodology = "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"

        meriPlan.save()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId

        then:
        waitFor { getAtCheckTime() > previousLoad }

        when:
        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.primaryOutcome.value().contains("land management") // Direct comparison fails due to &nbsp in the HTML due to the length of the options
        meriPlan.primaryPriorityUnstyled[0].text() == "Soil acidification"

        meriPlan.otherOutcomeColumn1[0].text() =="More primary producers preserve natural capital while also improving productivity and profitability"
        meriPlan.otherOutcomeColumn2[0].text() == "More primary producers and agricultural communities are experimenting with adaptive or transformative NRM practices, systems and approaches that link and contribute to building drought resilience"
        meriPlan.otherOutcomeColumn2[1].text() == "Partnerships and engagement is built between stakeholders responsible for managing natural resources"

        meriPlan.shortTermOutcomes[0].outcome.value() == "Short term outcome 1"
        meriPlan.mediumTermOutcomes[0].outcome.value() == "Medium term outcome 1"
        meriPlan.projectDescription == "MERI plan edited description"
        meriPlan.rationale == "rationale"
        meriPlan.projectMethodology == "Project methodology"
        meriPlan.projectBaseline[0].baseline.value() == "Baseline 1"
        meriPlan.projectBaseline[0].method.value() == "Method 1"
        meriPlan.monitoringIndicators[0].indicator.value() == "Indicator 1"
        meriPlan.monitoringIndicators[0].approach.value() == 'Approach 1'
        meriPlan.reviewMethodology == "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name.value() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.value() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.value() == "Alignment 1"

    }
}
