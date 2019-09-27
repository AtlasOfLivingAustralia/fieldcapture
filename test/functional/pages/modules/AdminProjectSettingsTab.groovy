package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        regenerateReportsButton {$('#regenerateReports')}
    }
}