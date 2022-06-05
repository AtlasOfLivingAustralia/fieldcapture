package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        externalIds {$('.externalIds').module(ExternalIds)}
        projectState {$('#projectState')}
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        saveChangesButton {$('button[data-bind*=saveSettings]')}
        terminationReason (required: false) { $("#terminationReason") }

    }

    List internalOrderIds() {
        externalIds.idsByType('INTERNAL_ORDER_NUMBER')
    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }

    def saveChanges() {
        saveChangesButton.click()
    }

    def externalIdsErrorDisplayed() {
        Thread.sleep(500)
        $('.parentFormsettings-validation.formError').displayed
    }
}
