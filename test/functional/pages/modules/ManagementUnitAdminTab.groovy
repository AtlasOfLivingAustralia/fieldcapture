package pages.modules

import geb.Module

class ManagementUnitAdminTab extends Module {

    static content = {
        documentsTab { $('#edit-documents-tab') }
        documents { module AdminDocumentsTab }
    }

    def attachDocument() {
        documentsTab.click()
        waitFor { documents.displayed }
        documents.attachDocumentButton.click()
        documents.attachDocumentDialog
    }
}
