package pages.modules

import geb.Module

class OrganisationConfigModule extends Module {

    static content = {
        saveButton { $('button.btn-success') }
        config { $('#textConfig') }
    }

    void save() {
        saveButton.click()
    }
}
