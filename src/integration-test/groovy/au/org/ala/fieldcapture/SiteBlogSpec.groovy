package au.org.ala.fieldcapture

import pages.EditSiteBlogPage
import pages.NewBlogEntryPage


class SiteBlogSpec extends StubbedCasSpec {

    def setup() {
        useDataSet('dataset_mu')
    }
    def cleanup() {
        logout(browser)
    }

    def "As an admin, I can create/delete MERIT blog"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to EditSiteBlogPage

        then:
        waitFor {at EditSiteBlogPage}
        title() == 'Edit Site Blog'
        def blogSize = blogs().size()

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
        ++blogSize == blogs().size()

        when:
        delBtn()[0].click()

        then:
        waitFor {
            hasBeenReloaded()
        }
        blogs().size() == --blogSize
    }


}
