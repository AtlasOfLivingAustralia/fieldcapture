package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        fundingType{$("#fundingType")}
        fundingSource{$("#fundingSource")}
        fundingSourceAmount{$("#fundingSourceAmount")}
        save{$("#saveSettings")}

        addFunding{ $("#addFunding")}
    }

    def regenerateReports() {
        regenerateReportsButton.click()
    }
    void AddFunding(){
        addFunding.click()
    }
}
