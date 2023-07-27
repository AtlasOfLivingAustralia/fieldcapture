package au.org.ala.fieldcapture

import groovy.util.logging.Slf4j
import pages.Organisation
import pages.ProgramPage
import pages.ProjectImport
import pages.RlpProjectPage

@Slf4j
class ImportProjectsSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    //Once a project is imported, the status of the project should be Application
    def "New project can be imported into MERIT"() {

        setup:
        File csv = new File(getClass().getResource("/single-project-import-data.csv").toURI())
        loginAsMeritAdmin(browser)

        when:
        to ProjectImport
        attachFile(csv)

        then: "The projects are validated and the validation results are displayed"
        waitFor(10){validateComplete()}

        and: "The data is relevant to the projects loaded"
        List rows = projectResults()
        rows.size() == 2

        when:
        importProjects()

        then:
        waitFor{loadComplete()}

        and:
        List rows2 = projectResults()
        rows2.size() == 2

        when:
        to Organisation, 'test_organisation'
        displayReportsTab()

        then:
        waitFor {
            projectContent[6].text() == 'APPLICATION'
        }

    }

    def "New projects can be imported into MERIT"() {

        setup:
        File csv = new File(getClass().getResource("/multiple-project-import-data.csv").toURI())
        loginAsMeritAdmin(browser)

        when:
        to ProjectImport
        attachFile(csv)

        then: "The projects are validated and the validation results are displayed"
        waitFor(10){validateComplete()}

        and: "The data is relevant to the projects loaded"
        List rows = projectResults()
        rows.size() == 3

        when:
        importProjects()

        then:
        waitFor{loadComplete()}

        and:
        List rows2 = projectResults()
        rows2.size() == 3

        when:
        to Organisation, 'test_organisation'
        displayReportsTab()

        then:
        waitFor {
            $("#projects tbody tr td .badge.badge-info").size() == 2
            $("#projects tbody tr td .badge.badge-info")[0].text() == 'APPLICATION'
            $("#projects tbody tr td .badge.badge-info")[1].text() == 'APPLICATION'
        }
    }

    def "Grants hub projects can be imported into MERIT"() {
        // This is an extended test to capture the additional functionality required when importing projects
        // from the grants hub.

        setup:
        File csv = new File(getClass().getResource("/grants-hub-import-data.csv").toURI())
        loginAsMeritAdmin(browser)

        when:
        to ProjectImport
        attachFile(csv)

        then: "The projects are validated and the validation results are displayed"
        waitFor{validateComplete()}

        and: "The data is relevant to the projects loaded"
        projectResults().size() == 2

        when:
        importProjects()

        then:
        waitFor{loadComplete()}
        and:
        List rows2 = projectResults()
        rows2.size() == 2

        when: "We navigate to the program page to find the new imported project, then open it"
        to ProgramPage, 'configurable_meri_plan'
        openProjectByGrantId('cep-1')

        then:
        at RlpProjectPage

        when:
        displayOverview()

        then:
        overview.program.text() == "Configurable MERI Plan Program"
        overview.projectId.text() == "cep-1"
        overview.status.text().equalsIgnoreCase("Completed")
        overview.externalIds*.text() == ["1234"]
        overview.description.text() == "Grants project description"

        when:
        openMeriPlanEditTab()

        then:
        adminContent.meriPlan.budget.size() == 1
        adminContent.meriPlan.budget[0].description.value() == "Project funding"
        adminContent.meriPlan.budget[0].budgetAmounts()*.value() == ["20000", "10000"]

    }
}
