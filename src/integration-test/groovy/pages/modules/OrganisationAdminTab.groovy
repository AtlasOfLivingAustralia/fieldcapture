package pages.modules

import geb.Module

class OrganisationAdminTab extends Module{

    static content = {

        editButton{ $('[data-bind="click:editOrganisation"]')}
        deleteButton{ $('[data-bind="click:deleteOrganisation"]')}

        editTab { $('#edit-program-details-tab') }

        configTab(required:false) { $('#config-tab')}
        config(required:false) { $('#config').module OrganisationConfigModule }

        reportingSectionTab(required:false) { $('#reporting-config-tab') }
        reportingSection(required:false) { $('#reporting-config').module OrganisationAdminReportSection }

    }

    def viewEditSection() {
        waitFor { editTab.displayed }
        editTab.click()
        waitFor { editButton.displayed }
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
