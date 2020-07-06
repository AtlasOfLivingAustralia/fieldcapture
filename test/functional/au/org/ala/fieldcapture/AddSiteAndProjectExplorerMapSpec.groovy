package au.org.ala.fieldcapture

import pages.ProjectIndex

class AddSiteAndProjectExplorerMapSpec extends StubbedCasSpec {
    def projectId = 'project_10'

    void setup() {
        useDataSet('data_static_score')
    }

    void cleanup() {
        logout(browser)
    }
    def"I can view Project Dashboard tab as FC_ADMIN "() {
        setup: "log in as userId=1 who is a program admin for the program with programId=test_program"
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
      //  waitFor {addSites.name.displayed}
        addSites.name = "Test 1"
        addSites.description = "test 1 description"

        addSites.defineExtent[0].find ("option").find {it.text() == "known shape"}.click()
        addSites.chooseLayer[0].find("option").find {it.text() == "Australian states"}.click()
        addSites.chooseShape[0].find("option").find {it.text() == "New South Wales"}.click()
        addsites.savechanges.click()

        then:
         at ProjectIndex
        and:
        waitFor {sitesTab.displayed}
        then:
        sitesTab.click()
        waitFor {siteTable}
    }


}
