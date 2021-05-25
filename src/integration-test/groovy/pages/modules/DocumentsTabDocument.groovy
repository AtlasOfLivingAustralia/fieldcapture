package pages.modules

import geb.Module

class DocumentsTabDocument extends Module {

    static content = {
        name(required:false) { $('span[data-bind*=name]').text() }
        noDocumentsMessage(required:false) { $('td.dataTables_empty') }
    }
}
