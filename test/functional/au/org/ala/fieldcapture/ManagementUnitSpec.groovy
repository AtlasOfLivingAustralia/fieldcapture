package au.org.ala.fieldcapture

import pages.ManagementUnitPage
import pages.NewBlogEntryPage
import pages.ProgramBlogPage
import pages.ProgramPage

class ManagementUnitSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

//    def "As a user, I can view a management unit"() {
//        setup:
//        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)
//
//        when:
//        to ManagementUnitPage
//
//        then:
//        waitFor {at ManagementUnitPage}
//
//        when:
//        //grantIds displayed is still false
//        interact {
//            moveToElement(projectLinksTd.first())
//        }
//
//        then:
//
//        // grantIds() == ['RLP-Test-Program-Project-1'] will fail when using phantomjs
//        grantIds().size() ==1
//        projectLinks().size()>=1
//        gotoProgram().size() >= 1
//
//        //Cannot click on invisible element - phantomjs
////        when:
////        gotoProgram()[0].click()
////
////        then:
////        at ProgramPage
//
//
//    }

    def "As an admin, I can view/create/edit/delete a blog for program"(){
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ManagementUnitPage

        then:
        waitFor {at ManagementUnitPage}

        when:
        interact{
            moveToElement(blogContentDiv)
        }

        then:
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
        //Deleting a blog won't jump to edit page
        then:
        waitFor(10d, {adminTabPane().isDisplayed()})

        when:
        interact{
            editMUBlogTab().click()
        }
        then:
        blogModule.blogs().size() == 1
    }

}
