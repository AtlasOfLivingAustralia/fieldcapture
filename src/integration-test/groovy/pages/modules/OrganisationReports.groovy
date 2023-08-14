package pages.modules

import geb.Module
import geb.module.Checkbox
import org.openqa.selenium.StaleElementReferenceException

class OrganisationReports extends Module {

    static content = {
        projects {

        }
        reports {
            try {
                $('#reporting-content tbody tr').moduleList(ReportSummaryLine)
            }
            catch (StaleElementReferenceException e) {
                return []
            }
        }
        reasonModal(required:false) { $('#reason-modal') }
        notRequiredReason(required:false) { $('#reason-modal [id="reason"]') }
    }

    def acceptTerms() {
        $('#declaration [name="acceptTerms"]').value(true)
    }
    def submitDeclaration() {
        $('#declaration [data-bind*="submitReport"]').click()
    }

    def showAllReports() {
        $('.hide-future-reports').module(Checkbox).check()
    }

    def cancellationReason(String reason) {

        waitFor { notRequiredReason.displayed }
        notRequiredReason.value('reason')
    }

    def confirmCancellation() {
        def confirmButton =  $('#reason-modal [data-bind*="submit"]')
        waitFor 10, { confirmButton.displayed }
        confirmButton.click()
    }


}
