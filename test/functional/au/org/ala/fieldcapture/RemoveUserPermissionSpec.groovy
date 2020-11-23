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
        waitFor 10, {at RemoveUserPermissionPage}

        and:
        adminContent.removeButton.click()

        when:
         to RlpProjectPage, "project_1"

        then:
        waitFor 10, {at RlpProjectPage}

        when:
        adminTab.click()
        then:
        waitFor {adminContent.projectAccessTab.displayed}

        when:
        adminContent.projectAccessTab.click()

        then:
        waitFor {adminContent.projectAccess.displayed}

        and:
        adminContent.projectAccess.size() == 1
        adminContent.projectAccess[0].messageRow.text() ==  "No project members set"
    }

    def "Check ROLE_USER can access the page or not"() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'role-user@nowhere.com', firstName: "ROLE", lastName:'User'], browser)

        when:
        via RemoveUserPermissionPage
        to HomePage

        then:"the user did not have permission to view the page"
        waitFor 10, {at HomePage}

        and:
        title =="Home | MERIT"

    }
}
