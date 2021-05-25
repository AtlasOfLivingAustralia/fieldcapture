package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        internalOrderId {$('#internalOrderId')}
        projectState {$('#projectState')}
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        saveChangesButton {$('button[data-bind*=saveSettings]')}
        terminationReason (required: false) { $("#terminationReason") }

    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }

    def saveChanges() {
        saveChangesButton.click()
    }

    def internalOrderIdErrorDisplayed() {
        Thread.sleep(500)
        $('.internalOrderIdformError.parentFormsettings-validation.formError').displayed
    }
}
