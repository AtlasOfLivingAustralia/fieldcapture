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
        reportDeclaration { $('#declaration') }
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


}
