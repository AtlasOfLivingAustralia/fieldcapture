package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        workOrderId {$('#workOrderId')}
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

    def workOrderErrorDisplayed() {
        $('.workOrderIdformError.parentFormsettings-validation.formError').displayed
    }
}
