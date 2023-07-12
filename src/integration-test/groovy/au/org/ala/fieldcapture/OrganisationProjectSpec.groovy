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
        reportingTab.click()

        and:
        waitFor {
            projectContent[1].text() == "Project Script Injection <script>alert('Test')</script>"
        }
    }

    void "Can setup organisation configuration in the admin tab"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to Organisation, orgId

        then:
        waitFor {at Organisation}

        openAdminTab()
        adminTabContent.openConfig()

        when:
        adminTabContent.config.config = '{ "visibility": "public" }'
        adminTabContent.config.save()

        then:
        adminTab.displayed == true
    }
}
