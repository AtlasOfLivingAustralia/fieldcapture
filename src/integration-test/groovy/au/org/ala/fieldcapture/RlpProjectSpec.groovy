package au.org.ala.fieldcapture

import pages.RlpProjectPage
import spock.lang.Stepwise

@Stepwise
class RlpProjectSpec extends StubbedCasSpec {

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

        then:
        waitFor { at RlpProjectPage }

        and: "All of the project tabs are visible as the user has the grant manager role"
        overviewTab.displayed == true
        dashboardTab.displayed == true
        documentsTab.displayed == true
        meriPlanTab.displayed == true
        sitesTab.displayed == true
        reportingTab.displayed == true
        adminTab.displayed == true

        when:
        overviewTab.click()

        then: "The content on the overview tab is correct"
        waitFor { overview.displayed }

        name.text() == 'Project 1'
        // This is initialised via knockoutjs so we need to wait for the script to run.
        waitFor {
            overview.description.text() == 'Project 1 description'
        }
        overview.program.text() == 'Test program'
        overview.managementUnitName.text() == 'Test management unit'
        overview.serviceProviderName.text() == 'Test Org'
        overview.projectId.text() == 'RLP-Test-Program-Project-1'
        overview.status.text() == 'ACTIVE'
        overview.startDate.text() == '01-07-2018'
        overview.endDate.text() == '01-07-2023'
        overview.projectFundingAmount.text() == '$100,000.00'
        Thread.sleep(10000)
        overview.internalOrderIds.text() == '1234565'

    }

    def "All tabs are visible to users with the siteOffice role"() {

        setup:
        String projectId = '1'
        loginAsGrantManager(browser)
        println "Logged in"

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.displayed == true
        documentsTab.displayed == true
        meriPlanTab.displayed == true
        sitesTab.displayed == true
        reportingTab.displayed == true
        adminTab.displayed == true
    }


    def "Only the overview tab and document tab are displayed to un-authenticated users"() {

        setup:
        logout(browser)
        String projectId = '1'
        println "No login!"

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.empty == true
        documentsTab.displayed == true
        meriPlanTab.empty == true
        sitesTab.empty == true
        reportingTab.empty == true
        adminTab.empty == true
    }

    def "Only the overview tab and document tab are displayed to non-project members users"() {

        setup:
        String projectId = '1'
        loginAsUser('100', browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.empty == true
        documentsTab.displayed == true
        meriPlanTab.empty == true
        sitesTab.empty == true
        reportingTab.empty == true
        adminTab.empty == true
    }

    def "All tabs are visible to project admins"() {

        setup: "user 1 is an admin for project 1"
        String projectId = '1'
        loginAsUser('1', browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.displayed == true
        documentsTab.displayed == true
        meriPlanTab.displayed == true
        sitesTab.displayed == true
        reportingTab.displayed == true
        adminTab.displayed == true
    }

    def "All tabs are visible to project editors"() {

        setup: "user 10 is an editor for project 1"
        String projectId = '1'
        loginAsUser('10', browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        and:
        overviewTab.displayed == true
        dashboardTab.displayed == true
        documentsTab.displayed == true
        meriPlanTab.displayed == true
        sitesTab.displayed == true
        reportingTab.displayed == true
        adminTab.displayed == true
    }

    def "The project sites are displayed on the sites tab and are visible to editors"() {
        setup: "user 10 is an editor for project 1"
        String projectId = '1'
        loginAsReadOnlyUser(browser)

        when:
        to RlpProjectPage, projectId

        then:
        waitFor { at RlpProjectPage }

        when:
        sitesTab.click()
        waitFor { sitesTabContent.map.displayed }

        then:
        sitesTabContent.sitesTableRows.size() == 1
        sitesTabContent.sitesTableRows[0].name == "Test site 1"
        waitFor { sitesTabContent.markerCount() == 1 } // The map is initialised asynchronously

    }



}
