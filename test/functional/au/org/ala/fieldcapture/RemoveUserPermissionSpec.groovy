package au.org.ala.fieldcapture

import pages.ProjectIndex
import pages.RemoveUserPermissionPage

class RemoveUserPermissionSpec extends StubbedCasSpec {

    def setup (){
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "I can search user details using email Address as an ROLE_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'role-admin@nowhere.com', firstName: "ROLE", lastName:'Admin'], browser)

        when:
        to RemoveUserPermissionPage

        then:
        waitFor {at RemoveUserPermissionPage}

        when:
        adminContent.email = "auser@nowhere.com.au"
        adminContent.searchButton.click()

        then:
        waitFor 20, {at RemoveUserPermissionPage}

        and:
        waitFor { adminContent.userId.text() == "1" }
        adminContent.emailAddress.text() == "auser@nowhere.com.au"
        adminContent.firstName.text() == "Test"
        adminContent.lastName.text() == "Test"

    }

    def "I can search user details using email Address and remove user as an FC_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'role-admin@nowhere.com', firstName: "ROLE", lastName:'Admin'], browser)

        when:
        to RemoveUserPermissionPage

        then:
        waitFor {at RemoveUserPermissionPage}

        when:
        adminContent.email = "auser@nowhere.com.au"
        adminContent.searchButton.click()

        then:
        waitFor {at RemoveUserPermissionPage}

        when:
        adminContent.removeButton.click()

        then:
        waitFor {at RemoveUserPermissionPage }

        when:
        to ProjectIndex, "project_1"

        then:
        waitFor {at ProjectIndex}
        when:
        adminTab.click()
        then:
        waitFor {admin.projectAccessTab.displayed}

        when:
        admin.projectAccessTab.click()

        then:
        waitFor {admin.projectAccess.displayed}

        and:
        admin.projectAccess.size() == 1
        admin.projectAccess[0].messageRow.text() ==  "No project members set"
    }
}
