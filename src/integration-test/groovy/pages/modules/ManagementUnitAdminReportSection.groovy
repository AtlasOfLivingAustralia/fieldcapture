package pages.modules

import geb.Module

class ManagementUnitAdminReportSection extends Module {

    static content = {
        coreServicesGroup { $('#core-services-group')}
        projectOutputReportingGroup { $('#progress-reporting-group') }
        saveButton {$('[data-bind*="saveReportingConfiguration"]')}
    }

    def saveReportingGroups() {
        saveButton.click()
    }
}
