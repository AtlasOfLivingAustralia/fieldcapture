package pages

import geb.Module

class ActivityReport extends Module {

    static content = {
        saveButton{ $('') }
        saveAndExitButton{ $('') }
        cancelButton{ $('') }
        markAsFinished{ $('') }
    }

    void save() {
        saveButton.click()
    }

    void saveAndExit() {
        saveAndExitButton.click()
    }

    void cancel() {
        cancelButton.click()
    }
}
