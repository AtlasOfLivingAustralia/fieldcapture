package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        fundingType{$("#rlp")}
        funding{$("#funding")}
        save{$("#saveSettings")}

    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }
}
