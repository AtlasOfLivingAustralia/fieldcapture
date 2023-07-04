package pages.modules

import geb.Module

class OrganisationAdminTab extends Module{

    static content = {

        editButton{$('[data-bind="click:editOrganisation"]')}
        deleteButton{ $('[data-bind="click:deleteOrganisation"]')}

        configTab(required:false) { $('#configuration-tab')}
        config(required:false) { $('#config').module OrganisationConfigModule }

        reportingSectionTab(required:false) { $('#reporting-tab') }
        reportingSection(required:false) { $('#reporting-config').module OrganisationAdminReportSection }

    }

    def openConfig() {
        configTab.click()
        waitFor { config.displayed }
    }

    def viewReportingSection() {
        waitFor{ reportingSectionTab.displayed }
        reportingSectionTab.click()
        waitFor {
            reportingSection.displayed
        }
        reportingSection
    }

}
