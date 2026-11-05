package au.org.ala.fieldcapture

import pages.MyProjects

class MyProjectsSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset2')
    }

    def "As a user, I can view a list of my projects"() {
        setup:
        loginAsUser('1', browser)

        when:
        to MyProjects

        then:
        waitFor {at MyProjects}
        projectNames().sort() == [ 'Configurable MERI plan project','Default outcome project','New Grants Project','Project 1', 'Project 2', 'Project 3']
        managementUnitNames() == ['Test management unit']
        programNames() == ['Test program']
    }

}
