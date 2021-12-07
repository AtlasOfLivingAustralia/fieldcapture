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
        waitFor 30, { at HomePage }

        and:
        title == "Home | MERIT"

    }

    def "I can access the page as a MERIT administrator"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to CreateUserHubPermissionPage

        then:
        waitFor 50, { at CreateUserHubPermissionPage }


    }

    def "list of values are displayed in the table"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to CreateUserHubPermissionPage

        then:
        permissions.size() == 3


    }

    def "I can add,update and remove the user permission in Merit Hub"() {

        setup:
        loginAsMeritAdmin(browser)

        when:
        to CreateUserHubPermissionPage

        String emailAddress = "user2@user.com"
        String permission = "officer"
        String expiryDate = "06/12/2021"

        addHubPermission(emailAddress,permission,expiryDate)

        then: "User appears in the permissions table with the officer role"
        waitFor {
            permissions.size() == 4
        }
        findPermissionForUser('2').userId == "2"
        findPermissionForUser('2').sortRoleSelection == "Officer"

        when: "We update the user's permission to site admin"
        findPermissionForUser('2').updateRole("siteAdmin")

        and: "Confirm we want to change the permission"
        okBootbox()

        then:
        waitFor {
            findPermissionForUser('2').sortRoleSelection == "Site Admin"
        }

        when: "We remove the user permission in Merit Hub"
        findPermissionForUser('2').remove()

        and: "Confirm we want to remove the permission"
        okBootbox()

        then:
        waitFor {
            permissions.size() == 3
        }

    }


}