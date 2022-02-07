package au.org.ala.fieldcapture

import pages.HomePage
import pages.RemoveUserPermissionPage
import pages.RlpProjectPage

class RemoveUserPermissionSpec extends StubbedCasSpec {

    def setup (){
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "I can search user details using email Address as an ALA administrator"() {

        setup:
        loginAsAlaAdmin(browser)

        when:
        to RemoveUserPermissionPage
        adminContent.email = "user1@nowhere.com.au"
        adminContent.searchButton.click()

        then:
        waitFor { adminContent.userId.text() == "1" }
        adminContent.emailAddress.text() == "user1@nowhere.com.au"
        adminContent.firstName.text() == "Test"
        adminContent.lastName.text() == "Test"

    }

    def "I can search user details using email Address and remove user as a MERIT administrator"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to RemoveUserPermissionPage

        then:
        waitFor {at RemoveUserPermissionPage}

        when: "We search for a user and remove their permissions"
        adminContent.email = "user1@nowhere.com.au"
        adminContent.searchButton.click()
        waitFor { adminContent.userId.text() == "1" }
        adminContent.removeButton.click()

        then:
        waitFor { hasBeenReloaded() }

        when: "Check user if exist in project admin access tab after removing from admin section"
        to RlpProjectPage, "project_1"
        openAdminTab()
        adminContent.openProjectAccess()

        then:
        waitFor {
            adminContent.projectAccess.messageRow.text() == "No project members set"
        }
    }

    def "Check ROLE_USER can access the page or not"() {
        setup:
        loginAsUser('1', browser)

        when:
        via RemoveUserPermissionPage

        then:"the user did not have permission to view the page"
        at HomePage

    }
}
