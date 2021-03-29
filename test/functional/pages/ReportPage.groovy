package pages

import geb.Page
import geb.module.Checkbox
import geb.navigator.Navigator
import pages.modules.ReportContentModule
import pages.modules.TimeoutModal

class ReportPage extends Page {

    static at = {
        waitFor{ $('#koActivityMainBlock').displayed }
    }

    static content = {
        reportContent {module ReportContentModule }
        saveButton { $('#nav-buttons button[data-bind$=save') }
        exitButton { $('#nav-buttons button[data-bind*=exitReport') }
        timeoutModal(required: false) { $('div.bootbox.modal').module TimeoutModal }
        unsavedEdits(required: false) { $('div.bootbox') }
        editAnyway (required: false) { $(".alert .btn")}
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

    /** Required or it stops webdriver from clicking checkboxes */
    void hideFloatingToolbar() {
        js.exec("\$('#floating-save').css('display', 'none');")
    }

    /** Required or it stops webdriver from clicking checkboxes */
    void restoreFloatingToolbar() {
        js.exec("\$('#floating-save').css('display', 'block');")
    }

    def markAsComplete() {
        $("[data-bind*=\"markedAsFinished\"]").value(true)
    }

    boolean isOptional(String sectionId) {
        String sectionSelector = '#'+sectionId + " input[data-bind*=outputNotComplete]"
        $(sectionSelector).displayed
    }

    def markAsNotApplicable(String sectionId) {
        String sectionSelector = '#'+sectionId + " input[data-bind*=outputNotComplete]"
        $(sectionSelector).value(true)
    }

    List getFormSections() {
        $('.output-block')*.@id
    }

    def save() {
        saveButton.click()
        waitFor {
            $('.blockOverlay').displayed
        }
        waitFor {
            !($('.blockOverlay').displayed)
        }
    }

    def exitReport() {
        exitButton.click()
    }

    def getReport() {
        return reportContent
    }
}
