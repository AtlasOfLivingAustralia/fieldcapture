package au.org.ala.fieldcapture

import pages.HomePage
import pages.ManageHelpDocuments
import pages.ViewHelpDocuments
import spock.lang.Stepwise

@Stepwise
class HelpDocumentsSpec extends StubbedCasSpec {

    def setupSpec() {
        useDataSet('dataset1')
    }

    def "Only admins can edit help documents"() {
        setup:
        loginAsGrantManager(browser)

        when:
        via ManageHelpDocuments

        then:
        at HomePage

        when:
        loginAsReadOnlyUser(browser)
        via ManageHelpDocuments

        then:
        at HomePage

        when:
        loginAsUser('1', browser)
        via ManageHelpDocuments

        then:
        at HomePage

        when:
        loginAsMeritAdmin(browser)
        to ManageHelpDocuments

        then:
        at ManageHelpDocuments
    }

    def "Admin can add a new category, then attach a document in that category"() {
        setup:
        loginAsMeritAdmin(browser)
        String newCategory = "New Category"

        when:
        to ManageHelpDocuments
        addCategory(newCategory)

        then:
        waitFor {categorySelect == newCategory}

        when:
        openDocumentDialog()
        def dialog = attachDocumentDialog
        dialog.title = "Test doc"
        dialog.attachFile("/testDocument.txt")

        waitFor 20, {
            //dialog.saveButton.displayed
            dialog.saveEnabled()
        }


        dialog.save()

        then:
        waitFor{hasBeenReloaded()}
        documents.size() == 1
        documents[0].title() == "Test doc"

        when:
        to ViewHelpDocuments, category:newCategory

        then:
        documents.size() == 1


    }
}
