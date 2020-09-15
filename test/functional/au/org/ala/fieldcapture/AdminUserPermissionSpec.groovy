package au.org.ala.fieldcapture

import pages.AdminPage

class AdminUserPermissionSpec extends StubbedCasSpec {

    def setup (){
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "I can search user details using email Address as an FC_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to AdminPage

        then:
        waitFor {at AdminPage}

        when:
        adminContent.email = "auser@nowhere.com.au"
        adminContent.searchButton.click()

        then:
        waitFor 20, {at AdminPage}

        and:
        waitFor { adminContent.userId.text() == "100" }
        adminContent.emailAddress.text() == "auser@nowhere.com.au"
        adminContent.firstName.text() == "Test"
        adminContent.lastName.text() == "Test"

    }

    def "I can search user details using email Address and remove user as an FC_ADMIN"() {

        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to AdminPage

        then:
        waitFor {at AdminPage}

        when:
        adminContent.email = "auser@nowhere.com.au"
        adminContent.searchButton.click()

        then:
        waitFor {at AdminPage}

        and:
        adminContent.removeButton.click()
    }

}
