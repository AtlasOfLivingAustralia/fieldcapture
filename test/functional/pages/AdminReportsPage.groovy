package pages

import geb.Page

class AdminReportsPage extends Page {

    static url = "admin/adminReports"

    static at = { waitFor { title.startsWith("Admin Reports")}}

    static content = {
        period {$('select#reportPeriodOfManagementUnit',0)}
        downloadReportBtn(required:false) {$('a#muReportDownload')}
        showDownloadDetailsIcon(required:false) { $('i.showDownloadDetailsIcon')}
        muReportDownloadLink(required:false) {$('a#muReportDownloadLink')}
    }

    def selectedPeriod(){
        period.value()
    }

}