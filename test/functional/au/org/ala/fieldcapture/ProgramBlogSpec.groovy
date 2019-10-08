package au.org.ala.fieldcapture

import pages.NewBlogEntryPage
import pages.NewProgramBlogPage
import pages.ProgramBlogPage

class ProgramBlogSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def "As a admin, I can view/edit/create/delete blogs in a given program "() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ProgramBlogPage

        then:
        waitFor {at ProgramBlogPage}
        blogModule.blogs().size() ==1
        blogModule.blogTitles() == ['BlogTest']

        when:
        blogModule.newBlogBtn.click()

        then:
        waitFor {at NewBlogEntryPage}

        when:
        blogDetails.title = 'Testing blog of program'
        blogDetails.description = 'Description of blog'
        submit()

        then:
        waitFor {at ProgramBlogPage}
        blogModule.blogs().size() ==2

        ['BlogTest','Testing blog of program'].any{blogModule.blogTitles().contains(it)}

        //Enter edit mode again
        when:
        blogModule.gotoBlogEditBtn.click()

        then:
        blogModule.editBlogPanelTitle() == 'Edit Blog'
        blogModule.deleteBlogBtn.size() == 2

        when:
        interact{
            blogModule.deleteBlogBtn[1].click()
        }
        //bug in program admin page.
        //Deleting a blog won't jump to edit page

        then:
        waitFor {adminTabPane().isDisplayed()}

        when:
        interact{
            editProgramBlogTab().click()
        }
        then:
        blogModule.blogs().size() == 1

    }



}
