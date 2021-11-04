package au.org.ala.fieldcapture

import pages.EditSitePage
import pages.ProjectIndex
import pages.SiteIndexPage

class ProjectSiteSpec extends StubbedCasSpec {

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }

    def"I can view sites for a project as a project admin"() {
        setup: "User 2 is an editor for project_10"
        loginAsUser('2', browser)

        when:
        to ProjectIndex, 'project_10'

        then:
        overviewTab.click()
        sitesTab.click()
        waitFor {siteTabContents.displayed}
        def tableContent = tableContents
        and:
        waitFor 30, {
            tableContent[2].siteName.text() == "Site area for project"
            siteTabContents.markers.size() == 1
        }

    }

    def "Edit and Update site name and save successfully" (){

        setup:
        loginAsUser('2', browser)

        when:
        to ProjectIndex, 'project_10'

        then:
        overviewTab.click()
        sitesTab.click()
        waitFor {siteTabContents.displayed}

        when:
        editMap.click()

        then:
        waitFor {at EditSitePage}

        when:
        edit.name = "Name Change"
        edit.saveBtn.click()

        then:
        waitFor 60,{at SiteIndexPage}

        and:
        waitFor { name.text() == "Site: Name Change" }
    }
}
