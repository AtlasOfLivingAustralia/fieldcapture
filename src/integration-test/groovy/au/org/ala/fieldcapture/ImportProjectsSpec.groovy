package au.org.ala.fieldcapture

import pages.Organisation
import pages.ProjectImport

class ImportProjectsSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    //Once a project is imported, the status of the project should be Application
    def "New project can be imported into MERIT"() {

        setup:
        File csv = new File(getClass().getResource("/single-project-import-data.csv").toURI())
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectImport
        attachFile(csv)

        then: "The projects are validated and the validation results are displayed"
        waitFor{validateComplete()}

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
        logout(browser)
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)
        to Organisation, 'test_organisation'

        then:
        waitFor {projectTab.displayed}
        projectTab.click()

        and:
        waitFor {
            $("#projectList tbody tr td .badge.badge-info").text() == 'APPLICATION'
        }

    }

    def "New projects can be imported into MERIT"() {

        setup:
        File csv = new File(getClass().getResource("/multiple-project-import-data.csv").toURI())
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectImport
        attachFile(csv)

        then: "The projects are validated and the validation results are displayed"
        waitFor{validateComplete()}

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
        logout(browser)
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)
        to Organisation, 'test_organisation'

        then:
        waitFor {projectTab.displayed}
        projectTab.click()

        and:
        waitFor {
            $("#projectList tbody tr td .badge.badge-info").size() == 2
            $("#projectList tbody tr td .badge.badge-info")[0].text() == 'APPLICATION'
            $("#projectList tbody tr td .badge.badge-info")[1].text() == 'APPLICATION'
        }
    }
}
