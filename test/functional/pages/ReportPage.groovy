package pages

import geb.Page

class ReportPage extends Page {

    static at = {
        waitFor{ $('#koActivityMainBlock').displayed }
    }

    static content = {

        saveButton { $('#nav-buttons button[data-bind$=saveAndExit') }
        saveAndExitButton { $('#nav-buttons button[data-bind*=saveAndExit') }
        cancelButton { $('#nav-buttons button[data-bind*=cancel]') }
    }

    def save() {
        saveButton.click()
    }

    def saveAndExit() {
        saveAndExitButton.click()
    }

    def cancel() {
        cancelButton.click()
    }

}
