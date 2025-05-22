package pages

import geb.Page
import geb.module.Checkbox
import geb.navigator.Navigator
import geb.waiting.WaitTimeoutException
import pages.modules.DocumentDialog
import pages.modules.ReportContentModule
import pages.modules.TimeoutModal

/**
 * This page represents a page where a user can enter data for an
 * activity or a report.
 * At the moment it is used to represent both activity/enterData.gsp and activity/activityReport.gsp
 */
class ReportPage extends Page {

    static at = {
        waitFor{ $('#koActivityMainBlock').displayed }
    }

    static content = {
        reportContent {module ReportContentModule }
        saveButton { $('#nav-buttons button[data-bind$=save') }
        exitButton(required:false) { $('#nav-buttons button[data-bind*=exitReport') } // activityReport.gsp
        cancelButton(required:false) { $('#cancel')} // enterData.gsp
        timeoutModal(required: false) { $('div.bootbox.modal').module TimeoutModal }
        unsavedEdits(required: false) { $('div.bootbox') }
        editAnyway (required: false) { $(".alert .btn")}
        attachDocumentModal (required: false) { $("#attachDocument").module(DocumentDialog) }
        doAttach (required: false) { $("#RLP_-_Baseline_data-content .model-form .table.assuranceDocuments .btn#doAttach") }
        attachDocument (required: false) { $("#RLP_-_Baseline_data-content .model-form .table.assuranceDocuments tr td").first() }
        overDeliveryModal(required: false) { $('div.bootbox')}
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

    def field(String name, Navigator parent) {

        Navigator fields = parent.find("input[data-bind*="+name+"]")
        if (fields.size() == 0) {
            fields = parent.find("select[data-bind*="+name+"]")
        }
        if (fields.size() == 0) {
            fields = parent.find("[data-bind*="+name+"]")
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
        // Clicking on the label instead of the checkbox due to a random (rare) element not clickable exception in the tests
        // that indicated the label would receive the click
        $("label.mark-complete").click()
    }

    boolean isOptional(String sectionId) {
        String sectionSelector = '#'+sectionId + " input[data-bind*=outputNotComplete]"
        $(sectionSelector).displayed
    }

    def markAsNotApplicable(String sectionId) {
        notApplicableCheckbox(sectionId).value(true)
    }

    Navigator notApplicableCheckbox(String sectionId) {
        String sectionSelector = '#'+sectionId + " input[data-bind*=outputNotComplete]"
        $(sectionSelector)
    }

    List getFormSections() {
        $('.output-block')*.@id
    }

    def save() {
        saveButton.click()
        try {
            waitFor {
                $('.blockOverlay').displayed
            }
        }
        catch (WaitTimeoutException e) {
            // Just in case the save happens quickly, or appears and disappears in between a wait check.
        }

        waitFor {
            !($('.blockOverlay').displayed)
        }
    }

    def exitReport() {
        if (exitButton.displayed) {
            exitButton.click()
        }
        else if (cancelButton.displayed) {
            cancelButton.click()
        }
        else {
            throw new RuntimeException("The page has neither the exit nor cancel button")
        }

    }

    def getReport() {
        return reportContent
    }

    def moveToDocumentAttachSection() {
        interact {
            moveToElement($("#RLP_-_Baseline_data-content .model-form .table.assuranceDocuments"))
        }
    }

    def openAttachDocumentDialog() {
        doAttach.click()
        Thread.sleep(1000) // wait for the modal to animate onto the page.
    }
}
