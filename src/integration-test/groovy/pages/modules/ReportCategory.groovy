package pages.modules

import geb.Module
import geb.module.Checkbox

class ReportCategory extends Module {

    static content = {
        category { $('h3').text() }
        reports { $('tbody tr').moduleList(ReportSummaryLine)}
        showAllReportsCheckbox(required:false) { $('.hide-future-reports').module(Checkbox) }
    }

    def showAllReports() {
        showAllReportsCheckbox.check()
    }
}
