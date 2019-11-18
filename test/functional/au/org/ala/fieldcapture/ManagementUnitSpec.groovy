package au.org.ala.fieldcapture

import pages.ManagementUnitPage
import pages.NewBlogEntryPage
import pages.ProgramBlogPage
import pages.ProgramPage
import pages.AdminReportsPage

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

    def "As an admin, I can view/create/edit/delete a blog for program"(){
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}

        when:
        blogTab.click()

        then:
        waitFor {blogModule.displayed}
        blogModule.blogs().size() ==1
        blogModule.blogTitles() == ['BlogTest']

        when:
        blogModule.newBlogBtn.click()

        then:
        waitFor {at NewBlogEntryPage}

        when:
        blogDetails.title = 'Testing blog of management unit'
        blogDetails.description = 'Description of blog'
        submit()

        then:
        waitFor {at ManagementUnitPage}
        blogModule.blogs().size() ==2

        ['BlogTest','Testing blog of management unit'].any{blogModule.blogTitles().contains(it)}

        //Enter edit mode again
        when:
        blogModule.gotoBlogEditBtn.click()

        then:
        waitFor{editManagementUnitBlogPane().isDisplayed()}
        blogModule.editBlogPanelTitle() == 'Edit Blog'
        blogModule.deleteBlogBtn.size() == 2

        when:
        interact{
            blogModule.deleteBlogBtn[1].click()
        }
        //bug in program admin page.
        // When the page is reloaded the admin tab will be displayed but it will revert to the
        // "Edit" section, we can use that to detect the page has reloaded
        then:
        waitFor(10d, {editManagementUnitButton.displayed})

        when:
        interact{
            editMUBlogTab().click()
        }
        then:
        blogModule.blogs().size() == 1
    }

    def "As an site admin, I can get report periods and request to generate reports"(){
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

    }

}
