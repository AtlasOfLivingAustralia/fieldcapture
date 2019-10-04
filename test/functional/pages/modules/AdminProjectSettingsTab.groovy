package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }
}