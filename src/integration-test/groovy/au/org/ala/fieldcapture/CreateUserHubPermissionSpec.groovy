package au.org.ala.fieldcapture

import pages.CreateUserHubPermissionPage
import pages.HomePage
import pages.RemoveUserPermissionPage
import pages.RlpProjectPage

class CreateUserHubPermissionSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "Check ROLE_USER can access the page or not"() {
        setup:
        login([userId: '1', role: "ROLE_USER", email: 'role-user@nowhere.com', firstName: "ROLE", lastName: 'User'], browser)

        when:
        via CreateUserHubPermissionPage
        to HomePage

        then: "the user did not have permission to view the page"
        waitFor 10, { at HomePage }

        and:
        title == "Home | MERIT"

    }

    def "I can access the page as a ROLE_FC_ADMIN"() {

        setup:
        login([userId: '129333', role: "ROLE_FC_ADMIN", email: 'joseph.salomon@csiro.au', firstName: "joseph", lastName: 'salomon'], browser)

        when:
        to CreateUserHubPermissionPage

        then:
        waitFor 20, { at CreateUserHubPermissionPage }


    }
}