package au.org.ala.fieldcapture

import pages.AdminTools
import pages.CreateManagementUnit
import pages.EditManagementUnitPage
import pages.ManagementUnitPage
import pages.MyProjects
import spock.lang.Stepwise

@Stepwise
class ManagementUnitSpec extends StubbedCasSpec {

    static final String NO_PERMISSIONS_USER = "10"
    static final String EDITOR_USER = "4"
    static final String ADMIN_USER = "1"

    def setupSpec() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "Only the about tab is visible to unauthenticated users"() {
        when:
        to ManagementUnitPage, "test_mu"

        then:
        waitFor { at ManagementUnitPage }
        overviewBtn.displayed
        !reportsTab.displayed
        !sitesTab.displayed
        !adminTab.displayed
    }

    def "Only the about tab is visible to users with no permissions for the management unit"(
            String userId, boolean aboutVisible, boolean reportsVisible, boolean sitesVisible, boolean adminVisible) {

        setup:
        if (userId != GRANT_MANAGER_USER_ID) {
            loginAsUser(userId, browser)
        }
        else {
            loginAsGrantManager(browser)
        }

        when:
        to ManagementUnitPage, "test_mu"

        then:
        waitFor { at ManagementUnitPage }
        overviewBtn.displayed == aboutVisible
        reportsTab.displayed == reportsVisible
        sitesTab.displayed == sitesVisible
        adminTab.displayed == adminVisible

        where:
        userId                 | aboutVisible | reportsVisible | sitesVisible | adminVisible
        NO_PERMISSIONS_USER    | true         | false          | false        | false
        EDITOR_USER            | true         | true           | true         | false
        ADMIN_USER             | true         | true           | true         | true
        GRANT_MANAGER_USER_ID  | true         | true           | true         | true

    }

    def "Permissions page in the admin tab is visible to users with Read Only Access role for the management unit"() {

        setup:
        loginAsReadOnlyUser(browser)

        when:
        to ManagementUnitPage, "test_mu"

        then:
        waitFor { at ManagementUnitPage }
        overviewBtn.displayed == true
        reportsTab.displayed == true
        sitesTab.displayed == true
        adminTab.displayed == true

    }

    def "The management unit about tab displays information about programs and projects with activity in the management unit"() {
        setup:
        loginAsGrantManager(browser)

        when:
        to ManagementUnitPage, "test_mu"

        then:
        waitFor { at ManagementUnitPage }

        and:
        overviewBtn().click()

        when:
        //grantIds displayed is still false
        interact {
            moveToElement(projectLinksTd.first())
        }

        then:

        grantIds() == ['RLP-Test-Program-Project-1']
        projectLinks().size() >= 1
        gotoProgram().size() >= 1

        primaryOutcomes() == ['o1', 'o2']
        targetedPrimaryOutcomes() == ['o1']
        secondaryOutcomes() == ['o2', 'o3']
        targetedSecondaryOutcomes() == ['o2', 'o3']
    }

    def "Checking Security Vulnerability after injecting Script tag"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManagementUnitPage, "test_mu"

        and:
        editManagementUnit()

        then:
        waitFor { at EditManagementUnitPage }

        when:
        details.name = "Testing <script>alert('Test')</script>"
        details.description = "Testing"
        details.shortName = "Sample short name"
        details.save()

        then:
        waitFor {at ManagementUnitPage }

        and:
        overviewBtn.click()
        overviewBtn.displayed
        headerTitle.text() == "Testing <script>alert('Test')</script>"
        description.text() == "Testing"


    }


    def "As an fc admin, I can update the reporting period for reports relating to this Management Unit"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManagementUnitPage, "test_mu"
        at ManagementUnitPage
        displayReportsTab()

        then:
        reportsTabPane.reports.size() == 1

        when:
        displayAdminReportConfig()

        then:
        adminTabPane.reportingSection.coreServicesGroup.value() == "Quarterly - Group B (First period ends 31 August 2018)"
        adminTabPane.reportingSection.projectOutputReportingGroup.value() == "Quarterly (First period ends 30 September 2018)"

        when:
        adminTabPane.reportingSection.coreServicesGroup = "Monthly (First period ends 31 July 2018)"
        adminTabPane.reportingSection.projectOutputReportingGroup == "Half-yearly (First period ends 31 December 2018)"
        adminTabPane.reportingSection.saveReportingGroups()

        then:
        waitFor 60, { hasBeenReloaded() }
        at ManagementUnitPage

        when:
        displayReportsTab()
        reportsTabPane.showAllReports()

        then:
        waitFor {
            reportsTabPane.reports.size() == 60
        }
    }

    def "Create mu page"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to CreateManagementUnit

        then:
        waitFor {
            at CreateManagementUnit
        }
        when:
        create.name = "Creating a management unit"
        create.description = "Management Unit Description"
        create.shortName = "Sample short name"
        create.save()

        then:
        waitFor 10, {
            at ManagementUnitPage
        }
        overviewBtn.click()
        headerTitle.text() == "Creating a management unit"
        description.text() == "Management Unit Description"
    }

    def "Management Unit Sites"() {
        setup:
        loginAsAlaAdmin(browser)
        // Re-index the search engine as the sites tab relies on the search index
        to AdminTools
        reindex()

        loginAsUser('1', browser)

        when:
        to ManagementUnitPage, "test_mu"

        then:
        at ManagementUnitPage

        when:
        sitesTab.click()

        then:
        waitFor 10, {
            mapInfo.displayed && mapInfo.text() == "0 projects with 0 sites No georeferenced points for the selected projects"
        }

    }

    def "Management Unit Admin Page"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ManagementUnitPage, "test_mu"

        then:
        at ManagementUnitPage

        when:
        adminTab.click()

        then:
        waitFor 10, {
            adminTabPane.displayed
        }
       adminTabPane.adminColumn.size() == 6
       adminTabPane.adminColumn[0].text() == "Edit"
       adminTabPane.adminColumn[1].text() == "Permissions"
       adminTabPane.adminColumn[2].text() == "Documents"
       adminTabPane.adminColumn[3].text() == "Reporting"
       adminTabPane.adminColumn[4].text() == "Priorities"
       adminTabPane.adminColumn[5].text() == "Configuration"
    }

    def "Add/Remove MU to Favourites"() {
        setup:
        loginAsReadOnlyUser(browser)

        when:
        to ManagementUnitPage, "test_mu"

        then:
        at ManagementUnitPage

        when: "User clicks Add to favourites"
        starBtn.click()

        then:
        waitFor {
            starBtn.text() == "Remove from favourites"
        }


        when:
        to MyProjects

        then:
        waitFor {at MyProjects}

        and: "Favourite Management Unit will be in the list"
        managementUnitNames() == ['Testing <script>alert(\'Test\')</script>']

        when:
        to ManagementUnitPage, "test_mu"

        then:
        at ManagementUnitPage

        when: "User clicks Remove from favourites"
        starBtn.click()

        then:
        waitFor {
            starBtn.text() == "Add to favourites"
        }
    }
}
