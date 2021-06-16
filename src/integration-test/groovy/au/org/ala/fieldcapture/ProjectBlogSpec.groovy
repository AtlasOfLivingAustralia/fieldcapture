package au.org.ala.fieldcapture

import pages.NewBlogEntryPage
import pages.ProjectBlogPage

class ProjectBlogSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }
    def cleanup() {
        logout(browser)
    }

    def "As a user, I can view blogs/create/delete in a given project "() {
        setup:
        login([userId:'1', role:"ROLE_USER", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ProjectBlogPage

        and:
        //force to overview tab
        overviewBtn().click()

        then:
        waitFor {at ProjectBlogPage}
        blogModule.blogs().size() ==1
        blogModule.blogTitles() == ['BlogTest']

        when:
        blogModule.newBlogBtn.click()

        then:
        waitFor {at NewBlogEntryPage}

        when:
        blogDetails.title = 'uploading photo to blog'
        blogDetails.description = 'uploading photo to blog'
        File toAttach = new File(getClass().getResource('/testImage.png').toURI())
        blogDetails.uploadingFile =toAttach.absolutePath

        then:
        waitFor {blogDetails.privacy.displayed}

        when:
        blogDetails.privacy = true
        submit()

        then:
        waitFor {at ProjectBlogPage}
        blogModule.blogs().size() ==2
        blogModule.images()[0].endsWith('testImage.png')

        ['BlogTest','uploading photo to blog'].any{blogModule.blogTitles().contains(it)}

        //Enter edit mode again
        when:
        blogModule.gotoBlogEditBtn.click()

        then:
        waitFor {blogModule.deleteBlogBtn.size() == 2}
        blogModule.editBlogPanelTitle() == 'Edit Project Blog'


        when:
        blogModule.deleteBlogBtn[0].click()

        then:
        waitFor {blogModule.deleteBlogBtn.size() == 1 && editProjectBlogPane().isDisplayed()}

        when:
        overviewBtn().click()
        waitFor {at ProjectBlogPage}
        blogModule.newBlogBtn.click()
        waitFor {at NewBlogEntryPage}
        blogDetails.type = 'Project Stories'
        blogDetails.title = 'Project story test'
        blogDetails.description = 'Project story content'
        toAttach = new File(getClass().getResource('/testImage.png').toURI())
        blogDetails.uploadingFile = toAttach.absolutePath
        waitFor {blogDetails.privacy.displayed}
        blogDetails.privacy = true
        submit()

        then:
        waitFor {at ProjectBlogPage}
        blogModule.blogs().size() == 2


    }

    def "As an admin, I can enter edit mode "(){
        setup:
        login([userId:'1', role:"ROLE_ADMIN", email:'user@nowhere.com', firstName: "MERIT", lastName:'User'], browser)

        when:
        to ProjectBlogPage

        then:
        waitFor {at ProjectBlogPage}

        and:
        //Force to nav to overview page
        overviewBtn().click()
        blogModule.blogs().size == 1


        when:
        blogModule.gotoBlogEditBtn.click()

        then:
        waitFor {
            blogModule.editBlogPanelTitle() == 'Edit Project Blog'
            blogModule.editBlogBtn.size() == 1
        }

        when:
        blogModule.editBlogBtn.click()

        then:
        waitFor {at NewBlogEntryPage}

        //Do not need to test 'save', rely on test case of 'create blog'

        when:
        File outputFile = File.createTempFile('test', '.png')
        String filename = outputFile.absolutePath
        blogDetails.uploadingFile =(filename)
        saveBtn.click()

        then:
        waitFor {at ProjectBlogPage}
    }
}
