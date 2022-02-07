package au.org.ala.fieldcapture

import org.openqa.selenium.ElementNotInteractableException
import pages.ManagementUnitPage
import pages.RlpProjectPage

class ManagementUnitPermissionSpec extends StubbedCasSpec {
    def setupSpec() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "Management Unit Admin Page"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManagementUnitPage, "test_mu"
        openAdminTab()
        adminTabPane.openPermissionAccess()

        then:
        adminTabPane.permissionAccess.permissions.size() == 3

        when: "We add user2 as an admin to the project"
        adminTabPane.permissionAccess.addPermission("user2@user.com", "admin")

        then: "User 2 appears in the permissions table with the Admin role"
        waitFor {
            adminTabPane.permissionAccess.permissions.size() == 4
        }

        when: "We change user 2 to an editor"
        adminTabPane.permissionAccess.findPermissionForUser('2').updateRole('editor')

        and: "Confirm we want to change the role"
        okBootbox()

        then:
        waitFor {
            adminTabPane.permissionAccess.findPermissionForUser('2').roleText == "Editor"
        }

        when: "We delete the new permission"
        adminTabPane.permissionAccess.findPermissionForUser('2').remove()

        and: "Confirm we want to remove the role"
        okBootbox()

        then:
        waitFor {
            adminTabPane.permissionAccess.permissions.size() == 3
        }

    }

    def "an admin cannot add a user as a grant manager, but change change an editor to an admin"() {

        setup:
        String projectId = '1'
        loginAsUser('1', browser)

        when:
        to ManagementUnitPage, "test_mu"
        openAdminTab()
        adminTabPane.openPermissionAccess()

        then:
        adminTabPane.permissionAccess.permissions.size() == 3

        when: "We try and add a grant manager (user with id = 1001) as a grant manager to the project"
        adminTabPane.permissionAccess.addPermission("user1001@user.com", "caseManager")

        then: "we cannot because the 'Grant Manager' option is disabled"
        thrown(ElementNotInteractableException)

        when: "We change user 4 to an admin"
        adminTabPane.permissionAccess.findPermissionForUser('4').updateRole('admin')
        okBootbox()

        then:
        waitFor {
            adminTabPane.permissionAccess.findPermissionForUser('4').roleText == "Admin"
        }

    }
}