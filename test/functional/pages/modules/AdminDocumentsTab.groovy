package pages.modules

import geb.Module
import pages.DocumentDialog
import pages.DocumentSummary

class AdminDocumentsTab extends Module {
    static content = {

        attachDocumentButton { $('#doAttach') }

        documents {
            $('#adminDocumentList .media').collect {
                module DocumentSummary, it
            }
        }

        attachDocumentDialog { module DocumentDialog, $('#attachDocument') }
    }
}
