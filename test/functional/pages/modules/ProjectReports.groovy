package pages.modules

import geb.Module
import org.openqa.selenium.StaleElementReferenceException

class ProjectReports extends Module {

    static content = {
        reports {
            try {
                $('#reporting-content tbody tr').moduleList(ReportSummaryLine)
            }
            catch (StaleElementReferenceException e) {
                return []
            }
        }
    }

}
