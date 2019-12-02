package au.org.ala.fieldcapture

import pages.ManagementUnitPage
import pages.NewBlogEntryPage
import pages.ProgramBlogPage
import pages.ProgramPage

class ManagementUnitSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def cleanup() {
        logout(browser)
    }

    def "As a user, I can view a management unit"() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

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

        // grantIds() == ['RLP-Test-Program-Project-1'] will fail when using phantomjs
        grantIds().size() ==1
        projectLinks().size()>=1
        gotoProgram().size() >= 1
    }

    def "As an admin, I edit a management unit"() {
        setup:
        login([userId: '1', role: "ROLE_ADMIN", email: 'user@nowhere.com', firstName: "MERIT", lastName: 'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor { at ManagementUnitPage }

        when:
        interact{
            adminTab.click()
        }

        then:
        waitFor { $('div#admin').isDisplayed() }

        when:
        interact{
            $('[href="#edit-managementUnit-details"]').click()
        }

        then:
        waitFor {editManagementUnitButton.isDisplayed()}

        when:
        interact{
            $('a.admin-action').click()
        }

        then:
        waitFor {$('form.validationEngineContainer').isDisplayed()}
        //$('input#serviceProviderName').val() == "Test Org"
        currentServiceProviderName() == "Test Org"

        when:
        interact{
            $('button#resetServiceProvider').click()
        }

        then:
        currentServiceProviderName() == ""

        when:
        interact{
            $('button#editServiceProvider').click()
        }

        then:
        $('input#organisationSelection').isDisplayed()

    }


}
