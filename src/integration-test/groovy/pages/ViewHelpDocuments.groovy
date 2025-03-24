package pages

import geb.Page
import pages.modules.DocumentsTabDocument

class ViewHelpDocuments extends Page {
    static url = 'home/helpDocuments?category='

    static at = { title == 'Help documents | MERIT' }

    static content = {
        documents {$('.docs-table tbody tr').moduleList(DocumentsTabDocument)}
    }
}
