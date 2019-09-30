package pages.modules

import geb.Module
import pages.modules.DocumentSummary

class AdminDocumentsTab extends Module {
    static content = {

        attachDocumentButton { $('#doAttach') }

        documents {
            $('#adminDocumentList [data-bind*=documentEditTemplate]').collect {
                module DocumentSummary
            }
        }

        attachDocumentDialog { module DocumentDialog }
    }

}
