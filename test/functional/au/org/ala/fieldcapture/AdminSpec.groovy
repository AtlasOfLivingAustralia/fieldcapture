package au.org.ala.fieldcapture

import pages.AdminPage

class AdminSpec extends StubbedCasSpec {
    def setupSpec() {
        useDataSet("dataset3")
    }

    def cleanup() {
        logout(browser)
    }

    def "Admin Index"() {
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "ALA", lastName:'Admin'], browser)

        when:
        to AdminPage

        then:
        waitFor {
            at AdminPage
        }
        and:
        staticTab.adminTab.size() == 11
        staticTab.adminTab[0].text() == " Audit"
        staticTab.adminTab[1].text() == " Static pages"
        staticTab.adminTab[2].text() == " Help Resources"
        staticTab.adminTab[3].text() == " Site Blog"
        staticTab.adminTab[4].text() == " Home Page Images"
        staticTab.adminTab[5].text() == " Administrator Reports"
        staticTab.adminTab[6].text() == " Load new projects into MERIT"
        staticTab.adminTab[7].text() == " Remove User from MERIT"
        staticTab.adminTab[8].text() == " Tools"
        staticTab.adminTab[9].text() == " Settings"
        staticTab.adminTab[10].text() == " Caches"
    }

    def "Admin Static pages"() {
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "ALA", lastName:'Admin'], browser)

        when:
        to AdminPage

        then:
        waitFor {
            at AdminPage
        }

        when:
        staticTab.adminTab[1].click()

        then:
        staticTab.staticPage[0].text() == "fielddata.title.text"
        staticTab.staticPage[3].text() == "fielddata.about.text"


    }
}
