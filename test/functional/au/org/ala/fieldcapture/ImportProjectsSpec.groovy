package au.org.ala.fieldcapture

import pages.ProjectImport

class ImportProjectsSpec extends StubbedCasSpec {

    def "New projects can be imported into MERIT"() {

        setup:
        File csv = new File(getClass().getResource("/resources/project-import-data.csv").toURI())
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ProjectImport
        attachFile(csv)


        then: "The projects are validated and the validation results are displayed"
        waitFor{progressTable.displayed}

        and: "The data is relevant to the projects loaded"
        List rows = projectResults()
        println rows
        rows.size() == 2

        when:
        importProjects()

        then:
        waitFor{loadComplete()}

        and:
        List rows2 = projectResults()
        println rows2

        rows2.size() == 2



    }

}
