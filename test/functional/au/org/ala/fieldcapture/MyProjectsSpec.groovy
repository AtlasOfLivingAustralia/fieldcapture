package au.org.ala.fieldcapture

import pages.MyProjects

class MyProjectsSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    def "As a user, I can view a list of my projects"() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to MyProjects

        then:
        waitFor {at MyProjects}
        projectNames() == ['Project 1', 'Project 2', 'Project 3']
        managementUnitNames() == ['Test management unit']
        programNames() == ['Test program']
    }

}
