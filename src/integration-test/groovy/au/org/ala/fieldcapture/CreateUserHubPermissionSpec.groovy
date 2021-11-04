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
        loginAsUser('1', browser)

        when:
        via CreateUserHubPermissionPage

        then: "the user did not have permission to view the page"
        waitFor 10, { at HomePage }

        and:
        title == "Home | MERIT"

    }

    // Temporarily commenting this out as it leaves an alert dialog open which causes
    // the rest of the tests to fail.
//    def "I can access the page as a MERIT administrator"() {
//
//        setup:
//        loginAsMeritAdmin(browser)
//
//        when:
//        to CreateUserHubPermissionPage
//
//        then:
//        waitFor 20, { at CreateUserHubPermissionPage }
//
//
//    }
}