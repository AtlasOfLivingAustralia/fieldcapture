package au.org.ala.fieldcapture

import pages.MERITAdministrationPage

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
        to MERITAdministrationPage

        then:
        at MERITAdministrationPage

        and:
        administration.adminTab.size() == 11
        administration.audit.text() == " Audit"
        administration.staticPages.text() == " Static pages"
        administration.helpResources.text() == " Help Resources"
        administration.siteBlog.text() == " Site Blog"
        administration.homePageImages.text() == " Home Page Images"
        administration.administratorReport.text() == " Administrator Reports"
        administration.loadProject.text() == " Load new projects into MERIT"
        administration.removeUser.text() == " Remove User from MERIT"
        administration.tools.text() == " Tools"
        administration.settings.text() == " Settings"
        administration.caches.text() == " Caches"
    }

    def "Admin Static pages"() {
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'fc-admin@nowhere.com', firstName: "ALA", lastName:'Admin'], browser)

        when:
        to MERITAdministrationPage

        then:
            at MERITAdministrationPage
        when:
        administration.staticPages.click()

        then:
        waitFor { administration.staticPageContent.displayed }

        administration.staticPageContent.pageId.size() == 67

    }
}
