package au.org.ala.fieldcapture

import geb.Browser
import geb.spock.GebReportingSpec
import org.openqa.selenium.Cookie
import pages.AddActivityPage
import pages.EntryPage
import pages.LoginPage
import pages.ProjectIndex
import spock.lang.Stepwise

@Stepwise
public class AddActivitySpec extends GebReportingSpec {

    def grailsApplication

    def "No permission to add an activity"() {

        logout(browser)
        login(browser, "fc-te@outlook.com", "testing!")

        when: "go to new activity page"
        def projectId = "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"
        via AddActivityPage, projectId:projectId

        then:
        at ProjectIndex
    }

    def "Add an activity"() {

        logout(browser)
        login(browser, "fc-ta@outlook.com", "testing!")

        when: "go to new activity page"
        def projectId = "cb5497a9-0f36-4fef-9f6a-9ea832c5b68c"
        to AddActivityPage, projectId:projectId
        type = 'Revegetation'
        description = 'Test activity'
        setDate(page.plannedStartDate,'01/01/2014')
        setDate(page.plannedEndDate,'30/06/2014')
        submit()

        then:
        waitFor 10, {at AddActivityPage}  // We didn't include a returnTo parameter so we stay on the page.

    }

    def "View the new activity"() {

    }

    def login(Browser browser, username, password) {

        browser.to LoginPage, service: getConfig().baseUrl+EntryPage.url
        browser.page.username = username
        browser.page.password = password
        browser.page.submit()

        browser.at EntryPage

        browser.driver.manage().addCookie(new Cookie("hide-intro", "1"))
    }

    def logout(Browser browser) {
        browser.go 'https://auth.ala.org.au/cas/logout'

    }

}

