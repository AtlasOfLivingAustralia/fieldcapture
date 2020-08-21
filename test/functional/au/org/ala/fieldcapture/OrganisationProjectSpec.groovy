package au.org.ala.fieldcapture

import pages.Organisation

class OrganisationProjectSpec extends StubbedCasSpec {

    def orgId = "test_organisation_1"
    void setup(){
        useDataSet("dataset_crossSite");
    }

    void "Checking Cross Site Injecting check on project Name "() {

        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

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
