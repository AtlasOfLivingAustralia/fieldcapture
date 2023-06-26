package pages.modules

import geb.Module

class OrganisationAdminReportSection extends Module {

    static content = {
        regionalCapacityServicesGroup { $('#regional-capacity-services-group')}
        saveButton {$('[data-bind*="saveReportingConfiguration"]')}
    }

    def saveReportingGroups() {
        saveButton.click()
    }
}
