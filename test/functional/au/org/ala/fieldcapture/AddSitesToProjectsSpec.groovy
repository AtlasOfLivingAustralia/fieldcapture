package au.org.ala.fieldcapture

import pages.ProjectPage
import pages.CreateSitesForProjects

class AddSitesToProjectsSpec extends StubbedCasSpec {

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }

    def"I can Add Sites in the projects as FC_ADMIN "() {
        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to ProjectPage

        and:
        clickAddSiteButton()

        then:
        waitFor {at CreateSitesForProjects}

        when:
        site.name = "Test Map"
        site.description = "Test Map Description"

        $("select", name:"extentSource").value("point")

        site.latitude = "-35.85075512398081"
        site.longitude = "146.30460166931152"
        site.save()
        Thread.sleep(11000)


        then:
        at ProjectPage

        when:
        overviewTab.click()
        siteTab.click()

        then:
        waitFor {siteTabContents.displayed}
        def tableContent = tableContents
        and:
        tableContent[2].siteName.text() == "Test Map"
        mapMarker.size() == 1
    }
}
