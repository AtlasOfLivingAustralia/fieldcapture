package pages.modules

import geb.Module

class DocumentsTab extends Module {

    static content = {
        documents {
            $('#overviewDocumentList .docs-table tbody tr').moduleList(DocumentsTabDocument)
        }
    }
}
