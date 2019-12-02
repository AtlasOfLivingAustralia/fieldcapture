package pages

import geb.Page

class ReportPage extends Page {

    static at = {
        waitFor{ $('#koActivityMainBlock').displayed }
    }

    static content = {
        saveButton { $('#nav-buttons button[data-bind$=save') }
        exitButton { $('#nav-buttons button[data-bind*=exitReport') }
    }

    def save() {
        saveButton.click()
    }

    def exitReport() {
        exitButton.click()
    }
}
