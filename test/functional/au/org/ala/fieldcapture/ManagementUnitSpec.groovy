package au.org.ala.fieldcapture

import pages.EditManagementUnitPage
import pages.ManagementUnitPage

class ManagementUnitSpec extends StubbedCasSpec {

    static final String NO_PERMISSIONS_USER = "10"
    static final String EDITOR_USER = "4"
    static final String ADMIN_USER = "1"
    static final String GRANT_MANAGER_USER = "3"

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "Only the about tab is visible to unauthenticated users"() {
        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}
        overviewBtn.displayed
        !reportsTab.displayed
        !sitesTab.displayed
        !adminTab.displayed
    }


    def "Only the about tab is visible to users with no permissions for the management unit"(
            String userId, boolean aboutVisible, boolean reportsVisible, boolean sitesVisible, boolean adminVisible) {

        setup:
        String role = "ROLE_USER"
        if (userId == GRANT_MANAGER_USER) {
            role = "ROLE_FC_OFFICER"
        }
        login([userId:userId, role:role, email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}
        overviewBtn.displayed == aboutVisible
        reportsTab.displayed == reportsVisible
        sitesTab.displayed == sitesVisible
        adminTab.displayed == adminVisible

        where:
        userId              | aboutVisible | reportsVisible | sitesVisible | adminVisible
        NO_PERMISSIONS_USER | true | false | false | false
        EDITOR_USER         | true | true | true | false
        ADMIN_USER          | true | true | true | true
        GRANT_MANAGER_USER  | true | true | true | true

    }

    def "The management unit about tab displays information about programs and projects with activity in the management unit"() {
        setup:
        login([userId:ADMIN_USER, role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}

        and:
        overviewBtn().click()

        when:
        //grantIds displayed is still false
        interact {
            moveToElement(projectLinksTd.first())
        }

        then:

        grantIds() == ['RLP-Test-Program-Project-1']
        projectLinks().size()>=1
        gotoProgram().size() >= 1

        primaryOutcomes() == ['o1', 'o2']
        targetedPrimaryOutcomes()  == ['o1']
        secondaryOutcomes() == ['o2', 'o3']
        targetedSecondaryOutcomes() == ['o2', 'o3']
    }

    def "Checking Security Vulnerability after injecting Script tag"(){
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'fc-admin@nowhere.com', firstName: "FC", lastName:'Admin'], browser)

        when:
        to ManagementUnitPage

        and:
        editManagementUnit()

        then:
        waitFor { at EditManagementUnitPage}

        when:
        details.name= "Testing <script>alert('Test')</script>"
        details.description= "Testing"
        details.save()

        then:
        at ManagementUnitPage

        and:
        overviewBtn.click()
        overviewBtn.displayed
        headerTitle.text() == "Testing <script>alert('Test')</script>"
        description.text() == "Testing"


    }


    def "As an fc admin, I can update the reporting period for reports relating to this Management Unit"(){
        setup:
        login([userId:'1', role:"ROLE_FC_ADMIN", email:'user@nowhere.com', firstName: "MERIT", lastName:'FC_ADMIN'], browser)

        when:
        to ManagementUnitPage
        at ManagementUnitPage
        displayReportsTab()

        then:
        reportsTabPane.reports.size() == 1

        when:
        displayAdminReportConfig()

        then:
        adminTabPane.reportingSection.coreServicesGroup.value() == "Quarterly - Group B (First period ends 31 August 2018)"
        adminTabPane.reportingSection.projectOutputReportingGroup.value()  == "Quarterly (First period ends 30 September 2018)"

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


}
