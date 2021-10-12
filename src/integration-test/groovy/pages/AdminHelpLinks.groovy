package pages

import geb.Module


class EditLinkRow extends Module {
    static content = {
        type { $('select[data-bind*="value:type"]') }
        title { $('input[data-bind*="value:name"]') }
        url { $('input[data-bind*="value:externalUrl"]') }
    }
}
class AdminHelpLinks extends ReloadablePage {

    static url = 'admin/editHelpLinks'
    static at = {
        title.startsWith("Edit Help Links")
    }

    static content = {
        helpLinkRows { $('#help-resources .help-resource').moduleList(EditLinkRow) }
    }

    void save() {
        $('#save').click()
        Thread.sleep(2000)
    }
}
