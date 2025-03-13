package au.org.ala.fieldcapture

import pages.AdminClearCachePage
import pages.AdminHelpLinks
import pages.AdminTools
import pages.HomePage

class HelpLinksSpec extends StubbedCasSpec {

    def setup (){
        useDataSet("data_static_score")
    }
    def cleanup() {
        logout(browser)
    }

    def "The help links are displayed on the homepage"() {
        setup: "Login as a MERIT administrator who is allowed to clear cache"
        loginAsAlaAdmin(browser)

        when: "Clear the help links cache as other specs will have run caching zero links"
        to AdminClearCachePage
        clearHomePageDocuments()
        logout(browser)

        then:
        waitFor 30,{ at HomePage}
        helpLinks.size() == 6
        for (int i=0; i<6; i++) {
            helpLinks[i].title == "Link $i"
            helpLinks[i].url == "https://ala.org.au/$i"
        }
    }

    def "A MERIT administrator can edit help links"() {
        setup: "Login as MERIT administrator who is allowed to clear cache"
        loginAsMeritAdmin(browser)

        when: "A help link is edited"
        to AdminHelpLinks
        then:
        waitFor { at AdminHelpLinks }

        when:
        helpLinkRows[0].title = "Edited Link 1"
        helpLinkRows[0].url  = "https://ala.org.au/edited"
        save()
        to HomePage

        then:
        waitFor 30,{ at HomePage}
        helpLinks.size() == 6

        waitFor 30,  {
            to HomePage
            waitFor 30,{ at HomePage }
            helpLinks[0].title == "Edited Link 1"
            helpLinks[0].url  == "https://ala.org.au/edited"
        }

        for (int i=1; i<6; i++) {
            helpLinks[i].title == "Link $i"
            helpLinks[i].url == "https://ala.org.au/$i"
        }
    }
}
