package au.org.ala.fieldcapture

import com.icegreen.greenmail.util.GreenMail
import geb.module.FormElement
import pages.AdminClearCachePage
import pages.ReportPage
import pages.RlpProjectPage
import pages.modules.ProgressReportOverviewSection
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
        String ecodataUrl = testConfig.ecodata.baseUrl

        go "$ecodataUrl/admin/clearCache?cache=serviceList"
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
            meriPlan.keyThreats[0].targetMeasures.find('[value="score_43"')
        }
        meriPlan.keyThreats[0].targetMeasures = ['score_43']
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
            def target = 0
            outcomeTarget.periodTargets.eachWithIndex { periodTarget, periodIndex ->
                def targetValue = (targetIndex + 1) * (periodIndex + 1)
                target += targetValue
                periodTarget.value(targetValue)
            }
            outcomeTarget.target.value(target)
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

        when: "We view the contents of the MERI plan in read only mode they match the data we entered"
        meriPlan = openMERIPlanTab()

        then:
        meriPlan.priorityPlace.supportsPriorityPlaces.text() == 'No'
        meriPlan.firstNationsPeopleInvolvement.supportsFirstNationsPeopleInvolvement.text() == 'Yes'
        meriPlan.firstNationsPeopleInvolvement.firstNationsPeopleInvolvement.text() == 'Leading'

        meriPlan.primaryOutcome.text() == "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        meriPlan.primaryPriority.text() == "Ginini Flats Wetland Complex"
        meriPlan.secondaryOutcomes[0].outcome.text() == "By 2023, there is restoration of, and reduction in threats to, the ecological character of Ramsar sites, through the implementation of priority actions"
        meriPlan.secondaryOutcomes[0].priority.text() == "Ginini Flats Wetland Complex"
        meriPlan.projectTermOutcomes[0].outcome.text() == "Project outcome 1"
        meriPlan.projectTermOutcomes[0].priority.text() == "Ginini Flats Wetland Complex"
        meriPlan.projectTermOutcomes[0].relatedProgramOutcomes.text() == "Program project outcome 1"

        meriPlan.keyThreats[0].threat.text() == "Habitat Loss due to Habitat fragmentation"
        meriPlan.keyThreats[0].intervention.text() == "Intervention 1"
        meriPlan.keyThreats[0].evidence.text() == "Evidence 1"
        meriPlan.keyThreats[0].relatedOutcomes.text() == 'PO1'

        meriPlan.extendedBaseline.projectBaselines[0].outcome.text() == "PO1"
        meriPlan.extendedBaseline.projectBaselines[0].monitoringData.text() == "Needs to be collected"
        meriPlan.extendedBaseline.projectBaselines[0].baseline.text() == "Baseline 1"
        meriPlan.extendedBaseline.projectBaselines[0].methodProtocols.text() == 'Category 1'
        meriPlan.extendedBaseline.projectBaselines[0].evidence.text() == "Baseline Evidence 1"
        meriPlan.monitoringIndicators[0].indicator.text() == "Indicator 1"
        meriPlan.monitoringIndicators[0].methodProtocols.text() == 'Category 1'
        meriPlan.monitoringIndicators[0].evidence.text() == "Evidence 2"

        waitFor {
            meriPlan.serviceOutcomeTargets.outcomeTargets.size() == 3
        }
        meriPlan.serviceOutcomeTargets.outcomeTargets[0].target.text() == "15"
        meriPlan.serviceOutcomeTargets.outcomeTargets[0].periodTargets[0].text() == "1"
        meriPlan.serviceOutcomeTargets.outcomeTargets[0].periodTargets[1].text() == "2"
        meriPlan.serviceOutcomeTargets.outcomeTargets[0].periodTargets[2].text() == "3"
        meriPlan.serviceOutcomeTargets.outcomeTargets[1].target.text() == "30"
        meriPlan.serviceOutcomeTargets.outcomeTargets[1].periodTargets[0].text() == "2"
        meriPlan.serviceOutcomeTargets.outcomeTargets[1].periodTargets[1].text() == "4"
        meriPlan.serviceOutcomeTargets.outcomeTargets[1].periodTargets[2].text() == "6"
        meriPlan.serviceOutcomeTargets.outcomeTargets[2].target.text() == "45"
        meriPlan.serviceOutcomeTargets.outcomeTargets[2].periodTargets[0].text() == "3"
        meriPlan.serviceOutcomeTargets.outcomeTargets[2].periodTargets[1].text() == "6"
        meriPlan.serviceOutcomeTargets.outcomeTargets[2].periodTargets[2].text() == "9"

        meriPlan.projectMethodology.text() == "Project delivery assumptions"
        meriPlan.projectPartnerships[0].name == 'partner name'
        meriPlan.projectPartnerships[0].partnership == 'partnership'
        meriPlan.projectPartnerships[0].orgType == 'Trust'
        meriPlan.reviewMethodology.text() == "Review methodology"
        meriPlan.nationalAndRegionalPlans[0].name.text() == "Plan 1"
        meriPlan.nationalAndRegionalPlans[0].section.text() == "Section 1"
        meriPlan.nationalAndRegionalPlans[0].alignment.text() == "Alignment 1"

        when: "We login as a grant manager and approve the plan"
        loginAsGrantManager(browser)
        to RlpProjectPage, projectId
        meriPlan = openMeriPlanEditTab()
        previousLoad = getAtCheckTime()
        meriPlan.approvePlan("1234", "Test approval")

        and: "we wait for the page to reload"

        waitFor { hasBeenReloaded() }
        at RlpProjectPage // Reset at check time
        meriPlan = openMeriPlanEditTab()

        then:
        meriPlan.isApproved()

        when: "We generate the reports, but extend the project by 6 months"
        displayReportingTab(0)
        setDate(projectReports.projectStartDate, "01-07-2026")
        setDate(projectReports.projectEndDate, "31-12-2028")
        projectReports.generateButton.click()


        then: "We wait for the reports to be generated"
        waitFor { hasBeenReloaded() }
        projectReports.getReportCategories() == ["Progress Reports", "Final Report"]

    }

    def "The progress reports display the forecasts for the period they are in"() {
        setup: "The user with userId 1 is an admin for project with projectId grants1"
        String projectId = 'grants1'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        displayReportingTab(2)
        projectReports.reportsByCategory.find { it.category == "Progress Reports" }.reports[0].edit()

        then:
        at ReportPage
        getFormSections() == ["koOverview_Output_Report", "koNHT_-_Communication_materials", "koNHT_-_Flora_survey"]

        when:
        def outcomeTargetsSection = getFormSection("koOverview_Output_Report").module(ProgressReportOverviewSection)

        then: "The forecasts for this period match those in the MERI plan"
        outcomeTargetsSection.projectOutcomes.size() == 1
        outcomeTargetsSection.projectOutcomes[0].outcomeCode.text() == "PO1"
        outcomeTargetsSection.projectOutcomes[0].outcomeDescription == "Project outcome 1"

        outcomeTargetsSection.projectOutcomeTargets.size() == 3
        outcomeTargetsSection.projectOutcomeTargets[0].target == "15"
        outcomeTargetsSection.projectOutcomeTargets[0].targetThisReport == "1"
        outcomeTargetsSection.projectOutcomeTargets[1].target == "30"
        outcomeTargetsSection.projectOutcomeTargets[1].targetThisReport == "2"
        outcomeTargetsSection.projectOutcomeTargets[2].target == "45"
        outcomeTargetsSection.projectOutcomeTargets[2].targetThisReport == "3"
    }
}
