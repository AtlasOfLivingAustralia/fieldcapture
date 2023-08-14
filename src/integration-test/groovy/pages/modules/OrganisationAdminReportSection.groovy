package pages.modules

import geb.Module
import geb.module.FormElement
import geb.module.Checkbox

class OrganisationAdminReportSection extends Module {

    static content = {
        enableButton {$('#enable-reporting')}
        startDate { $('#start-date')}
        endDate { $('#end-date')}
        saveButton {$('[data-bind*="saveReportingConfiguration"]')}


    }

    def saveReportingConfiguration() {
        saveButton.click()
    }

    def clickEnableRegeneration(int index) {
        $('.categories-to-regenerate input[type="checkbox"]')[index].module(Checkbox).check()
    }

    def generateReports() {
        waitFor {
            $('#generate-reports').module(FormElement).enabled
        }
        $('#generate-reports').click()
    }
}
