package au.org.ala.fieldcapture

import pages.RlpProjectPage

class MERIPlanForBushfireNRMandStateSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }

    //  Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States
    def "The MERI Plan will only display only specific section for the Bushfire Recovery (the Regional Fund) - States"(){

        setup:
        String projectId = 'bushfireProject'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        meriPlan.assetType = "Priority Invertebrate Species"
        waitFor {
            meriPlan.asset.find('[value="Euastacus jagara (Freshwater crayfish)"')
        }
        meriPlan.asset = "Euastacus jagara (Freshwater crayfish)"
        meriPlan.shortTermOutcomes[0].value( "Short term outcome 1")
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'
        meriPlan.consultation = 'Consultation'
        meriPlan.keyThreats[0].threat= "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
        meriPlan.projectMethodology = "Project methodology"
        meriPlan.adaptiveManagement = 'Adaptive management'
        meriPlan.nationalAndRegionalPlans[0].name= "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section= "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment= "Alignment 1"
        meriPlan.budget[0].description = 'budget description'
        meriPlan.budget[0].budgetAmounts[0].value('100')

        meriPlan.save()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId

        then:
        waitFor { getAtCheckTime() > previousLoad }

        when:
        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.assetType.value() == "Priority Invertebrate Species"
        meriPlan.asset == "Euastacus jagara (Freshwater crayfish)"
        meriPlan.shortTermOutcomes[0].value() == "Short term outcome 1"
        meriPlan.projectDescription == "MERI plan edited description"
        meriPlan.projectPartnerships[0].name == 'partner name'
        meriPlan.projectPartnerships[0].partnership == 'partnership'
        meriPlan.projectPartnerships[0].orgType == 'Trust'
        meriPlan.consultation == 'Consultation'
        meriPlan.keyThreats[0].threat.value() == "Threat 1"
        meriPlan.keyThreats[0].intervention.value() == "Intervention 1"
        meriPlan.projectMethodology == "Project methodology"
        meriPlan.adaptiveManagement == 'Adaptive management'
        meriPlan.nationalAndRegionalPlans[0].name.value() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.value() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.value() == "Alignment 1"

        meriPlan.budget[0].description == 'budget description'
        meriPlan.budget[0].budgetAmounts[0].value() == '100'
    }



    //  Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM
    def "The MERI Plan will only display only specific section for the Bushfire Recovery (the Regional Fund) - NRM"() {
        setup:
        String projectId = 'bushfireProjectNRM'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        def meriPlan = openMeriPlanEditTab()

        meriPlan.primaryOutcome = "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
//        waitFor {
//            meriPlan.primaryPriority.find('[value="Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"')
//        }
        meriPlan.primaryPriorityUnstyled[0].click()
        meriPlan.secondaryOutcomes[0].outcome = "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        meriPlan.secondaryOutcomes[0].click()
        meriPlan.shortTermOutcomes[0].value("Short term outcome 1")
        meriPlan.assetType = "Priority Invertebrate Species"
        waitFor {
            meriPlan.asset.find('[value="Euastacus jagara (Freshwater crayfish)"')
        }
        meriPlan.asset = "Euastacus jagara (Freshwater crayfish)"

        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'

        meriPlan.projectName = "MERI plan edited name"
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
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
        meriPlan.primaryOutcome.value().contains("Threatened") // Direct comparison fails due to &nbsp in the HTML due to the length of the options
        meriPlan.primaryPriorityUnstyled[0].text() == "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
        meriPlan.secondaryOutcomes[0].outcome.value().contains("Threatened")
        meriPlan.secondaryOutcomes[0].priorityUnstyle.text() == "Numenius madagascariensis (Eastern Curlew, Far Eastern Curlew)"
        meriPlan.shortTermOutcomes[0].value() == "Short term outcome 1"

        meriPlan.projectPartnerships[0].name == 'partner name'
        meriPlan.projectPartnerships[0].partnership == 'partnership'
        meriPlan.projectPartnerships[0].orgType == 'Trust'

        meriPlan.projectName == "MERI plan edited name"
        meriPlan.projectDescription == "MERI plan edited description"
        meriPlan.keyThreats[0].threat.value() == "Threat 1"
        meriPlan.keyThreats[0].intervention.value() == "Intervention 1"
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
