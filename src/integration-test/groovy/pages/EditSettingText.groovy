package pages

import geb.Page
import pages.modules.StaticContent

class EditSettingText extends Page {
    static url = '/admin/editSettingText' // requires a classifier in the URL (about/help/contacts)
    static at = { title.startsWith("Static pages - Edit") }

    static content = {
        backButton { $('#back') }
        heading { $('h3').text() }
        contentEditor { $('#textValue')}
        preview { $('#notes-preview') }
        saveButton { $('button.btn-primary') }
        cancelButton { $('button.btn-danger') }
    }
}
