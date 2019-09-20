package au.org.ala.fieldcapture

import pages.ManagementUnitPage

class ManagementUnitSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def "As a user, I can view a management unit"() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}
        grantIds() == ['RLP-Test-Program-Project-1','RLP-Test-Program-Project-2']
    }

}
