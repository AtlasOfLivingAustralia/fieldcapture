package au.org.ala.fieldcapture

import pages.ProjectIndex

class AddProjectSiteMapSpec extends StubbedCasSpec {
    def projectId = 'project_10'

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }
    // Adding site when there no sites associate with projects
    def"I can Add Sites in the projects as FC_ADMIN "() {
        setup:
        login([userId: '2', role: "ROLE_ADMIN", email: 'admin@nowhere.com', firstName: "MERIT", lastName: 'ALA_ADMIN'], browser)

        when:
        to ProjectIndex, projectId

        then:
        at ProjectIndex

        and:
        waitFor {sitesTab.displayed}
        then:
        sitesTab.click()

        and:
        waitFor {sites.displayed}

        when:
        sites.firstSiteAdded.click()

        then:
        waitFor {addSites.displayed}

        when:
        addSites.name = "Test 1"
        addSites.description = "test 1 description"

        waitFor { addSites.defineExtent.displayed}
        addSites.defineExtent.click()
        addSites.defineExtent.find("option").find { it.value() == "pid"}.click()

        waitFor {addSites.chooseLayer.displayed}
        addSites.chooseLayer.click()
        addSites.chooseLayer.find("option").find {it.value() == "cl22"}.click()

        waitFor {addSites.chooseShape.displayed}
        addSites.chooseShape.click()
        addSites.chooseShape.find("option").find {it.value() == "3742605"}.click()
        addSites.save()
        waitFor {
            hasBeenReloaded()
        }

        then:
        waitFor(500) {sitesTab.displayed}
        sitesTab.click()
     //   waitFor(20) {sites.displayed}


        and:
        waitFor(500) {sites.displayed}
        waitFor(500) {sites.siteName.displayed}
        sites.siteName.text() == "Test 1"
        waitFor(50) {sites.lastupdated.displayed}
        sites.lastupdated.text() =="07-07-2020"
    }

}
