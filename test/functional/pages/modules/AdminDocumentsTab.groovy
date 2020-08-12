package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class AdminDocumentsTab extends Module {
    static content = {

        attachDocumentButton { $('#doAttach') }
        documentTypeFilter { $('[data-bind*=documentFilter]') }
        documents {
            $('#adminDocumentList [data-bind*=documentEditTemplate]').moduleList(AdminDocumentSummary)
        }

        attachDocumentDialog { module DocumentDialog }
    }

    /** This method is used to check for a page refresh and race conditions will often result in StaleElementReferenceExceptions */
    def documentSummaryList() {
        List documentSummary = []
        try {
            documentSummary = documents
        }
        catch (StaleElementReferenceException e) {}
        documentSummary
    }

}
