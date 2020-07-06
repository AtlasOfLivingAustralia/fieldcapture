package au.org.ala.fieldcapture

import pages.ManagementUnitPage
import pages.AdminReportsPage

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



/*    def "As an site admin, I can get report periods and request to generate reports"(){
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to AdminReportsPage

        then:
        waitFor {at AdminReportsPage}
        selectedPeriod() =="startDate=2018-07-01&endDate=2019-06-30"

        when:
        interact {
            downloadReportBtn().click()
        }

        then:
        waitFor{showDownloadDetailsIcon().isDisplayed()}

//        when:
//        interact {
//            showDownloadDetailsIcon().click()
//        }
//
//        then:
//        waitFor{muReportDownloadLink().isDisplayed()}

    }*/

}
