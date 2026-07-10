package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import geb.module.FormElement
import pages.AdminClearCachePage
import pages.MeriPlanPDFPage
import pages.ProjectIndex
import pages.RlpProjectPage
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
/** This spec tests the functionality of the recent changes to the grants workflow */
class GrantsWorkflowSpec extends StubbedCasSpec {

    @Shared
    GreenMail greenMail = new GreenMail()

    def setupSpec() {
        useDataSet('dataset2')
        loginAsAlaAdmin(browser)
        to AdminClearCachePage
        clearProgramListCache()
        clearServiceListCache()
        greenMail.start()
    }

    def cleanupSpec() {
        logout(browser)
        greenMail.stop()
    }

    def "Starting with a new project in the grants program, the MERI Plan can be completed and saved"() {
        setup: "The user with userId 1 is an admin for project with projectId grants1"
        String projectId = 'grants1'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        def meriPlan = openMeriPlanEditTab()
        meriPlan.aquireEditLock()
        waitFor {
            hasBeenReloaded()
        }
        at RlpProjectPage // reset at check time.

        meriPlan = openMeriPlanEditTab()
        meriPlan.priorityPlace.supportsPriorityPlaces = "No"
        meriPlan.firstNationsPeopleInvolvement.supportsFirstNationsPeopleInvolvement = "Yes"
        meriPlan.firstNationsPeopleInvolvement.firstNationsPeopleInvolvement = "Leading"

        meriPlan.primaryOutcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        waitFor {
            meriPlan.primaryPriority.find('[value="Ginini Flats Wetland Complex"')
        }
        meriPlan.primaryPriority = "Ginini Flats Wetland Complex"

        meriPlan.secondaryOutcomes[0].outcome = "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        meriPlan.secondaryOutcomes[0].priority = "Ginini Flats Wetland Complex"

        // Project outcomes
        meriPlan.projectTermOutcomes[0].outcome.value("Project outcome 1")
        meriPlan.projectTermOutcomes[0].priority.value("Ginini Flats Wetland Complex")
        meriPlan.projectTermOutcomes[0].relatedProgramOutcomes = "Program project outcome 1"

        // Threats
        meriPlan.keyThreats[0].relatedOutcomes = "PO1"
        waitFor {
            meriPlan.keyThreats[0].threatCode.find('[value="Habitat loss - Habitat fragmentation"')
        }
        meriPlan.keyThreats[0].threatCode = "Habitat loss - Habitat fragmentation"
        meriPlan.keyThreats[0].threat = "Habitat Loss due to Habitat fragmentation"
        meriPlan.keyThreats[0].intervention = "Intervention 1"
        waitFor {
            meriPlan.keyThreats[0].targetMeasures.find('[value="score_42"')
        }
        meriPlan.keyThreats[0].targetMeasures = ['score_42']
        meriPlan.keyThreats[0].evidence = "Evidence 1"

        // Baselines
        waitFor {
            meriPlan.extendedBaseline.projectBaselines[0].outcome.find('option').collect{it.value()} == ["", "PO1"]
            meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.find('option').collect{it.value()} == ["", "Category 1", "Category 3", "Other"]
        }
        meriPlan.extendedBaseline.projectBaselines[0].outcome = ["PO1"]
        meriPlan.extendedBaseline.projectBaselines[0].monitoringData = "Needs to be collected"

        then:
        waitFor {
            !meriPlan.extendedBaseline.projectBaselines[0].targetMeasures.module(FormElement).disabled
            !meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.module(FormElement).disabled
            !meriPlan.extendedBaseline.projectBaselines[0].evidence.module(FormElement).disabled
        }

        when:
        meriPlan.extendedBaseline.projectBaselines[0].baseline = "Baseline 1"
        meriPlan.extendedBaseline.projectBaselines[0].targetMeasures = ['score_flora_baseline']
        meriPlan.extendedBaseline.projectBaselines[0].methodProtocols = ['Category 1']
        meriPlan.extendedBaseline.projectBaselines[0].evidence = "Baseline Evidence 1"
        meriPlan.hideFloatingSave()
        meriPlan.extendedBaseline.addMonitoringIndicator(0)

        then:
        waitFor {
            meriPlan.extendedBaseline.monitoringIndicators.size() == 1
        }

        when:
        meriPlan.extendedBaseline.monitoringIndicators[0].indicator = "Indicator 1"
        meriPlan.extendedBaseline.monitoringIndicators[0].targetMeasures = ['score_flora_indicator']
        meriPlan.extendedBaseline.monitoringIndicators[0].methodProtocols = ['Category 1']
        meriPlan.extendedBaseline.monitoringIndicators[0].evidence = "Evidence 2"


        waitFor {
            meriPlan.serviceOutcomeTargets.outcomeTargets.size() == 3
        }
        meriPlan.serviceOutcomeTargets.outcomeTargets.eachWithIndex { outcomeTarget, targetIndex ->
            outcomeTarget.target.value("${targetIndex + 1}")
            outcomeTarget.periodTargets.eachWithIndex { periodTarget, periodIndex ->
                periodTarget.value("${(targetIndex + 1) * (periodIndex + 1)}")
            }
        }
        meriPlan.projectMethodology = "Project delivery assumptions"

        meriPlan.projectPartnerships[0].name = 'partner name'
        meriPlan.projectPartnerships[0].partnership = 'partnership'
        meriPlan.projectPartnerships[0].orgType = 'Trust'

        meriPlan.reviewMethodology = "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name = "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section = "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment = "Alignment 1"

        meriPlan.markAsComplete.check()
        waitFor {
            meriPlan.saveAndSubmitChanges.enabled
        }

        meriPlan.submit()

        def previousLoad = getAtCheckTime()
        to RlpProjectPage, projectId
        waitFor { getAtCheckTime() > previousLoad }

        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.isSubmitted()

    }

}
