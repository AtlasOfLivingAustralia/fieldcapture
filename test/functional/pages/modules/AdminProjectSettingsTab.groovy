package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        internalOrderId {$('#internalOrderId')}
        projectState {$('#projectState')}
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        saveChangesButton {$('button[data-bind*=saveSettings]')}
    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }

    def saveChanges() {
        saveChangesButton.click()
    }

    def internalOrderIdErrorDisplayed() {
        $('.internalOrderIdformError.parentFormsettings-validation.formError').displayed
    }
}
