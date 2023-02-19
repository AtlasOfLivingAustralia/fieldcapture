package au.org.ala.fieldcapture

import pages.RlpProjectPage

class ProjectContentConfigurationSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        println "Logout"
        logout(browser)
        println "Logged out"
    }

    def "The program configuration can exclude content from the project template"() {
        setup:
        String projectId = 'excludedContent'
        loginAsGrantManager(browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.displayed == false
        documentsTab.displayed == false
        meriPlanTab.displayed == false
        sitesTab.displayed == false
        reportingTab.displayed == true
        adminTab.displayed == true

        when:
        openAdminTab()

        then:
        adminContent.risksAndThreats.displayed == false

    }

    def "The project configuration can override the program configuration"() {
        setup:
        String projectId = 'excludedContent'
        loginAsMeritAdmin(browser)

        when: "We override the config in the project"
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        openAdminTab()
        adminContent.openConfig()
        adminContent.configOverride.config = '{ "excludes":null }'
        adminContent.configOverride.save()

        then:
        waitFor { hasBeenReloaded() }
        overviewTab.displayed == true
        dashboardTab.displayed == true
        documentsTab.displayed == true
        meriPlanTab.displayed == true
        sitesTab.displayed == true
        reportingTab.displayed == true
        adminTab.displayed == true

    }
}
