package au.org.ala.fieldcapture

import pages.CreateSitesForProjects
import pages.ProjectPage

class AddProjectSiteMapSpec extends StubbedCasSpec {
    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }

    def"I can Add Sites as a known shape in the projects as FC_ADMIN "() {
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

        $("select", name:"extentSource").value("pid")
        $("select", name:"chooseLayer").value("cl22")

        //site.defineExtent.value("cl22")
        Thread.sleep(5000)
        site.chooseShape.chooseShape.size() == 1
        HashSet hashSet = site.chooseShape.chooseShape[0].collect {it.value()}
        hashSet.size() == 12
        Thread.sleep(5000)
        $("select", name:"chooseShape").click()

        $("option", value:"3742610").click()

        site.save()
        Thread.sleep(50000)


        then:
        at ProjectPage

        when:
        overviewTab.click()
        siteTab.click()

        then:
        waitFor {siteTabContents.displayed}
        Thread.sleep(20000)
        waitFor{tableContents.displayed}
        def tableContent = tableContents.collect{it.text()}
        and:
        tableContent[2] == "Test Map"

    }
}

