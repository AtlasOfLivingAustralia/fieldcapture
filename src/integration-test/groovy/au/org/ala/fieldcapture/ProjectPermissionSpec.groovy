package au.org.ala.fieldcapture

import org.openqa.selenium.ElementNotInteractableException
import pages.RlpProjectPage

class ProjectPermissionSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }

    def "a grant manager can add and modify user roles for a project"() {

        setup:
        String projectId = '1'
        loginAsGrantManager(browser)

        when:
        to RlpProjectPage, projectId
        openAdminTab()
        adminContent.openProjectAccess()

        then:
        adminContent.projectAccess.permissions.size() == 3

        when: "We add user2 as an admin to the project"
        adminContent.projectAccess.addPermission("user2@user.com", "admin")

        then: "User 2 appears in the permissions table with the Admin role"
        waitFor {
            adminContent.projectAccess.permissions.size() == 4
        }
        adminContent.projectAccess.findPermissionForDisplayName('test2 user2').roleText == "Admin"

        when: "We change user 2 to an editor"
        adminContent.projectAccess.findPermissionForDisplayName('test2 user2').updateRole('editor')

        and: "Confirm we want to change the role"
        okBootbox()

        then:
        waitFor {
            adminContent.projectAccess.findPermissionForDisplayName('test2 user2').roleText == "Editor"
        }

        when: "We delete the new permission"
        adminContent.projectAccess.findPermissionForDisplayName('test2 user2').remove()

        and: "Confirm we want to remove the role"
        okBootbox()

        then:
        waitFor {
            adminContent.projectAccess.permissions.size() == 3
        }
        !adminContent.projectAccess.findPermissionForDisplayName('test2 user2')

    }

    def "an admin cannot add a user as a grant manager, but can change an editor to an admin"() {

        setup:
        String projectId = '1'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId
        openAdminTab()
        adminContent.openProjectAccess()

        then:
        adminContent.projectAccess.permissions.size() == 3

        when: "We try and add a grant manager (user with id = 1001) as a grant manager to the project"
        adminContent.projectAccess.addPermission("user1001@user.com", "caseManager")

        then: "we cannot because the 'Grant Manager' option is disabled"
        thrown(Exception)  // The type of exception thrown has changed

        when: "We change user 10 to an admin"
        adminContent.projectAccess.findPermissionForDisplayName('test10 user10').updateRole('admin')
        okBootbox()

        then:
        waitFor {
            adminContent.projectAccess.findPermissionForDisplayName('test10 user10').roleText == "Admin"
        }

    }

    def "a read only users can view the user roles for a project"() {

        setup:
        String projectId = '1'
        loginAsReadOnlyUser(browser)

        when:
        to RlpProjectPage, projectId
        openAdminTab()
        adminContent.openProjectAccess()

        then:
        adminContent.projectAccess.permissions.size() == 3

    }
}