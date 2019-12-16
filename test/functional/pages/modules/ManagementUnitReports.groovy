package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class ManagementUnitReports extends Module {

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


}
