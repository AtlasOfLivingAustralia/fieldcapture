package pages.modules

import geb.Module

class OrganisationAdminTab extends Module{

    static content = {

        editButton{ $('[data-bind="click:editOrganisation"]')}
        deleteButton{ $('[data-bind="click:deleteOrganisation"]')}

        editTab { $('#edit-program-details-tab') }

        configTab(required:false) { $('#config-tab')}
        config(required:false) { $('#config').module OrganisationConfigModule }

        reportingSectionTab(required:false) { $('#reporting-config-tab') }
        reportingSection(required:false) { $('#reporting-config').module OrganisationAdminReportSection }

        documentsTab { $('#edit-documents-tab') }
        // Not bound to a selector because the dialog is attached to the document body and is referenced in the module
        documents { module AdminDocumentsTab }

        adminColumn { $("#admin .flex-column a") }

        permissionAccessTab {$('#mu-permissions-tab')}
        permissionAccess { $('#managementUnit-permissions').module PermissionsAdminModule }

    }

    def viewDocumentsSection() {
        documentsTab.click()
        waitFor { documents.header.displayed }
    }

    def attachDocument() {
        viewDocumentsSection()
        documents.attachDocumentButton.click()
        Thread.sleep(1000) // Wait for the dialog to animate into view
        int count = 0
        while (!(documents.attachDocumentDialog.title.displayed || documents.attachDocumentDialog.displayed) && count < 10) {
            count++
            try {
                documents.attachDocumentButton.click()
            }
            catch (Exception e) {
                e.printStackTrace()
            }
            Thread.sleep(1000) // Wait for the dialog to animate into view
            def logEntries = driver.manage().logs().get("browser").getAll()
            logEntries.each {

                String message = it.toJson().toString()
                if (!message.contains("Google Maps")) {
                    log.error(message)
                    println(message)
                }
            }
            log.error("*****************************In retry loop************************")

        }
    }

    def viewEditSection() {
        waitFor { editTab.displayed }
        editTab.click()
        waitFor { editButton.displayed }
    }

    def openConfig() {
        configTab.click()
        waitFor { config.displayed }
    }

    def viewReportingSection() {
        waitFor{ reportingSectionTab.displayed }
        reportingSectionTab.click()
        waitFor {
            reportingSection.displayed
        }
        reportingSection
    }

}
