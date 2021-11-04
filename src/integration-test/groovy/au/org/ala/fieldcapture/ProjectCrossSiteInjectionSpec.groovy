package au.org.ala.fieldcapture

import pages.ProjectIndex

class ProjectCrossSiteInjectionSpec extends StubbedCasSpec {

    def projectId = "project_111"
    void setup() {
        useDataSet('dataset_mu')
    }

    def "Project Explorer Cross Site Script injection"(){
        setup:
        loginAsUser('1', browser)

        when:
        to ProjectIndex, projectId

        then:
        waitFor {at ProjectIndex}
        overviewTab.click()
        waitFor {overview.displayed}

        and:
        overview.programName.text() =='New Test Program <script>alert("Program")</script>'
        overview.managementUnit.text() == 'test mu <script>alert("MU")</script>'

    }

}
