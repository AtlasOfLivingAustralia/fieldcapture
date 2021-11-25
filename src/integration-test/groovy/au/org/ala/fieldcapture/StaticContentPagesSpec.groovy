package au.org.ala.fieldcapture

import pages.AboutPage
import pages.AdminStaticPages
import pages.AdminTools
import pages.ContactsPage
import pages.EditSettingText
import pages.HelpPage
import spock.lang.Stepwise

/** Tests for the about/help/contacts pages */
@Stepwise
class StaticContentPagesSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet("dataset1")

        // Static content is cached so we need to clear the metadata cache to ensure
        // we don't get interference from other tests
        loginAsAlaAdmin(browser)
        to AdminTools
        clearMetadata()

        logout(browser)
    }

    def "The about page displays content from the database and is accessible to unauthenticated users"() {
        when:
        to AboutPage

        then: "The correct content is displayed"
        pageContent.heading.text() == "About"
        pageContent.staticContent.text() == "This is about content"

        and: "The edit button is not displayed"
        pageContent.editButton.displayed == false

    }

    def "The help page displays content from the database and is accessible to unauthenticated users"() {
        when:
        to HelpPage

        then: "The correct content is displayed"
        pageContent.heading.text() == "Help"
        pageContent.staticContent.text() == "This is help content"

        and: "The edit button is not displayed"
        pageContent.editButton.displayed == false

    }

    def "The contacts page displays content from the database and is accessible to unauthenticated users"() {
        when:
        to ContactsPage

        then: "The correct content is displayed"
        pageContent.heading.text() == "Contacts"
        pageContent.staticContent.text() == "This is contacts content"

        and: "The edit button is not displayed"
        pageContent.editButton.displayed == false

    }

    def "An fc admin can edit the content displayed in static content pages"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to ContactsPage

        then: "The correct content is displayed"
        pageContent.heading.text() == "Contacts Edit" // This is because the edit button label is inside the heading tag
        pageContent.staticContent.text() == "This is contacts content"

        and: "The edit button is displayed"
        pageContent.editButton.displayed

        when:
        pageContent.editButton.click()

        then:
        at EditSettingText

        and:
        contentEditor.value() == "This is contacts content"

        when:
        contentEditor.value("This is the new contacts content")
        saveButton.click()

        then:
        at ContactsPage

        and:
        pageContent.staticContent.text() == "This is the new contacts content"

    }

    def "A MERIT administrator can edit static content via the administration pages"() {
        setup:
        loginAsMeritAdmin(browser)

        when:
        to EditSettingText, 'about'

        then:
        contentEditor.value() == "This is about content"

        when:
        contentEditor.value("This is the new about content")
        saveButton.click()

        then:
        at AdminStaticPages

        when:
        to AboutPage

        then:
        pageContent.staticContent.text() == "This is the new about content"

    }
}
