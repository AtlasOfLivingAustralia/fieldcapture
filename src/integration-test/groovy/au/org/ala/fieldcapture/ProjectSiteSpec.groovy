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
        sitesTab.click()

        then:
        waitFor {siteTabContents.displayed}

        and:
        waitFor 30, {
            siteTabContents.sitesTableRows.size() == 1
            siteTabContents.markerCount() == 1
            siteTabContents.sitesTableRows[0].name == "Site area for project"

        }

    }

    def "Edit and Update site name and save successfully" (){

        setup:
        loginAsUser('2', browser)

        when:
        to ProjectIndex, 'project_10'
        sitesTab.click()

        then:
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
