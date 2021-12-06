package au.org.ala.fieldcapture

import pages.RlpProjectPage

class ProjectPermissionSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset2')
    }

    def cleanup() {
        logout(browser)
    }


    def "the project details are displayed correctly on the overview tab"() {

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
        adminContent.projectAccess.findPermissionForUser('2').roleText == "Admin"

        when: "We change user 2 to an editor"
        adminContent.projectAccess.findPermissionForUser('2').updateRole('editor')

        and: "Confirm we want to change the role"
        okBootbox()

        then:
        waitFor {
            adminContent.projectAccess.findPermissionForUser('2').roleText == "Editor"
        }



    }
}
