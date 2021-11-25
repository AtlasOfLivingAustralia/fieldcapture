package au.org.ala.fieldcapture

import geb.Browser
import org.openqa.selenium.Cookie
import pages.EntryPage
import pages.LoginPage

/** Contains utilities to login / logout of CAS */
class CasIntegrationTest extends FieldcaptureFunctionalTest {

    def loginAsProjectEditor(Browser browser) {
        login(browser, testConfig.projectEditorUsername, testConfig.projectEditorPassword)
    }

    def loginAsProjectAdmin(Browser browser) {
        login(browser, testConfig.projectAdminUsername, testConfig.projectAdminPassword)
    }

    def loginAsAlaAdmin(Browser browser) {
        login(browser, testConfig.alaAdminUsername, testConfig.alaAdminPassword)
    }

    def login(Browser browser, username, password) {

        browser.to LoginPage, service: getConfig().baseUrl+ EntryPage.url
        browser.page.username = username
        browser.page.password = password
        browser.page.submit()

        browser.at EntryPage

        browser.driver.manage().addCookie(new Cookie("hide-intro", "1"))
    }


}
