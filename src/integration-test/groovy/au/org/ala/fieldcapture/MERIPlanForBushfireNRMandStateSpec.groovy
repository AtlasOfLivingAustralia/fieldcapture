package au.org.ala.fieldcapture

import pages.AdminClearCachePage
import pages.AdminTools
import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class MERIPlanForBushfireNRMandStateSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }

    // Clear the metadata cache to ensure the services and scores are loaded correctly.
    def clearCache() {
        setup:
        loginAsAlaAdmin(browser)
        to AdminTools
        clearMetadata()
        to AdminClearCachePage
        clearServiceListCache()

    }

    //  Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - States
    def "The MERI Plan will only display only specific section for the Bushfire Recovery (the Regional Fund) - States"() {

        setup:
        String projectId = 'bushfireProject'
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

        waitFor {
            meriPlan.asset.find('[value="Euastacus jagara (Freshwater crayfish)"')
        }
        meriPlan.asset = "Euastacus jagara (Freshwater crayfish)"
        meriPlan.shortTermOutcomes[0].outcome.value("Short term outcome 1")
        meriPlan.projectDescription = "MERI plan edited description"
        meriPlan.relatedProjects = "Related projects"
        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'
        meriPlan.hideFloatingSave()
        meriPlan.addPartnershipRow()
        meriPlan.projectPartnerships[1].name = 'partner name 2'
        meriPlan.projectPartnerships[1].partnership = 'partnership 2'
        meriPlan.projectPartnerships[1].orgType = 'Other'
        waitFor {
            !meriPlan.projectPartnerships[1].otherOrgType.disabled
        }
        meriPlan.projectPartnerships[1].otherOrgType = "Other type"
        meriPlan.consultation = 'Consultation'
        meriPlan.keyThreats[0].threat = "Threat 1"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
        meriPlan.projectMethodology = "Project methodology"
        meriPlan.adaptiveManagement = 'Adaptive management'
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"
        meriPlan.projectServices[0].selectService("Communication materials")
        meriPlan.projectServices[0].selectScore("Number of communication materials published")
        meriPlan.projectServices[0].targets = "5"
        meriPlan.projectServices[0].date = "01-07-2021"
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
        meriPlan.asset == "Euastacus jagara (Freshwater crayfish)"
        meriPlan.assetType.text() == "Priority Invertebrate Species"
        meriPlan.shortTermOutcomes[0].outcome.value() == "Short term outcome 1"
        meriPlan.projectDescription == "MERI plan edited description"
        meriPlan.relatedProjects == "Related projects"
        meriPlan.projectPartnerships[0].name == 'partner name'
        meriPlan.projectPartnerships[0].partnership == 'partnership'
        meriPlan.projectPartnerships[0].orgType == 'Trust'
        meriPlan.projectPartnerships[1].name == 'partner name 2'
        meriPlan.projectPartnerships[1].partnership == 'partnership 2'
        meriPlan.projectPartnerships[1].orgType == 'Other'
        meriPlan.projectPartnerships[1].otherOrgType == 'Other type'

        meriPlan.consultation == 'Consultation'
        meriPlan.keyThreats[0].threat.value() == "Threat 1"
        meriPlan.keyThreats[0].intervention.value() == "Intervention 1"
        meriPlan.projectMethodology == "Project methodology"
        meriPlan.adaptiveManagement == 'Adaptive management'
        meriPlan.nationalAndRegionalPlans[0].name.value() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.value() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.value() == "Alignment 1"
        meriPlan.projectServices[0].targets.size() == 1
        meriPlan.projectServices[0].service.value() == "2"
        meriPlan.projectServices[0].score.value() == "score_43"
        meriPlan.projectServices[0].targets.value() == "5"
        meriPlan.projectServices[0].date.value() == "01-07-2021"
        meriPlan.budget[0].description == 'budget description'
        meriPlan.budget[0].budgetAmounts[0].value() == '100'

        when:
        meriPlan = openReadOnlyMeriPlan()

        then:

        meriPlan.assets[0].assetType.text() == "Priority Invertebrate Species"
        meriPlan.assets[0].asset.text() == "Euastacus jagara (Freshwater crayfish)"
        meriPlan.priorityAction[1].text() == "No priority actions have been nominated for this project"
        meriPlan.shortTermOutcomes[0].outcome.text() == "Short term outcome 1"
        meriPlan.projectDescription.text() == "MERI plan edited description"
        meriPlan.relatedProjects[0].text() == "Related projects"
        meriPlan.consultation[0].text() == "Consultation"
        meriPlan.projectMethodology.text() == "Project methodology"
        meriPlan.nationalAndRegionalPlans[0].name.text() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.text() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.text() == "Alignment 1"
        meriPlan.keyThreats[0].threat.text() == "Threat 1"
        meriPlan.keyThreats[0].intervention.text() == "Intervention 1"
        meriPlan.projectPartnerships[0].name == "partner name"
        meriPlan.projectPartnerships[0].partnership == "partnership"
        meriPlan.projectPartnerships[0].orgType == "Trust"
        meriPlan.projectServices[0].service.text() == "Communication materials"
        meriPlan.projectServices[0].score.text() == "Number of communication materials published"
        meriPlan.projectServices[0].targets[0].text() == "5"
        meriPlan.projectServices[0].date.text() == "01-07-2021"
        meriPlan.budget[0].description.text() == "budget description"
        meriPlan.budget[0].budgetAmounts[0].text() == "\$100.00"

    }


    //  Regional Fund for Wildlife and Habitat Bushfire Recovery (the Regional Fund) - NRM
    def "The MERI Plan will only display only specific section for the Bushfire Recovery (the Regional Fund) - NRM"() {
        setup:
        String projectId = 'bushfireProjectNRM'
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

        meriPlan.primaryOutcome = "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        meriPlan.secondaryOutcomes[0].outcome = "2. By 2023, the trajectory of species targeted under the Threatened Species Strategy, and other EPBC Act priority species, is stabilised or improved."
        meriPlan.primaryPriorityUnstyled[0].click()
        meriPlan.secondaryOutcomes[0].click()
        meriPlan.shortTermOutcomes[0].outcome.value("Short term outcome 1")
        waitFor {
            meriPlan.assetType.find('[value="Priority Invertebrate Species"')
            meriPlan.asset.find('[value="Euastacus jagara (Freshwater crayfish)"')
        }
        meriPlan.assetType = "Priority Invertebrate Species"
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
        meriPlan.shortTermOutcomes[0].outcome.value() == "Short term outcome 1"
        meriPlan.assetType == "Priority Invertebrate Species"
        meriPlan.asset == "Euastacus jagara (Freshwater crayfish)"

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
