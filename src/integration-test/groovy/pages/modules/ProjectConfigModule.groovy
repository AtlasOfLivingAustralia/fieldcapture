package pages.modules

import geb.Module

class ProjectConfigModule extends Module {

    static content = {
        saveButton { $('button.btn-success') }

        config { $('textarea') }
    }

    void save() {
        saveButton.click()
    }
}
