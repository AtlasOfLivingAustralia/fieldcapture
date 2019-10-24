package pages

import geb.Page

class AdminReportsPage extends Page {

    static url = "admin/adminReports"

    static at = { waitFor { title.startsWith("Admin Reports")}}

    static content = {
        period {$('select#reportPeriodOfManagementUnit',0)}
        downloadReportBtn {$('button#muReportDownload')}
    }

    def selectedPeriod(){
        period.value()
    }

}
