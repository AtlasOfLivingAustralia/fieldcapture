package au.org.ala.fieldcapture

import pages.Organisation

class OrganisationProjectSpec extends StubbedCasSpec {

    def orgId = "test_organisation_1"
    void setup(){
        useDataSet("dataset_crossSite");
    }

    void "Checking Cross Site Injecting check on project Name "() {

        setup:
        loginAsUser('1', browser)

        when:
        to Organisation, orgId

        then:
        waitFor {at Organisation}
        projectTab.click()

        and:
        waitFor {
            projectContent[1].text() == "Project Script Injection <script>alert('Test')</script>"
        }
    }
}
