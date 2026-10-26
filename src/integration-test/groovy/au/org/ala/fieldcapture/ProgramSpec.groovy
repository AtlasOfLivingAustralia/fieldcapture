package au.org.ala.fieldcapture

import pages.AdminClearCachePage
import pages.ProgramPage

class ProgramSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset_mu')

        loginAsAlaAdmin(browser)
        to AdminClearCachePage
        clearInvestmentPriorityCategoriesCache()
    }

    def cleanup() {
        logout(browser)
    }

    def "As an admin user, I can view a RLP program "() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProgramPage, 'test_program'

        and:
        //force to overview tab
        overviewTab().click()

        then:
        waitFor(10d,{at ProgramPage})

        when:
        interact {
            moveToElement(grantIdsTable.last())
        }
        then:

        projectNames().size() == 4
        grantIds().containsAll(['RLP-Test-Program-Project-1','RLP-Test-Program-Project-2','RLP-Test-Program-Project-3'])
        grantIds().size()==4

    }

    def "The Program Admin tab supports editing the program outcomes"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ProgramPage, 'test_program'

        and:
        openProgramOutcomes()

        then:
        adminTabContent.programOutcomes.outcomeRows.size() == 3
        adminTabContent.programOutcomes.outcomeRows*.outcome == ['outcome 1', 'outcome 2', 'outcome 3']
        adminTabContent.programOutcomes.outcomeRows.collect{it.type}.collect{it.value()} == ['primary', '', 'secondary']
        adminTabContent.programOutcomes.outcomeRows*.shortDescription == ['o1', 'o2', 'o3']


    }

}
