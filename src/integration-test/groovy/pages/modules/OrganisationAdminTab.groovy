package pages.modules

import geb.Module

class OrganisationAdminTab extends Module{

    static content = {

        editButton{$('[data-bind="click:editOrganisation"]')}
        deleteButton{ $('[data-bind="click:deleteOrganisation"]')}

        configOverrideTab(required:false) { $('#configuration-tab')}
        configOverride(required:false) { $('#config').module OrganisationConfigModule }

        reportingSectionTab(required:false) { $('#reporting-tab') }
        reportingSection(required:false) { $('#reporting-config').module OrganisationAdminReportSection }

    }

    def openConfig() {
        configOverrideTab.click()
        waitFor { configOverride.displayed }
    }

    def viewReportingSection() {
        reportingSectionTab.click()
        waitFor {
            reportingSection.displayed
        }
        reportingSection
    }

}
