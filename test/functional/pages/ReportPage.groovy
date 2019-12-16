package pages

import geb.Page
import geb.navigator.Navigator

class ReportPage extends Page {

    static at = {
        waitFor{ $('#koActivityMainBlock').displayed }
    }

    static content = {
        saveButton { $('#nav-buttons button[data-bind$=save') }
        exitButton { $('#nav-buttons button[data-bind*=exitReport') }
    }

    def field(String name) {
        Navigator fields = $("input[data-bind*="+name+"]")
        if (fields.size() == 0) {
            fields = $("select[data-bind*="+name+"]")
        }
        if (fields.size() == 0) {
            fields = $("[data-bind*="+name+"]")
        }
        fields
    }

    def markAsComplete() {
        $("[data-bind*=\"markedAsFinished\"]").value(true)
    }

    def save() {
        saveButton.click()
        waitFor {
            $('.blockOverlay').displayed
        }
        waitFor {
            !($('blockOverlay').displayed)
        }
    }

    def exitReport() {
        exitButton.click()
    }
}
