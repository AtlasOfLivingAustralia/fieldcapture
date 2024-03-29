package pages.modules

import geb.Module

class ManagementUnitAdminTab extends Module {

    static content = {
        documentsTab { $('#edit-documents-tab') }
        documents { module AdminDocumentsTab }

        reportingSectionTab(required:false) { $('[href="#reporting"]') }
        reportingSection(required:false) { $('#reporting').module ManagementUnitAdminReportSection }
        adminColumn { $("#admin .flex-column a") }

        permissionAccessTab {$('#mu-permissions-tab')}
        permissionAccess { $('#managementUnit-permissions').module PermissionsAdminModule }
    }

    def attachDocument() {
        documentsTab.click()
        waitFor { documents.displayed }
        documents.attachDocumentButton.click()
        documents.attachDocumentDialog
    }

    def viewReportingSection() {
        reportingSectionTab.click()
        waitFor {
            reportingSection.displayed
        }
        reportingSection
    }

    def openPermissionAccess() {
        permissionAccessTab.click()
        waitFor { permissionAccessTab.displayed }
    }
}
