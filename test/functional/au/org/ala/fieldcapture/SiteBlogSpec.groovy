package au.org.ala.fieldcapture

import pages.EditSiteBlogPage
import pages.NewBlogEntryPage


class SiteBlogSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }

    def "As an admin, I can create/delete MERIT blog"() {
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to EditSiteBlogPage

        then:
        waitFor {at EditSiteBlogPage}
        title() == 'Edit Site Blog'

        when:
        newBlogBtn.click()

        then:
        waitFor {at NewBlogEntryPage}

        when:
        blogDetails.title = 'Testing blog of site'
        blogDetails.description = 'Description of blog'
        submit()

        then:
        waitFor {at EditSiteBlogPage}

        when:
        delBtn()[0].click()

        then:
        waitFor {at EditSiteBlogPage}

    }

//    def "As an admin, I can create/delete a blog of site"(){
//        setup:
//        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)
//
//        when:
//        to NewBlogEntryPage
//
//        then:
//        waitFor {at NewBlogEntryPage}
//
//        when:
//        blogDetails.title = 'Testing blog of site'
//        blogDetails.description = 'Description of blog'
//        submit()
//
//        then:
//        waitFor {at ProjectBlogPage}
//        blogs().size() ==2
//
//        ['BlogTest','Testing blog of site'].any{blogTitles().contains(it)}
//
//        //Enter edit mode again
//        when:
//        gotoBlogEditBtn.click()
//
//        then:
//        editBlogPanelHeader().contains('Edit Project Blog')
//        deleteBlogBtn.size() == 2
//
//        when:
//        deleteBlogBtn[1].click()
//
//        then:
//        waitFor {gotoBlogEditBtn != null }
//        blogs().size() == 1
//    }
//
//    def "As an admin, I can enter edit mode "(){
//        setup:
//        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)
//
//        when:
//        to ProjectBlogPage
//
//        then:
//        waitFor {at ProjectBlogPage}
//        blogs().size == 1
//
//        when:
//        gotoBlogEditBtn.click()
//
//        then:
//        editBlogPanelHeader().contains('Edit Project Blog')
//        editBlogBtn.size() == 1
//
//        when:
//        editBlogBtn.click()
//
//        then:
//        waitFor {at NewBlogEntryPage}
//
//        //Do not need to test 'save', rely on test case of 'create blog'
//
//        when:
//        cancelBtn.click()
//
//        then:
//        waitFor {at ProjectBlogPage}
//    }




}
