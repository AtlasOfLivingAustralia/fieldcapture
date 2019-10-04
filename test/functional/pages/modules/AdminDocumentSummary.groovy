package pages.modules

import geb.Module


class AdminDocumentSummary extends Module {

    static content = {
        deleteButton { $('[data-bind*=deleteDocument]')}
        editButton { $('[data-bind*=editDocumentMetadata]') }
        icon { $('.media-object') }
        name { $('.media-heading').text() }
        attribution { $('span[data-bind*=attribution]').text()}
    }

}
