package au.org.ala.fieldcapture

import groovy.util.logging.Slf4j
import pages.AdminClearCachePage
import pages.Organisation
import spock.lang.Stepwise

@Stepwise
@Slf4j
class OrganisationDocumentsSpec extends StubbedCasSpec {
    def setup() {
        useDataSet('dataset_crossSite')
        loginAsAlaAdmin(browser)
        to AdminClearCachePage
        clearProgramListCache()
        at AdminClearCachePage // reset at check time
        clearServiceListCache()
    }

    def "documents can be attached to a organisation"() {

        setup:
        String organisationId = 'test_organisation'
        loginAsUser('1', browser)

        when: "Display the admin tab, navigate to the documents section then press the attach button"
        to Organisation, organisationId
        def logEntries = driver.manage().logs().get("browser").getAll()
        logEntries.each {

            String message = it.toJson().toString()
            if (!message.contains("Google Maps")) {
                log.error(message)
                println(message)
            }
        }
        log.error("*****************************At organisation page************************")
        openDocumentDialog()

        def dialog = adminTabContent.documents.attachDocumentDialog
        log.error("*****************************Dialog opened************************")

        then: "The default document type is contract assurance"
        dialog.type == "contractAssurance"
        dialog.publiclyViewable.@disabled

        when:
        dialog.title = "Test doc"
        dialog.attachFile("/testDocument.txt")

        waitFor 20, {
            //dialog.saveButton.displayed
            dialog.saveEnabled()
        }


        dialog.save()
        logEntries = driver.manage().logs().get("browser").getAll()
        logEntries.each {

            String message = it.toJson().toString()
            if (!message.contains("Google Maps")) {
                log.error(message)
                println(message)
            }
        }
        waitFor 30, {
            hasBeenReloaded()
        }

        then: "the file will be uploaded and the page will be reloaded with the new document displayed in the list"
        waitFor(10) {
            adminTabContent.documentsTab.click()
            waitFor {
                adminTabContent.documents.displayed
            }
            adminTabContent.documents.documentSummaryList().size() == 1
        }
        def document = adminTabContent.documents.documents[0]

        and:
        document.name == "Test doc"
    }

    def "read only users see a read only version of the documents tab"() {
        setup:
        String organisationId = 'test_organisation'
        loginAsReadOnlyUser(browser)

        when: "Display the admin tab, navigate to the documents section"
        to Organisation, organisationId

        then: "The admin tab is visible and the user permissions and documents tab are read only"
        adminTab.displayed == true

        when:
        openAdminTab()

        then:
        adminTabContent.adminColumn.size() == 2
        adminTabContent.adminColumn[0].text() == "Permissions"
        adminTabContent.adminColumn[1].text() == "Documents"


        when:
        adminTabContent.viewDocumentsSection()

        then: "The attach button is not displayed"
        adminTabContent.documents.attachDocumentButton.displayed == false

    }

}
