package au.org.ala.fieldcapture

import pages.ProjectIndex
import pages.RlpProjectPage

class RisksSpec extends StubbedCasSpec {
    def setupSpec() {
        useDataSet('dataset3')
    }

    def cleanup() {
        logout(browser)
    }

    def "The risks and threats appears on the activity tab on the original MERIT template"() {
        setup:
        String projectId = 'p1'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when: "Open the project page, navigate to the activities tab"
        to ProjectIndex, projectId
        waitFor { at ProjectIndex }
        openActivitiesTab()

        then:
        plansAndReports.risksAndThreats.displayed

        when:
        openAdminTab()

        then:
        !admin.risksAndThreatsTab.displayed

        when:
        openActivitiesTab()
        plansAndReports.risksAndThreats.overallRisk = 'Low'
        Map data = [type:'Timeliness of project approvals processes',
                    description:'Risk 1 description',
                    likelihood: 'Likely',
                    consequence: 'Minor',
                    control:'Risk 1 control',
                    residualRisk: 'Low'
            ]
        plansAndReports.risksAndThreats.setRowData(0, data)
        plansAndReports.risksAndThreats.save()

        then:
        waitFor { hasBeenReloaded() }
        plansAndReports.risksAndThreats.overallRisk == 'Low'
        plansAndReports.risksAndThreats.getRowData(0) == data

        when:
        at ProjectIndex // reset at check time.
        plansAndReports.risksAndThreats.overallRisk == 'Medium'
        plansAndReports.risksAndThreats.cancel()

        then:
        waitFor { hasBeenReloaded() }
        plansAndReports.risksAndThreats.overallRisk == 'Low'

    }

    def "The risks and threats tab appears on the admin tab for RLP projects"() {
        setup:
        String projectId = 'p2'
        login([userId: '1', role: "ROLE_USER", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'USER'], browser)

        when: "Open the project page, navigate to the admin tab"
        to RlpProjectPage, projectId
        waitFor { at RlpProjectPage }
        openAdminTab()

        adminContent.openRisksAndThreats()

        then:
        adminContent.risksAndThreats.displayed

        when:
        adminContent.risksAndThreats.overallRisk = 'Low'
        Map data = [type:'Timeliness of project approvals processes',
                    description:'Risk 1 description',
                    likelihood: 'Likely',
                    consequence: 'Minor',
                    control:'Risk 1 control',
                    residualRisk: 'Low'
        ]
        adminContent.risksAndThreats.setRowData(0, data)
        adminContent.risksAndThreats.save()

        then:
        waitFor { hasBeenReloaded() }
        adminContent.risksAndThreats.overallRisk == 'Low'
        adminContent.risksAndThreats.getRowData(0) == data

        when:
        at RlpProjectPage // reset at check time.
        adminContent.risksAndThreats.overallRisk == 'Medium'
        adminContent.risksAndThreats.cancel()

        then:
        waitFor { hasBeenReloaded() }
        adminContent.risksAndThreats.overallRisk == 'Low'
    }

}
