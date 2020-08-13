package pages.modules

import geb.Module

class AdminProjectSettingsTab extends Module {
    static content = {
        regenerateReportsButton {$('button[data-bind*=regenerateStageReports]')}
        fundings {moduleList(Funding)}
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
class Funding extends Module{
    static content = {
        fundingSource{$(".fundingSource")}
        fundingSourceAmount{$(".fundingSourceAmount")}
    }
}
